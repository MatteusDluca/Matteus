// src/auth/application/dtos/auth.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role, UserStatus } from '../../domain/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário (min. 8 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    description: 'Papel/função do usuário',
    enum: Role,
    default: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class LoginDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TwoFactorAuthDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Código de verificação de dois fatores' })
  @IsString()
  @IsNotEmpty()
  twoFactorCode: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Token de atualização' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Senha atual' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ description: 'Nova senha (min. 8 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de reset de senha' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'Nova senha (min. 8 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;
}

export class EnableTwoFactorDto {
  @ApiProperty({ description: 'Ativar/desativar autenticação de dois fatores' })
  @IsBoolean()
  enable: boolean;
}

export class VerifyTwoFactorDto {
  @ApiProperty({ description: 'Código de verificação de dois fatores' })
  @IsString()
  @IsNotEmpty()
  twoFactorCode: string;
}

export class TokenResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  accessToken: string;

  @ApiProperty({ description: 'Token de atualização' })
  refreshToken: string;

  @ApiProperty({ description: 'Data de expiração do token de acesso' })
  expiresAt: Date;

  @ApiProperty({ description: 'Papel/função do usuário', enum: Role })
  role: Role;

  @ApiPropertyOptional({ description: 'ID do usuário' })
  userId?: string;
}

export class TwoFactorResponseDto {
  @ApiProperty({ description: 'URL QR code para configuração do 2FA' })
  qrCodeUrl: string;

  @ApiProperty({ description: 'Segredo para configuração manual' })
  secret: string;
}
