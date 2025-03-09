import { MaintenanceLog, MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
import { IMaintenanceLogRepository } from '../../domain/repositories/maintenance-log.repository.interface';
import { CreateMaintenanceLogDto, UpdateMaintenanceLogDto, CompleteMaintenanceLogDto } from '../dtos/maintenance-log.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
export declare class MaintenanceLogService extends BaseService<MaintenanceLog> {
    private readonly maintenanceLogRepository;
    private readonly productRepository;
    constructor(maintenanceLogRepository: IMaintenanceLogRepository, productRepository: IProductRepository);
    findAll(): Promise<MaintenanceLog[]>;
    findByProductId(productId: string): Promise<MaintenanceLog[]>;
    findActiveByProductId(productId: string): Promise<MaintenanceLog[]>;
    findByStatus(status: MaintenanceStatus): Promise<MaintenanceLog[]>;
    create(createMaintenanceLogDto: CreateMaintenanceLogDto): Promise<MaintenanceLog>;
    update(id: string, updateMaintenanceLogDto: UpdateMaintenanceLogDto): Promise<MaintenanceLog>;
    completeMaintenance(id: string, completeDto: CompleteMaintenanceLogDto): Promise<MaintenanceLog>;
    delete(id: string): Promise<void>;
}
