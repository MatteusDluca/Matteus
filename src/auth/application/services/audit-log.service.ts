// src/auth/application/services/audit-log.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { CreateAuditLogDto } from '../dtos/audit-log.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
export class AuditLogService extends BaseService<AuditLog> {
  constructor(
    @Inject('IAuditLogRepository')
    private readonly auditLogRepository: IAuditLogRepository,
  ) {
    super(auditLogRepository);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll();
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUserId(userId);
  }

  async findByResource(resource: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByResource(resource);
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByAction(action);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogRepository.findByDateRange(startDate, endDate);
  }

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditLogRepository.create(createAuditLogDto);
  }
}
