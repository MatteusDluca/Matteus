import { BaseEntity } from '../../../shared/domain/entities/base.entity';
export declare enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE",
    USER = "USER"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    TEMP_PASSWORD = "TEMP_PASSWORD"
}
export declare class User extends BaseEntity {
    email: string;
    password: string;
    role: Role;
    status: UserStatus;
    failedLoginAttempts: number;
    lastLoginAt?: Date;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
}
