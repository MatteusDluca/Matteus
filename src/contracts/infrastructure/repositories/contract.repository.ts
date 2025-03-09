// src/contracts/infrastructure/repositories/contract.repository.ts
import { Injectable } from '@nestjs/common';
import { Contract, ContractStatus } from '../../domain/entities/contract.entity';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContractRepository implements IContractRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Contract[]> {
    const contracts = await this.prisma.contract.findMany({
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return contracts as unknown as Contract[];
  }

  async findById(id: string): Promise<Contract | null> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
    return contract as unknown as Contract | null;
  }

  async findByContractNumber(contractNumber: string): Promise<Contract | null> {
    const contract = await this.prisma.contract.findUnique({
      where: { contractNumber },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
    return contract as unknown as Contract | null;
  }

  async findByCustomerId(customerId: string): Promise<Contract[]> {
    const contracts = await this.prisma.contract.findMany({
      where: { customerId },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return contracts as unknown as Contract[];
  }

  async findByEmployeeId(employeeId: string): Promise<Contract[]> {
    const contracts = await this.prisma.contract.findMany({
      where: { employeeId },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return contracts as unknown as Contract[];
  }

  async findByEventId(eventId: string): Promise<Contract[]> {
    const contracts = await this.prisma.contract.findMany({
      where: { eventId },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return contracts as unknown as Contract[];
  }

  async findByStatus(status: ContractStatus): Promise<Contract[]> {
    const contracts = await this.prisma.contract.findMany({
      where: { status },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return contracts as unknown as Contract[];
  }

  async findLateContracts(): Promise<Contract[]> {
    const today = new Date();

    const contracts = await this.prisma.contract.findMany({
      where: {
        returnDate: { lt: today },
        status: {
          in: [ContractStatus.PICKED_UP, ContractStatus.PAID],
        },
      },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { returnDate: 'asc' },
    });
    return contracts as unknown as Contract[];
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    field: 'pickupDate' | 'returnDate',
  ): Promise<Contract[]> {
    const contracts = await this.prisma.contract.findMany({
      where: {
        [field]: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { [field]: 'asc' },
    });
    return contracts as unknown as Contract[];
  }

  async create(data: Partial<Contract>): Promise<Contract> {
    // Garantir que campos obrigatórios não sejam undefined
    if (
      !data.customerId ||
      !data.employeeId ||
      !data.contractNumber ||
      !data.pickupDate ||
      !data.returnDate
    ) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    // Converter números para Decimal
    const totalAmount =
      data.totalAmount !== undefined
        ? new Prisma.Decimal(data.totalAmount as unknown as string)
        : undefined;

    const depositAmount =
      data.depositAmount !== undefined
        ? new Prisma.Decimal(data.depositAmount as unknown as string)
        : undefined;

    const contract = await this.prisma.contract.create({
      data: {
        customerId: data.customerId,
        employeeId: data.employeeId,
        eventId: data.eventId || null, // Permite null para eventId
        contractNumber: data.contractNumber,
        fittingDate: data.fittingDate || null, // Permite null para fittingDate
        pickupDate: data.pickupDate,
        returnDate: data.returnDate,
        status: data.status || ContractStatus.DRAFT,
        totalAmount: totalAmount as any,
        depositAmount: depositAmount as any,
        specialConditions: data.specialConditions || null,
        observations: data.observations || null,
      },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: true,
        payments: true,
      },
    });
    return contract as unknown as Contract;
  }

  async update(id: string, data: Partial<Contract>): Promise<Contract> {
    const updateData: any = { ...data };

    // Converter números para Decimal quando necessário
    if (data.totalAmount !== undefined) {
      updateData.totalAmount = new Prisma.Decimal(data.totalAmount as unknown as string);
    }

    if (data.depositAmount !== undefined) {
      updateData.depositAmount =
        data.depositAmount !== null
          ? new Prisma.Decimal(data.depositAmount as unknown as string)
          : null;
    }

    const contract = await this.prisma.contract.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
    return contract as unknown as Contract;
  }

  async updateStatus(id: string, status: ContractStatus): Promise<Contract> {
    const contract = await this.prisma.contract.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
    return contract as unknown as Contract;
  }

  async calculateTotalAmount(id: string): Promise<number> {
    const items = await this.prisma.contractItem.findMany({
      where: { contractId: id },
    });

    return items.reduce((total, item) => {
      // Converter o Decimal para number
      const subtotal =
        typeof item.subtotal === 'object' && 'toNumber' in item.subtotal
          ? (item.subtotal as any).toNumber()
          : Number(item.subtotal);
      return total + subtotal;
    }, 0);
  }

  async countContractsByMonthYear(): Promise<{ month: number; year: number; count: number }[]> {
    // Usar template literal correto para consulta SQL
    const result = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "createdAt")::integer as month, 
        EXTRACT(YEAR FROM "createdAt")::integer as year,
        COUNT(*)::integer as count
      FROM "Contract"
      GROUP BY month, year
      ORDER BY year, month
    `;

    return result as { month: number; year: number; count: number }[];
  }

  async sumContractValuesByMonthYear(): Promise<{ month: number; year: number; total: number }[]> {
    // Usar template literal correto para consulta SQL
    const result = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "createdAt")::integer as month, 
        EXTRACT(YEAR FROM "createdAt")::integer as year,
        SUM("totalAmount")::float as total
      FROM "Contract"
      WHERE "status" NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY month, year
      ORDER BY year, month
    `;

    return result as { month: number; year: number; total: number }[];
  }

  async delete(id: string): Promise<void> {
    // Excluir itens do contrato e pagamentos primeiro (cascade)
    await this.prisma.contractItem.deleteMany({
      where: { contractId: id },
    });

    await this.prisma.payment.deleteMany({
      where: { contractId: id },
    });

    // Excluir o contrato
    await this.prisma.contract.delete({
      where: { id },
    });
  }
}
