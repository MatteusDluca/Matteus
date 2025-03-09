import { BaseEntity } from '../../../shared/domain/entities/base.entity';
export declare enum MaintenanceStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class MaintenanceLog extends BaseEntity {
    productId: string;
    description: string;
    cost?: number;
    startDate: Date;
    endDate?: Date;
    status: MaintenanceStatus;
}
