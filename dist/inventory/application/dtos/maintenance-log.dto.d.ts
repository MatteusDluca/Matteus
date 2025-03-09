import { MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
export declare class CreateMaintenanceLogDto {
    productId: string;
    description: string;
    cost?: number;
    startDate: Date;
    endDate?: Date;
    status: MaintenanceStatus;
}
export declare class UpdateMaintenanceLogDto {
    description?: string;
    cost?: number;
    startDate?: Date;
    endDate?: Date;
    status?: MaintenanceStatus;
}
export declare class CompleteMaintenanceLogDto {
    endDate: Date;
}
export declare class MaintenanceLogResponseDto {
    id: string;
    productId: string;
    description: string;
    cost?: number;
    startDate: Date;
    endDate?: Date;
    status: MaintenanceStatus;
    createdAt: Date;
    updatedAt: Date;
}
