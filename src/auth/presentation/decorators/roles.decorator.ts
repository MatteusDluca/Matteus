// src/auth/presentation/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../domain/entities/user.entity';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
