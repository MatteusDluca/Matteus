// src/contracts/application/services/contract.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Contract, ContractStatus } from '../../domain/entities/contract.entity';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { IContractItemRepository } from '../../domain/repositories/contract-item.repository.interface';
import { CreateContractDto, UpdateContractDto } from '../dtos/contract.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../../inventory/domain/repositories/product.repository.interface';
import { ProductStatus } from '../../../inventory/domain/entities/product.entity';
import { NotificationService } from './notification.service';
import { NotificationType } from '../../domain/entities/notification.entity';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface';

@Injectable()
export class ContractService extends BaseService<Contract> {
  constructor(
    @Inject('IContractRepository')
    private readonly contractRepository: IContractRepository,

    @Inject('IContractItemRepository')
    private readonly contractItemRepository: IContractItemRepository,

    @Inject('IProductRepository') // Make sure this matches exactly what's provided
    private readonly productRepository: IProductRepository,

    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,

    private readonly notificationService: NotificationService,
  ) {
    super(contractRepository);
  }

  async findAll(): Promise<Contract[]> {
    return this.contractRepository.findAll();
  }

  async findByContractNumber(contractNumber: string): Promise<Contract> {
    const contract = await this.contractRepository.findByContractNumber(contractNumber);
    if (!contract) {
      throw new NotFoundException(`Contrato com número ${contractNumber} não encontrado`);
    }
    return contract;
  }

