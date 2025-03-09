// src/auth/domain/entities/audit-log.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export class AuditLog extends BaseEntity {
  userId: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}
