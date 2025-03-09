import { AuditLogService } from '../../application/services/audit-log.service';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    findAll(): Promise<import("../../domain/entities/audit-log.entity").AuditLog[]>;
    findByUserId(userId: string): Promise<import("../../domain/entities/audit-log.entity").AuditLog[]>;
    findByResource(resource: string): Promise<import("../../domain/entities/audit-log.entity").AuditLog[]>;
    findByAction(action: string): Promise<import("../../domain/entities/audit-log.entity").AuditLog[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<import("../../domain/entities/audit-log.entity").AuditLog[]>;
    findOne(id: string): Promise<import("../../domain/entities/audit-log.entity").AuditLog>;
}
