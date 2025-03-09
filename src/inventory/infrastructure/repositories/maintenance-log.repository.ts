// src/inventory/infrastructure/repositories/maintenance-log.repository.ts
import { Injectable } from '@nestjs/common';
import { MaintenanceLog, MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
import { IMaintenanceLogRepository } from '../../domain/repositories/maintenance-log.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MaintenanceLogRepository implements IMaintenanceLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MaintenanceLog[]> {
    const logs = await this.prisma.maintenanceLog.findMany({
      orderBy: { startDate: 'desc' },
    });
    return logs as unknown as MaintenanceLog[];
  }

  async findById(id: string): Promise<MaintenanceLog | null> {
    const log = await this.prisma.maintenanceLog.findUnique({
      where: { id },
    });
    return log as unknown as MaintenanceLog | null;
  }

  async findByProductId(productId: string): Promise<MaintenanceLog[]> {
    const logs = await this.prisma.maintenanceLog.findMany({
      where: { productId },
      orderBy: { startDate: 'desc' },
    });
    return logs as unknown as MaintenanceLog[];
  }

  async findActiveByProductId(productId: string): Promise<MaintenanceLog[]> {
    const logs = await this.prisma.maintenanceLog.findMany({
      where: {
        productId,
        status: {
          in: [MaintenanceStatus.SCHEDULED, MaintenanceStatus.IN_PROGRESS],
        },
      },
      orderBy: { startDate: 'asc' },
    });
    return logs as unknown as MaintenanceLog[];
  }

  async findByStatus(status: MaintenanceStatus): Promise<MaintenanceLog[]> {
    const logs = await this.prisma.maintenanceLog.findMany({
      where: { status },
      orderBy: { startDate: 'asc' },
    });
    return logs as unknown as MaintenanceLog[];
  }

  async create(data: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
    if (!data.productId || !data.description || !data.startDate || !data.status) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    const cost =
      data.cost !== undefined ? new Prisma.Decimal(data.cost as unknown as string) : null;

    const log = await this.prisma.maintenanceLog.create({
      data: {
        productId: data.productId,
        description: data.description,
        cost: cost as any,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        status: data.status,
      },
    });
    return log as unknown as MaintenanceLog;
  }

  async update(id: string, data: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
    const updateData: any = { ...data };

    if (data.cost !== undefined) {
      updateData.cost = new Prisma.Decimal(data.cost as unknown as string);
    }

    const log = await this.prisma.maintenanceLog.update({
      where: { id },
      data: updateData,
    });
    return log as unknown as MaintenanceLog;
  }

  async completeMaintenanceLog(id: string, endDate: Date): Promise<MaintenanceLog> {
    const log = await this.prisma.maintenanceLog.update({
      where: { id },
      data: {
        endDate,
        status: MaintenanceStatus.COMPLETED,
      },
    });
    return log as unknown as MaintenanceLog;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.maintenanceLog.delete({
      where: { id },
    });
  }
}
