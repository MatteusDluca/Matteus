import { AuditLog } from '../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class AuditLogRepository implements IAuditLogRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<AuditLog[]>;
    findById(id: string): Promise<AuditLog | null>;
    findByUserId(userId: string): Promise<AuditLog[]>;
    findByResource(resource: string): Promise<AuditLog[]>;
    findByAction(action: string): Promise<AuditLog[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>;
    create(data: Partial<AuditLog>): Promise<AuditLog>;
    update(id: string, data: Partial<AuditLog>): Promise<AuditLog>;
    delete(id: string): Promise<void>;
}
