// src/customers/infrastructure/repositories/customer.repository.ts
import { Injectable } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });
    return customers as unknown as Customer[];
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    return customer as unknown as Customer | null;
  }

  async findByDocument(documentNumber: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { documentNumber },
    });
    return customer as unknown as Customer | null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findFirst({
      where: { email },
    });
    return customer as unknown as Customer | null;
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    return customer as unknown as Customer | null;
  }

  async findTopCustomers(limit: number): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany({
      orderBy: { loyaltyPoints: 'desc' },
      take: limit,
    });
    return customers as unknown as Customer[];
  }

  async findBirthdaysInMonth(month: number): Promise<Customer[]> {
    // Usando raw SQL com Prisma para extrair mês da data de aniversário
    const customers = await this.prisma.$queryRaw`
      SELECT * FROM "Customer"
      WHERE EXTRACT(MONTH FROM "birthDate") = ${month}
      ORDER BY EXTRACT(DAY FROM "birthDate") ASC
    `;

    return customers as unknown as Customer[];
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    if (
      !data.name ||
      !data.documentType ||
      !data.documentNumber ||
      !data.phone ||
      !data.email ||
      !data.address ||
      !data.city ||
      !data.state ||
      !data.zipCode
    ) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    // Garantir que loyaltyPoints seja inicializado para novos clientes
    const loyaltyPoints = data.loyaltyPoints ?? 0;

    const customer = await this.prisma.customer.create({
      data: {
        name: data.name,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        birthDate: data.birthDate ?? null,
        phone: data.phone,
        email: data.email,
        instagram: data.instagram ?? null,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        bodyMeasurements: data.bodyMeasurements ?? null,
        loyaltyPoints: loyaltyPoints,
        preferences: data.preferences ?? null,
        observations: data.observations ?? null,
        userId: data.userId ?? null,
      },
    });
    return customer as unknown as Customer;
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: data as any,
    });
    return customer as unknown as Customer;
  }

  async updateLoyaltyPoints(id: string, points: number): Promise<Customer> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        loyaltyPoints: {
          increment: points,
        },
      },
    });
    return customer as unknown as Customer;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: { id },
    });
  }
}
