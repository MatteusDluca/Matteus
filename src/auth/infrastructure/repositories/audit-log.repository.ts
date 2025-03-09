// src/auth/infrastructure/repositories/audit-log.repository.ts
import { Injectable } from '@nestjs/common';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AuditLog[]> {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return logs as unknown as AuditLog[];
  }

  async findById(id: string): Promise<AuditLog | null> {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
    });
    return log as unknown as AuditLog | null;
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return logs as unknown as AuditLog[];
  }

  async findByResource(resource: string): Promise<AuditLog[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { resource },
      orderBy: { createdAt: 'desc' },
    });
    return logs as unknown as AuditLog[];
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' },
    });
    return logs as unknown as AuditLog[];
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return logs as unknown as AuditLog[];
  }

  async create(data: Partial<AuditLog>): Promise<AuditLog> {
    if (!data.userId || !data.action || !data.resource) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    const log = await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        details: data.details ?? null,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    });
    return log as unknown as AuditLog;
  }

  async update(id: string, data: Partial<AuditLog>): Promise<AuditLog> {
    const log = await this.prisma.auditLog.update({
      where: { id },
      data: data as any,
    });
    return log as unknown as AuditLog;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.auditLog.delete({
      where: { id },
    });
  }
}
