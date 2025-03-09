// src/inventory/domain/entities/maintenance-log.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class MaintenanceLog extends BaseEntity {
  productId: string;
  description: string;
  cost?: number;
  startDate: Date;
  endDate?: Date;
  status: MaintenanceStatus;
}
