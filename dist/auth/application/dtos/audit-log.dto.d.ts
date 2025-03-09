export declare class CreateAuditLogDto {
    userId: string;
    action: string;
    resource: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuditLogResponseDto {
    id: string;
    userId: string;
    action: string;
    resource: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}
