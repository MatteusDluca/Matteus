import { MaintenanceLog, MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
import { IMaintenanceLogRepository } from '../../domain/repositories/maintenance-log.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class MaintenanceLogRepository implements IMaintenanceLogRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<MaintenanceLog[]>;
    findById(id: string): Promise<MaintenanceLog | null>;
    findByProductId(productId: string): Promise<MaintenanceLog[]>;
    findActiveByProductId(productId: string): Promise<MaintenanceLog[]>;
    findByStatus(status: MaintenanceStatus): Promise<MaintenanceLog[]>;
    create(data: Partial<MaintenanceLog>): Promise<MaintenanceLog>;
    update(id: string, data: Partial<MaintenanceLog>): Promise<MaintenanceLog>;
    completeMaintenanceLog(id: string, endDate: Date): Promise<MaintenanceLog>;
    delete(id: string): Promise<void>;
}
