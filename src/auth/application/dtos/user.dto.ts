// src/auth/application/dtos/user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDate,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role, UserStatus } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário (min. 8 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Papel/função do usuário', enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({
    description: 'Status do usuário',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'Autenticação de dois fatores habilitada',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Email do usuário' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Papel/função do usuário', enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ description: 'Status do usuário', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'Autenticação de dois fatores habilitada',
  })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  failedLoginAttempts: number;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiProperty()
  twoFactorEnabled: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserWithoutSensitiveDataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  twoFactorEnabled: boolean;

  @ApiProperty()
  createdAt: Date;
}
