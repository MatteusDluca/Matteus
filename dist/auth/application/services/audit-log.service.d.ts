import { AuditLog } from '../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { CreateAuditLogDto } from '../dtos/audit-log.dto';
import { BaseService } from '../../../shared/application/services/base.service';
export declare class AuditLogService extends BaseService<AuditLog> {
    private readonly auditLogRepository;
    constructor(auditLogRepository: IAuditLogRepository);
    findAll(): Promise<AuditLog[]>;
    findByUserId(userId: string): Promise<AuditLog[]>;
    findByResource(resource: string): Promise<AuditLog[]>;
    findByAction(action: string): Promise<AuditLog[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>;
    create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
}
