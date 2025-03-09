// src/contracts/infrastructure/repositories/payment.repository.ts
import { Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToPayment(payment: any): Payment {
    return {
      ...payment,
      // Converter Decimal para number
      amount: payment.amount ? Number(payment.amount.toString()) : 0,
    } as Payment;
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return payments.map((payment) => this.mapToPayment(payment));
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });
    return payment ? this.mapToPayment(payment) : null;
  }

  async findByContractId(contractId: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { contractId },
      orderBy: { createdAt: 'desc' },
    });
    return payments.map((payment) => this.mapToPayment(payment));
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
    return payments.map((payment) => this.mapToPayment(payment));
  }

  async create(data: Partial<Payment>): Promise<Payment> {
    const payment = await this.prisma.payment.create({
      data: {
        contractId: data.contractId,
        amount: data.amount as any,
        method: data.method,
        status: data.status || PaymentStatus.PENDING,
        installments: data.installments || 1,
        reference: data.reference,
        paidAt: data.paidAt,
        dueDate: data.dueDate,
      },
    });
    return this.mapToPayment(payment);
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: data as any,
    });
    return this.mapToPayment(payment);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: { status },
    });
    return this.mapToPayment(payment);
  }

  async markAsPaid(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    });
    return this.mapToPayment(payment);
  }

  async sumPaymentsByContractId(contractId: string): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: {
        contractId,
        status: PaymentStatus.PAID,
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ? Number(result._sum.amount.toString()) : 0;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payment.delete({
      where: { id },
    });
  }
}
