// src/auth/domain/entities/user.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  TEMP_PASSWORD = 'TEMP_PASSWORD',
}

export class User extends BaseEntity {
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  failedLoginAttempts: number;
  lastLoginAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}
