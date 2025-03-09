// src/auth/domain/repositories/audit-log.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { AuditLog } from '../entities/audit-log.entity';

export interface IAuditLogRepository extends IBaseRepository<AuditLog> {
  findByUserId(userId: string): Promise<AuditLog[]>;
  findByResource(resource: string): Promise<AuditLog[]>;
  findByAction(action: string): Promise<AuditLog[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>;
}
