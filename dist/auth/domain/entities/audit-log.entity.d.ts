import { BaseEntity } from '../../../shared/domain/entities/base.entity';
export declare class AuditLog extends BaseEntity {
    userId: string;
    action: string;
    resource: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
}
