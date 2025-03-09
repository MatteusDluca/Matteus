import { MaintenanceLogService } from '../../application/services/maintenance-log.service';
import { CreateMaintenanceLogDto, UpdateMaintenanceLogDto, CompleteMaintenanceLogDto } from '../../application/dtos/maintenance-log.dto';
import { MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
export declare class MaintenanceLogController {
    private readonly maintenanceLogService;
    constructor(maintenanceLogService: MaintenanceLogService);
    findAll(): Promise<import("../../domain/entities/maintenance-log.entity").MaintenanceLog[]>;
    findByProductId(productId: string): Promise<import("../../domain/entities/maintenance-log.entity").MaintenanceLog[]>;
    findActiveByProductId(productId: string): Promise<import("../../domain/entities/maintenance-log.entity").MaintenanceLog[]>;
    findByStatus(status: MaintenanceStatus): Promise<import("../../domain/entities/maintenance-log.entity").MaintenanceLog[]>;
    findOne(id: string): Promise<import("../../domain/entities/maintenance-log.entity").MaintenanceLog>;
    create(createMaintenanceLogDto: CreateMaintenanceLogDto): Promise<import("../../domain/entities/maintenance-log.entity").MaintenanceLog>;
    update(id: string, updateMaintenanceLogDto: UpdateMaintenanceLogDto): Promise<import("../../domain/entities/maintenance-log.entity").MaintenanceLog>;
    completeMaintenance(id: string, completeMaintenanceLogDto: CompleteMaintenanceLogDto): Promise<import("../../domain/entities/maintenance-log.entity").MaintenanceLog>;
    remove(id: string): Promise<void>;
}
