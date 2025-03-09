import { Role, UserStatus } from '../../domain/entities/user.entity';
export declare class CreateUserDto {
    email: string;
    password: string;
    role: Role;
    status?: UserStatus;
    twoFactorEnabled?: boolean;
}
export declare class UpdateUserDto {
    email?: string;
    role?: Role;
    status?: UserStatus;
    twoFactorEnabled?: boolean;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    role: Role;
    status: UserStatus;
    failedLoginAttempts: number;
    lastLoginAt?: Date;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserWithoutSensitiveDataDto {
    id: string;
    email: string;
    role: Role;
    status: UserStatus;
    twoFactorEnabled: boolean;
    createdAt: Date;
}
