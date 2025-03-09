import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { MaintenanceLog, MaintenanceStatus } from '../entities/maintenance-log.entity';
export interface IMaintenanceLogRepository extends IBaseRepository<MaintenanceLog> {
    findByProductId(productId: string): Promise<MaintenanceLog[]>;
    findActiveByProductId(productId: string): Promise<MaintenanceLog[]>;
    findByStatus(status: MaintenanceStatus): Promise<MaintenanceLog[]>;
    completeMaintenanceLog(id: string, endDate: Date): Promise<MaintenanceLog>;
}
