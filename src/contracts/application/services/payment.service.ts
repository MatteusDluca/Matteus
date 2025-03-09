// src/contracts/application/services/payment.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { CreatePaymentDto, UpdatePaymentDto } from '../dtos/payment.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ContractStatus } from '../../domain/entities/contract.entity';
import { NotificationService } from './notification.service';
import { NotificationType } from '../../domain/entities/notification.entity';

@Injectable()
export class PaymentService extends BaseService<Payment> {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    @Inject('IContractRepository')
    private readonly contractRepository: IContractRepository,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
  ) {
    super(paymentRepository);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findByContractId(contractId: string): Promise<Payment[]> {
    // Verificar se o contrato existe
    const contractExists = await this.contractRepository.findById(contractId);
    if (!contractExists) {
      throw new NotFoundException(`Contrato com ID ${contractId} não encontrado`);
    }

    return this.paymentRepository.findByContractId(contractId);
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return this.paymentRepository.findByStatus(status);
  }

  async create(data: Partial<Payment> | CreatePaymentDto): Promise<Payment> {
    const createPaymentDto = data as CreatePaymentDto;
    // Verificar se o contrato existe
    const contract = await this.contractRepository.findById(createPaymentDto.contractId);
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${createPaymentDto.contractId} não encontrado`);
    }

    // Verificar se o contrato está assinado ou pago
    if (
      contract.status !== ContractStatus.SIGNED &&
      contract.status !== ContractStatus.PAID &&
      contract.status !== ContractStatus.PICKED_UP
    ) {
      throw new BadRequestException(
        'O contrato deve estar assinado ou pago para registrar pagamentos',
      );
    }

    // Verificar o valor total já pago
    const paidAmount = await this.paymentRepository.sumPaymentsByContractId(contract.id);
    const pendingAmount = contract.totalAmount - paidAmount;

    // Verificar se o valor não ultrapassa o total
    if (createPaymentDto.amount > pendingAmount) {
      throw new BadRequestException(
        `Valor excede o saldo pendente. Valor pendente: ${pendingAmount.toFixed(2)}`,
      );
    }

    // Converta o DTO para um objeto Payment apropriado
    const paymentData: Partial<Payment> = {
      ...createPaymentDto,
      // O repositório tratará a conversão para Decimal
    };
    const payment = await this.paymentRepository.create(paymentData);

    // Se o pagamento for marcado como pago na criação
    if (payment.status === PaymentStatus.PAID) {
      // Enviar notificação de confirmação
      await this.notificationService.create({
        customerId: contract.customerId,
        type: NotificationType.PAYMENT_CONFIRMATION,
        title: 'Pagamento Confirmado',
        message: `Seu pagamento de R$ ${payment.amount.toFixed(2)} foi confirmado!`,
      });

      // Verificar se o contrato está totalmente pago
      await this.checkContractFullyPaid(contract.id);
    }

    return payment;
  }

  async update(id: string, data: Partial<Payment> | UpdatePaymentDto): Promise<Payment> {
    const updatePaymentDto = data as UpdatePaymentDto;
    // Verificar se o pagamento existe
    const payment = await this.findById(id);

    // Verificar se o contrato existe
    const contract = await this.contractRepository.findById(payment.contractId);
    if (!contract) {
      // Adicionada verificação de nulidade
      throw new NotFoundException(`Contrato com ID ${payment.contractId} não encontrado`);
    }

    // Verificar se está alterando o valor
    if (
      updatePaymentDto.amount &&
      Number(updatePaymentDto.amount) !== Number(payment.amount.toString())
    ) {
      // Calcular o valor total já pago sem este pagamento
      const paidAmount = await this.paymentRepository.sumPaymentsByContractId(payment.contractId);
      const paidAmountWithoutThis =
        payment.status === PaymentStatus.PAID
          ? paidAmount - Number(payment.amount.toString())
          : paidAmount;

      const pendingAmount = contract.totalAmount - paidAmountWithoutThis;

      // Verificar se o novo valor não ultrapassa o total
      if (updatePaymentDto.amount > pendingAmount) {
        throw new BadRequestException(
          `Valor excede o saldo pendente. Valor pendente: ${pendingAmount.toFixed(2)}`,
        );
      }
    }

    // Verificar se está alterando o status para PAGO
    const becomingPaid =
      payment.status !== PaymentStatus.PAID && updatePaymentDto.status === PaymentStatus.PAID;

    // Atualizar o pagamento
    const paymentData: Partial<Payment> = {
      ...updatePaymentDto,
      // Repositório tratará a conversão para Decimal
    };
    const updatedPayment = await this.paymentRepository.update(id, paymentData);

    // Se o pagamento foi marcado como pago nesta atualização
    if (becomingPaid) {
      // Enviar notificação de confirmação
      await this.notificationService.create({
        customerId: contract.customerId,
        type: NotificationType.PAYMENT_CONFIRMATION,
        title: 'Pagamento Confirmado',
        message: `Seu pagamento de R$ ${updatedPayment.amount.toFixed(2)} foi confirmado!`,
      });

      // Verificar se o contrato está totalmente pago
      await this.checkContractFullyPaid(updatedPayment.contractId);
    }

    return updatedPayment;
  }

  async markAsPaid(id: string): Promise<Payment> {
    // Verificar se o pagamento existe
    const payment = await this.findById(id);

    // Verificar se já está pago
    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Este pagamento já está marcado como pago');
    }

    // Verificar se o contrato existe
    const contract = await this.contractRepository.findById(payment.contractId);
    if (!contract) {
      // Adicionada verificação de nulidade
      throw new NotFoundException(`Contrato com ID ${payment.contractId} não encontrado`);
    }

    // Marcar como pago
    const updatedPayment = await this.paymentRepository.markAsPaid(id);

    // Enviar notificação de confirmação
    await this.notificationService.create({
      customerId: contract.customerId,
      type: NotificationType.PAYMENT_CONFIRMATION,
      title: 'Pagamento Confirmado',
      message: `Seu pagamento de R$ ${updatedPayment.amount.toFixed(2)} foi confirmado!`,
    });

    // Verificar se o contrato está totalmente pago
    await this.checkContractFullyPaid(updatedPayment.contractId);

    return updatedPayment;
  }

  async delete(id: string): Promise<void> {
    // Verificar se o pagamento existe
    const payment = await this.findById(id);

    // Verificar se o pagamento está pago
    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Não é possível excluir um pagamento já confirmado');
    }

    // Excluir o pagamento
    await this.paymentRepository.delete(id);
  }

  private async checkContractFullyPaid(contractId: string): Promise<void> {
    // Obter o contrato
    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      // Adicionada verificação de nulidade
      throw new NotFoundException(`Contrato com ID ${contractId} não encontrado`);
    }

    // Calcular o valor total pago
    const paidAmount = await this.paymentRepository.sumPaymentsByContractId(contractId);

    // Verificar se o contrato está totalmente pago
    if (paidAmount >= contract.totalAmount) {
      // Atualizar o status do contrato para PAGO se estiver ASSINADO
      if (contract.status === ContractStatus.SIGNED) {
        await this.contractRepository.updateStatus(contractId, ContractStatus.PAID);
      }
    }
  }
}