  async findByCustomerId(customerId: string): Promise<Contract[]> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(`Cliente com ID ${customerId} não encontrado`);
    }

    return this.contractRepository.findByCustomerId(customerId);
  }

  async findByEmployeeId(employeeId: string): Promise<Contract[]> {
    return this.contractRepository.findByEmployeeId(employeeId);
  }

  async findByEventId(eventId: string): Promise<Contract[]> {
    return this.contractRepository.findByEventId(eventId);
  }

  async findByStatus(status: ContractStatus): Promise<Contract[]> {
    return this.contractRepository.findByStatus(status);
  }

  async findLateContracts(): Promise<Contract[]> {
    return this.contractRepository.findLateContracts();
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    field: 'pickupDate' | 'returnDate',
  ): Promise<Contract[]> {
    if (startDate > endDate) {
      throw new BadRequestException('A data inicial deve ser anterior à data final');
    }

    return this.contractRepository.findByDateRange(startDate, endDate, field);
  }

  async create(data: Partial<Contract> | CreateContractDto): Promise<Contract> {
    const createContractDto = data as CreateContractDto;
    // Validar cliente
    const customer = await this.customerRepository.findById(createContractDto.customerId);
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${createContractDto.customerId} não encontrado`);
    }

    // Validações de data e produtos (conforme o código existente)...

    // Gerar número do contrato
    const year = new Date().getFullYear();
    const sequence = Math.floor(10000 + Math.random() * 90000);
    const contractNumber = `ARC-${year}-${sequence}`;

    // Calcular o valor total
    const totalAmount = createContractDto.items.reduce(
      (total, item) => total + item.quantity * (item.unitPrice || 0),
      0,
    );

    // Separar os itens do contrato para criar depois
    const items = [...createContractDto.items];

    // Criar um objeto Partial<Contract> sem a propriedade 'items'
    const contractData: Partial<Contract> = {
      customerId: createContractDto.customerId,
      employeeId: createContractDto.employeeId,
      eventId: createContractDto.eventId,
      contractNumber,
      fittingDate: createContractDto.fittingDate,
      pickupDate: createContractDto.pickupDate,
      returnDate: createContractDto.returnDate,
      totalAmount,
      status: createContractDto.status || ContractStatus.DRAFT,
      depositAmount: createContractDto.depositAmount,
      specialConditions: createContractDto.specialConditions,
      observations: createContractDto.observations,
    };

    // Criar o contrato
    const contract = await this.contractRepository.create(contractData);

    // Criar os itens do contrato
    await this.contractItemRepository.createBulk(
      createContractDto.items.map((item) => ({
        contractId: contract.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    );

    // Atualizar o estoque dos produtos
    for (const item of createContractDto.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        // Adicionada verificação de nulidade
        await this.productRepository.update(item.productId, {
          quantity: product.quantity - item.quantity,
        });
      }
    }

    // Enviar notificação de confirmação de reserva
    await this.notificationService.create({
      customerId: contract.customerId,
      type: NotificationType.RESERVATION_CONFIRMATION,
      title: 'Reserva Confirmada',
      message: `Sua reserva foi confirmada com sucesso! Número do contrato: ${contractNumber}`,
    });

    // Se tiver data de prova, enviar lembrete de prova
    if (contract.fittingDate) {
      const fittingDate = new Date(contract.fittingDate);
      await this.notificationService.create({
        customerId: contract.customerId,
        type: NotificationType.FITTING_REMINDER,
        title: 'Lembrete de Prova',
        message: `Sua prova está agendada para ${fittingDate.toLocaleDateString()} às ${fittingDate.toLocaleTimeString()}`,
      });
    }

    // Buscar o contrato completo com itens
    return this.findById(contract.id);
  }

  async update(id: string, updateContractDto: UpdateContractDto): Promise<Contract> {
    // Verificar se o contrato existe
    const contract = await this.findById(id);

    // Verificar se o contrato não está finalizado ou cancelado
    if (
      contract.status === ContractStatus.COMPLETED ||
      contract.status === ContractStatus.CANCELLED
    ) {
      throw new BadRequestException('Não é possível atualizar contratos finalizados ou cancelados');
    }

    // Validar datas
    const now = new Date();

    if (updateContractDto.fittingDate && updateContractDto.fittingDate < now) {
      throw new BadRequestException('A data da prova deve ser futura');
    }

    if (updateContractDto.pickupDate && updateContractDto.pickupDate < now) {
      throw new BadRequestException('A data de retirada deve ser futura');
    }

    if (updateContractDto.returnDate && updateContractDto.pickupDate) {
      if (updateContractDto.returnDate < updateContractDto.pickupDate) {
        throw new BadRequestException('A data de devolução deve ser posterior à data de retirada');
      }
    } else if (updateContractDto.returnDate && !updateContractDto.pickupDate) {
      if (updateContractDto.returnDate < contract.pickupDate) {
        throw new BadRequestException('A data de devolução deve ser posterior à data de retirada');
      }
    } else if (!updateContractDto.returnDate && updateContractDto.pickupDate) {
      if (contract.returnDate < updateContractDto.pickupDate) {
        throw new BadRequestException('A data de devolução deve ser posterior à data de retirada');
      }
    }

    // Atualizar o contrato
    return this.contractRepository.update(id, updateContractDto);
  }

  async updateStatus(id: string, status: ContractStatus): Promise<Contract> {
    // Verificar se o contrato existe
    const contract = await this.findById(id);

    // Verificar transições de status válidas
    this.validateStatusTransition(contract.status, status);

    // Atualizar o status do contrato
    const updatedContract = await this.contractRepository.updateStatus(id, status);

    // Executar ações conforme o novo status
    await this.executeStatusActions(updatedContract, status);

    return updatedContract;
  }

  async calculateTotalAmount(id: string): Promise<number> {
    // Verificar se o contrato existe
    await this.findById(id);

    return this.contractRepository.calculateTotalAmount(id);
  }

  async getContractStats(): Promise<{ month: number; year: number; count: number }[]> {
    return this.contractRepository.countContractsByMonthYear();
  }

  async getRevenueStats(): Promise<{ month: number; year: number; total: number }[]> {
    return this.contractRepository.sumContractValuesByMonthYear();
  }

  async delete(id: string): Promise<void> {
    // Verificar se o contrato existe
    const contract = await this.findById(id);

    // Só permitir excluir contratos em rascunho
    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException('Somente contratos em rascunho podem ser excluídos');
    }

    // Obter os itens do contrato
    const items = await this.contractItemRepository.findByContractId(id);

    // Devolver os itens ao estoque
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        // Adicionada verificação de nulidade
        await this.productRepository.update(item.productId, {
          quantity: product.quantity + item.quantity,
        });
      }
    }

    // Excluir o contrato
    return this.contractRepository.delete(id);
  }

  private validateStatusTransition(currentStatus: ContractStatus, newStatus: ContractStatus): void {
    const allowedTransitions: Record<ContractStatus, ContractStatus[]> = {
      [ContractStatus.DRAFT]: [
        ContractStatus.FITTING_SCHEDULED,
        ContractStatus.SIGNED,
        ContractStatus.CANCELLED,
      ],
      [ContractStatus.FITTING_SCHEDULED]: [
        ContractStatus.SIGNED,
        ContractStatus.DRAFT,
        ContractStatus.CANCELLED,
      ],
      [ContractStatus.SIGNED]: [ContractStatus.PAID, ContractStatus.CANCELLED],
      [ContractStatus.PAID]: [ContractStatus.PICKED_UP, ContractStatus.CANCELLED],
      [ContractStatus.PICKED_UP]: [ContractStatus.RETURNED, ContractStatus.LATE],
      [ContractStatus.LATE]: [ContractStatus.RETURNED],
      [ContractStatus.RETURNED]: [ContractStatus.COMPLETED],
      [ContractStatus.CANCELLED]: [],
      [ContractStatus.COMPLETED]: [],
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Transição de status inválida: ${currentStatus} para ${newStatus}`,
      );
    }
  }

  private async executeStatusActions(contract: Contract, status: ContractStatus): Promise<void> {
    switch (status) {
      // ... outros casos ...

      case ContractStatus.RETURNED:
        // Devolver os itens ao estoque
        const returnedItems = await this.contractItemRepository.findByContractId(contract.id);

        for (const item of returnedItems) {
          const product = await this.productRepository.findById(item.productId);
          if (product) {
            // Adicionada verificação de nulidade
            await this.productRepository.update(item.productId, {
              quantity: product.quantity + item.quantity,
              status: ProductStatus.AVAILABLE,
            });
          }
        }
        break;

      case ContractStatus.CANCELLED:
        // Devolver os itens ao estoque se o contrato for cancelado
        if (
          contract.status !== ContractStatus.DRAFT &&
          contract.status !== ContractStatus.FITTING_SCHEDULED
        ) {
          const cancelledItems = await this.contractItemRepository.findByContractId(contract.id);

          for (const item of cancelledItems) {
            const product = await this.productRepository.findById(item.productId);
            if (product) {
              // Adicionada verificação de nulidade
              await this.productRepository.update(item.productId, {
                quantity: product.quantity + item.quantity,
                status: ProductStatus.AVAILABLE,
              });
            }
          }
        }
        break;
    }
  }
}
