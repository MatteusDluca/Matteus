# AuthContractsGenerator.ps1
# Script para gerar os módulos de Autenticação e Contratos

Write-Host "Iniciando geração dos módulos de Autenticação e Contratos..." -ForegroundColor Cyan

# Garantir que estamos no diretório raiz do projeto
if (-not (Test-Path -Path "src")) {
    Write-Host "Diretório 'src' não encontrado. Por favor, execute este script a partir do diretório raiz do projeto." -ForegroundColor Red
    exit 1
}

#################################################
# MÓDULO DE AUTENTICAÇÃO (AUTH)
#################################################

Write-Host "Criando módulo de Autenticação..." -ForegroundColor Yellow

# Domain Entities
$userEntityContent = @"
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
"@
New-Item -Path "src/auth/domain/entities" -ItemType Directory -Force
Set-Content -Path "src/auth/domain/entities/user.entity.ts" -Value $userEntityContent

$auditLogEntityContent = @"
// src/auth/domain/entities/audit-log.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export class AuditLog extends BaseEntity {
  userId: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}
"@
Set-Content -Path "src/auth/domain/entities/audit-log.entity.ts" -Value $auditLogEntityContent

# Repository Interfaces
$userRepositoryInterfaceContent = @"
// src/auth/domain/repositories/user.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { User, UserStatus } from '../entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  updatePassword(id: string, hashedPassword: string): Promise<User>;
  incrementFailedLoginAttempts(id: string): Promise<User>;
  resetFailedLoginAttempts(id: string): Promise<User>;
  updateLastLogin(id: string): Promise<User>;
  updateStatus(id: string, status: UserStatus): Promise<User>;
  updateTwoFactorSecret(id: string, secret: string): Promise<User>;
  enableTwoFactor(id: string, enabled: boolean): Promise<User>;
}
"@
New-Item -Path "src/auth/domain/repositories" -ItemType Directory -Force
Set-Content -Path "src/auth/domain/repositories/user.repository.interface.ts" -Value $userRepositoryInterfaceContent

$auditLogRepositoryInterfaceContent = @"
// src/auth/domain/repositories/audit-log.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { AuditLog } from '../entities/audit-log.entity';

export interface IAuditLogRepository extends IBaseRepository<AuditLog> {
  findByUserId(userId: string): Promise<AuditLog[]>;
  findByResource(resource: string): Promise<AuditLog[]>;
  findByAction(action: string): Promise<AuditLog[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>;
}
"@
Set-Content -Path "src/auth/domain/repositories/audit-log.repository.interface.ts" -Value $auditLogRepositoryInterfaceContent

# Repository Implementations
$userRepositoryContent = @"
// src/auth/infrastructure/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { email: 'asc' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status || UserStatus.ACTIVE,
        failedLoginAttempts: data.failedLoginAttempts || 0,
        lastLoginAt: data.lastLoginAt,
        twoFactorEnabled: data.twoFactorEnabled || false,
        twoFactorSecret: data.twoFactorSecret,
      },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: data as any,
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0, // Reset failed attempts on password change
        status: UserStatus.ACTIVE, // Ensure account is active after password change
      },
    });
  }

  async incrementFailedLoginAttempts(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    });
  }

  async resetFailedLoginAttempts(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
      },
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async updateTwoFactorSecret(id: string, secret: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        twoFactorSecret: secret,
      },
    });
  }

  async enableTwoFactor(id: string, enabled: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        twoFactorEnabled: enabled,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
"@
New-Item -Path "src/auth/infrastructure/repositories" -ItemType Directory -Force
Set-Content -Path "src/auth/infrastructure/repositories/user.repository.ts" -Value $userRepositoryContent

$auditLogRepositoryContent = @"
// src/auth/infrastructure/repositories/audit-log.repository.ts
import { Injectable } from '@nestjs/common';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<AuditLog | null> {
    return this.prisma.auditLog.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByResource(resource: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { resource },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Partial<AuditLog>): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async update(id: string, data: Partial<AuditLog>): Promise<AuditLog> {
    return this.prisma.auditLog.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.auditLog.delete({
      where: { id },
    });
  }
}
"@
Set-Content -Path "src/auth/infrastructure/repositories/audit-log.repository.ts" -Value $auditLogRepositoryContent

# Auth DTOs
$authDtosContent = @"
// src/auth/application/dtos/auth.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsEmail, MinLength, 
  IsBoolean, IsOptional, IsEnum 
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

  @ApiPropertyOptional({ description: 'Papel/função do usuário', enum: Role, default: Role.USER })
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
"@
New-Item -Path "src/auth/application/dtos" -ItemType Directory -Force
Set-Content -Path "src/auth/application/dtos/auth.dto.ts" -Value $authDtosContent

$userDtosContent = @"
// src/auth/application/dtos/user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsEmail, MinLength, 
  IsEnum, IsOptional, IsBoolean, IsDate, IsISO8601
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

  @ApiPropertyOptional({ description: 'Status do usuário', enum: UserStatus, default: UserStatus.ACTIVE })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Autenticação de dois fatores habilitada', default: false })
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

  @ApiPropertyOptional({ description: 'Autenticação de dois fatores habilitada' })
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
"@
Set-Content -Path "src/auth/application/dtos/user.dto.ts" -Value $userDtosContent

$auditLogDtosContent = @"
// src/auth/application/dtos/audit-log.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Ação realizada' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ description: 'Recurso acessado' })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiPropertyOptional({ description: 'Detalhes adicionais' })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({ description: 'Endereço IP do cliente' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User-Agent do cliente' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class AuditLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  resource: string;

  @ApiPropertyOptional()
  details?: string;

  @ApiPropertyOptional()
  ipAddress?: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiProperty()
  createdAt: Date;
}
"@
Set-Content -Path "src/auth/application/dtos/audit-log.dto.ts" -Value $auditLogDtosContent

# Auth Services
$authServiceContent = @"
// src/auth/application/services/auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { User, UserStatus, Role } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { 
  RegisterDto, LoginDto, ChangePasswordDto, 
  TokenResponseDto, TwoFactorResponseDto, TwoFactorAuthDto 
} from '../dtos/auth.dto';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Registra um novo usuário
   */
  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<User> {
    // Verificar se já existe um usuário com o mesmo email
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Este email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Criar o usuário
    const user = await this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || Role.USER,
      status: UserStatus.ACTIVE,
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    });

    // Registrar o evento de auditoria
    await this.auditLogService.create({
      userId: user.id,
      action: 'REGISTER',
      resource: 'USER',
      details: 'Registro de novo usuário',
      ipAddress,
      userAgent,
    });

    return user;
  }

  /**
   * Realiza a autenticação do usuário
   */
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<TokenResponseDto | { twoFactorRequired: true }> {
    // Buscar o usuário pelo email
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar o status do usuário
    if (user.status === UserStatus.BLOCKED) {
      // Registrar a tentativa de login bloqueada
      await this.auditLogService.create({
        userId: user.id,
        action: 'LOGIN_FAILED',
        resource: 'AUTH',
        details: 'Tentativa de login em conta bloqueada',
        ipAddress,
        userAgent,
      });
      
      throw new UnauthorizedException('Conta bloqueada devido a múltiplas tentativas de login malsucedidas. Entre em contato com o administrador.');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Conta inativa. Entre em contato com o administrador.');
    }

    // Verificar a senha
    const isPasswordValid = await this.comparePasswords(loginDto.password, user.password);
    if (!isPasswordValid) {
      // Incrementar contador de tentativas falhas
      await this.incrementFailedLoginAttempts(user);
      
      // Registrar a tentativa de login falha
      await this.auditLogService.create({
        userId: user.id,
        action: 'LOGIN_FAILED',
        resource: 'AUTH',
        details: 'Senha inválida',
        ipAddress,
        userAgent,
      });
      
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Resetar o contador de tentativas falhas
    await this.userRepository.resetFailedLoginAttempts(user.id);

    // Se for a primeira senha temporária, exigir troca
    if (user.status === UserStatus.TEMP_PASSWORD) {
      // Registrar log de auditoria
      await this.auditLogService.create({
        userId: user.id,
        action: 'LOGIN_TEMP_PASSWORD',
        resource: 'AUTH',
        details: 'Login com senha temporária',
        ipAddress,
        userAgent,
      });
      
      throw new BadRequestException('É necessário alterar a senha temporária antes de continuar');
    }

    // Verificar se a autenticação de dois fatores está habilitada
    if (user.twoFactorEnabled) {
      // Registrar o início do processo de 2FA
      await this.auditLogService.create({
        userId: user.id,
        action: 'LOGIN_2FA_REQUIRED',
        resource: 'AUTH',
        details: 'Autenticação de dois fatores requerida',
        ipAddress,
        userAgent,
      });
      
      return { twoFactorRequired: true };
    }

    // Atualizar a data do último login
    await this.userRepository.updateLastLogin(user.id);

    // Gerar tokens
    const tokens = await this.generateTokens(user);

    // Registrar o login bem-sucedido
    await this.auditLogService.create({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      resource: 'AUTH',
      details: 'Login bem-sucedido',
      ipAddress,
      userAgent,
    });

    return tokens;
  }

  /**
   * Valida o código de autenticação de dois fatores
   */
  async verifyTwoFactorAuth(twoFactorAuthDto: TwoFactorAuthDto, ipAddress?: string, userAgent?: string): Promise<TokenResponseDto> {
    // Buscar o usuário pelo email
    const user = await this.userRepository.findByEmail(twoFactorAuthDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar se a autenticação de dois fatores está habilitada
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('Autenticação de dois fatores não habilitada para este usuário');
    }

    // Verificar o código
    const isCodeValid = authenticator.verify({
      token: twoFactorAuthDto.twoFactorCode,
      secret: user.twoFactorSecret,
    });

    if (!isCodeValid) {
      // Incrementar contador de tentativas falhas
      await this.incrementFailedLoginAttempts(user);
      
      // Registrar a tentativa falha
      await this.auditLogService.create({
        userId: user.id,
        action: 'LOGIN_2FA_FAILED',
        resource: 'AUTH',
        details: 'Código de 2FA inválido',
        ipAddress,
        userAgent,
      });
      
      throw new UnauthorizedException('Código de autenticação inválido');
    }

    // Resetar o contador de tentativas falhas
    await this.userRepository.resetFailedLoginAttempts(user.id);

    // Atualizar a data do último login
    await this.userRepository.updateLastLogin(user.id);

    // Gerar tokens
    const tokens = await this.generateTokens(user);

    // Registrar o login bem-sucedido
    await this.auditLogService.create({
      userId: user.id,
      action: 'LOGIN_2FA_SUCCESS',
      resource: 'AUTH',
      details: 'Login com 2FA bem-sucedido',
      ipAddress,
      userAgent,
    });

    return tokens;
  }

  /**
   * Gera um novo QR code para configurar a autenticação de dois fatores
   */
  async generateTwoFactorSecret(userId: string): Promise<TwoFactorResponseDto> {
    // Buscar o usuário
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gerar um novo segredo
    const secret = authenticator.generateSecret();

    // Atualizar o segredo no usuário
    await this.userRepository.updateTwoFactorSecret(user.id, secret);

    // Gerar QR code
    const otpauth = authenticator.keyuri(user.email, 'AluguelRoupasSistema', secret);
    const qrCodeUrl = await toDataURL(otpauth);

    return {
      qrCodeUrl,
      secret,
    };
  }

  /**
   * Ativa ou desativa a autenticação de dois fatores
   */
  async enableTwoFactor(userId: string, enable: boolean, code?: string): Promise<User> {
    // Buscar o usuário
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se estiver ativando, verificar o código
    if (enable && code) {
      if (!user.twoFactorSecret) {
        throw new BadRequestException('Configure a autenticação de dois fatores primeiro');
      }

      const isCodeValid = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret,
      });

      if (!isCodeValid) {
        throw new UnauthorizedException('Código de verificação inválido');
      }
    } else if (enable && !code) {
      throw new BadRequestException('Código de verificação necessário para ativar a autenticação de dois fatores');
    }

    // Atualizar o status da autenticação de dois fatores
    return this.userRepository.enableTwoFactor(user.id, enable);
  }

  /**
   * Troca a senha do usuário
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto, ipAddress?: string, userAgent?: string): Promise<void> {
    // Buscar o usuário
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar a senha atual
    const isCurrentPasswordValid = await this.comparePasswords(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedPassword = await this.hashPassword(changePasswordDto.newPassword);

    // Atualizar a senha
    await this.userRepository.updatePassword(user.id, hashedPassword);

    // Se o usuário tinha senha temporária, atualizar o status
    if (user.status === UserStatus.TEMP_PASSWORD) {
      await this.userRepository.updateStatus(user.id, UserStatus.ACTIVE);
    }

    // Registrar a alteração de senha
    await this.auditLogService.create({
      userId: user.id,
      action: 'PASSWORD_CHANGE',
      resource: 'USER',
      details: 'Alteração de senha pelo usuário',
      ipAddress,
      userAgent,
    });
  }

  /**
   * Atualiza os tokens usando um refresh token
   */
  async refreshTokens(refreshToken: string): Promise<TokenResponseDto> {
    try {
      // Verificar o refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      // Buscar o usuário
      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Token inválido');
      }

      // Gerar novos tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  /**
   * Incremente o contador de tentativas falhas e bloqueia o usuário se necessário
   */
  private async incrementFailedLoginAttempts(user: User): Promise<void> {
    // Incrementar contador
    const updatedUser = await this.userRepository.incrementFailedLoginAttempts(user.id);

    // Verificar limite de tentativas (5)
    if (updatedUser.failedLoginAttempts >= 5) {
      await this.userRepository.updateStatus(user.id, UserStatus.BLOCKED);
    }
  }

  /**
   * Gera os tokens JWT
   */
  private async generateTokens(user: User): Promise<TokenResponseDto> {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role,
    };

    // Token JWT com expiração (1d por padrão)
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '1d'),
    });

    // Refresh token de longa duração (7d por padrão)
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION', '7d'),
      },
    );

    // Calcular a data de expiração
    const expiresIn = this.configService.get<string>('JWT_EXPIRATION', '1d');
    const expiresAt = this.calculateExpirationDate(expiresIn);

    return {
      accessToken,
      refreshToken,
      expiresAt,
      role: user.role,
      userId: user.id,
    };
  }

  /**
   * Calcula a data de expiração com base na string de duração (1d, 1h, etc.)
   */
  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 'd': // dias
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      case 'h': // horas
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'm': // minutos
        return new Date(now.getTime() + value * 60 * 1000);
      case 's': // segundos
        return new Date(now.getTime() + value * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 dia por padrão
    }
  }

  /**
   * Hash de senha usando bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compara uma senha em texto puro com uma hash
   */
  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
"@
New-Item -Path "src/auth/application/services" -ItemType Directory -Force
Set-Content -Path "src/auth/application/services/auth.service.ts" -Value $authServiceContent

$userServiceContent = @"
// src/auth/application/services/user.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly auditLogService: AuditLogService,
  ) {
    super(userRepository);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(\`Usuário com email \${email} não encontrado\`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto, adminId?: string, ipAddress?: string, userAgent?: string): Promise<User> {
    // Verificar se já existe um usuário com o mesmo email
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException(\`Já existe um usuário com o email \${createUserDto.email}\`);
    }

    // Hash da senha
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Criar o usuário
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      failedLoginAttempts: 0,
    });

    // Registrar o evento de auditoria
    if (adminId) {
      await this.auditLogService.create({
        userId: adminId,
        action: 'USER_CREATE',
        resource: 'USER',
        details: \`Criação de usuário: \${user.id} (\${user.email})\`,
        ipAddress,
        userAgent,
      });
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, adminId?: string, ipAddress?: string, userAgent?: string): Promise<User> {
    // Verificar se o usuário existe
    await this.findById(id);

    // Se estiver atualizando o email, verificar se já existe outro usuário com esse email
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(\`Já existe um usuário com o email \${updateUserDto.email}\`);
      }
    }

    // Atualizar o usuário
    const updatedUser = await this.userRepository.update(id, updateUserDto);

    // Registrar o evento de auditoria
    if (adminId) {
      await this.auditLogService.create({
        userId: adminId,
        action: 'USER_UPDATE',
        resource: 'USER',
        details: \`Atualização de usuário: \${id} (\${updatedUser.email})\`,
        ipAddress,
        userAgent,
      });
    }

    return updatedUser;
  }

  async resetPassword(id: string, adminId: string, ipAddress?: string, userAgent?: string): Promise<{ password: string }> {
    // Verificar se o usuário existe
    const user = await this.findById(id);

    // Gerar senha temporária
    const tempPassword = this.generateRandomPassword();
    const hashedPassword = await this.hashPassword(tempPassword);

    // Atualizar senha e status do usuário
    await this.userRepository.update(id, {
      password: hashedPassword,
      status: UserStatus.TEMP_PASSWORD,
      failedLoginAttempts: 0,
    });

    // Registrar o evento de auditoria
    await this.auditLogService.create({
      userId: adminId,
      action: 'PASSWORD_RESET',
      resource: 'USER',
      details: \`Reset de senha para usuário: \${id} (\${user.email})\`,
      ipAddress,
      userAgent,
    });

    return { password: tempPassword };
  }

  async changeStatus(id: string, status: UserStatus, adminId: string, ipAddress?: string, userAgent?: string): Promise<User> {
    // Verificar se o usuário existe
    const user = await this.findById(id);

    // Atualizar status do usuário
    const updatedUser = await this.userRepository.updateStatus(id, status);

    // Registrar o evento de auditoria
    await this.auditLogService.create({
      userId: adminId,
      action: 'STATUS_CHANGE',
      resource: 'USER',
      details: \`Alteração de status para usuário: \${id} (\${user.email}) - Novo status: \${status}\`,
      ipAddress,
      userAgent,
    });

    return updatedUser;
  }

  async delete(id: string, adminId?: string, ipAddress?: string, userAgent?: string): Promise<void> {
    // Verificar se o usuário existe
    const user = await this.findById(id);

    // Excluir o usuário
    await this.userRepository.delete(id);

    // Registrar o evento de auditoria
    if (adminId) {
      await this.auditLogService.create({
        userId: adminId,
        action: 'USER_DELETE',
        resource: 'USER',
        details: \`Exclusão de usuário: \${id} (\${user.email})\`,
        ipAddress,
        userAgent,
      });
    }
  }

  /**
   * Gera uma senha aleatória segura
   */
  private generateRandomPassword(length: number = 10): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }

  /**
   * Hash de senha usando bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
"@
Set-Content -Path "src/auth/application/services/user.service.ts" -Value $userServiceContent

$auditLogServiceContent = @"
// src/auth/application/services/audit-log.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { CreateAuditLogDto } from '../dtos/audit-log.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
export class AuditLogService extends BaseService<AuditLog> {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {
    super(auditLogRepository);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll();
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUserId(userId);
  }

  async findByResource(resource: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByResource(resource);
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByAction(action);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogRepository.findByDateRange(startDate, endDate);
  }

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditLogRepository.create(createAuditLogDto);
  }
}
"@
Set-Content -Path "src/auth/application/services/audit-log.service.ts" -Value $auditLogServiceContent

# Auth Strategies
$jwtStrategyContent = @"
// src/auth/infrastructure/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../application/services/user.service';
import { UserStatus } from '../../domain/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      // Verificar se o usuário existe e está ativo
      const user = await this.userService.findById(payload.sub);
      
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Usuário inativo ou não encontrado');
      }
      
      // Retornar dados do usuário para o request
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
"@
New-Item -Path "src/auth/infrastructure/strategies" -ItemType Directory -Force
Set-Content -Path "src/auth/infrastructure/strategies/jwt.strategy.ts" -Value $jwtStrategyContent

$localStrategyContent = @"
// src/auth/infrastructure/strategies/local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    try {
      const result = await this.authService.login({ email, password });
      
      // Verificar se é necessário autenticação de dois fatores
      if ('twoFactorRequired' in result) {
        // Não estamos permitindo o login ainda, apenas confirmando que as credenciais são válidas
        return { email, twoFactorRequired: true };
      }
      
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
"@
Set-Content -Path "src/auth/infrastructure/strategies/local.strategy.ts" -Value $localStrategyContent

# Auth Guards and Decorators
$jwtAuthGuardContent = @"
// src/auth/presentation/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
"@
New-Item -Path "src/auth/presentation/guards" -ItemType Directory -Force
Set-Content -Path "src/auth/presentation/guards/jwt-auth.guard.ts" -Value $jwtAuthGuardContent

$rolesGuardContent = @"
// src/auth/presentation/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    // Admin tem acesso a tudo
    if (user.role === Role.ADMIN) {
      return true;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
"@
Set-Content -Path "src/auth/presentation/guards/roles.guard.ts" -Value $rolesGuardContent

$rolesDecoratorContent = @"
// src/auth/presentation/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../domain/entities/user.entity';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
"@
New-Item -Path "src/auth/presentation/decorators" -ItemType Directory -Force
Set-Content -Path "src/auth/presentation/decorators/roles.decorator.ts" -Value $rolesDecoratorContent

$userDecoratorContent = @"
// src/auth/presentation/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
"@
Set-Content -Path "src/auth/presentation/decorators/user.decorator.ts" -Value $userDecoratorContent

# Auth Controllers
$authControllerContent = @"
// src/auth/presentation/controllers/auth.controller.ts
import { 
  Controller, Post, Body, HttpCode, HttpStatus, 
  UseGuards, Req, Res, Get, UnauthorizedException
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,
  ApiBody, ApiHeader
} from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { 
  RegisterDto, LoginDto, RefreshTokenDto, ChangePasswordDto,
  TokenResponseDto, TwoFactorResponseDto, TwoFactorAuthDto,
  EnableTwoFactorDto, VerifyTwoFactorDto
} from '../../application/dtos/auth.dto';
import { UserResponseDto } from '../../application/dtos/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { Request, Response } from 'express';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou email já em uso' })
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    return this.authService.register(registerDto, ipAddress, userAgent);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    const result = await this.authService.login(loginDto, ipAddress, userAgent);
    
    if ('twoFactorRequired' in result) {
      return res.status(HttpStatus.OK).json({
        twoFactorRequired: true,
        message: 'Autenticação de dois fatores necessária',
      });
    }
    
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar código de autenticação de dois fatores' })
  @ApiResponse({ status: 200, description: 'Autenticação bem-sucedida', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Código inválido' })
  async verifyTwoFactorAuth(@Body() twoFactorAuthDto: TwoFactorAuthDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    return this.authService.verifyTwoFactorAuth(twoFactorAuthDto, ipAddress, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar tokens com refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens atualizados com sucesso', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alterar senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request
  ) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    await this.authService.changePassword(userId, changePasswordDto, ipAddress, userAgent);
    return { message: 'Senha alterada com sucesso' };
  }

  @Get('2fa/generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gerar segredo para autenticação de dois fatores' })
  @ApiResponse({ status: 200, description: 'Segredo gerado com sucesso', type: TwoFactorResponseDto })
  async generateTwoFactorSecret(@CurrentUser('id') userId: string) {
    return this.authService.generateTwoFactorSecret(userId);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ativar/desativar autenticação de dois fatores' })
  @ApiResponse({ status: 200, description: 'Configuração atualizada com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Configuração inválida' })
  async enableTwoFactor(
    @CurrentUser('id') userId: string,
    @Body() enableTwoFactorDto: EnableTwoFactorDto,
    @Body() verifyTwoFactorDto?: VerifyTwoFactorDto
  ) {
    return this.authService.enableTwoFactor(
      userId, 
      enableTwoFactorDto.enable, 
      enableTwoFactorDto.enable ? verifyTwoFactorDto?.twoFactorCode : undefined
    );
  }
}
"@
New-Item -Path "src/auth/presentation/controllers" -ItemType Directory -Force
Set-Content -Path "src/auth/presentation/controllers/auth.controller.ts" -Value $authControllerContent

$userControllerContent = @"
// src/auth/presentation/controllers/user.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery
} from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';
import { 
  CreateUserDto, UpdateUserDto, UserResponseDto, 
  UserWithoutSensitiveDataDto
} from '../../application/dtos/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { Role, UserStatus } from '../../domain/entities/user.entity';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso', type: [UserResponseDto] })
  async findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário atual' })
  @ApiResponse({ status: 200, description: 'Dados do usuário retornados com sucesso', type: UserWithoutSensitiveDataDto })
  async findMe(@CurrentUser('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buscar usuário por email' })
  @ApiParam({ name: 'email', description: 'Email do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser('id') adminId: string, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    return this.userService.create(createUserDto, adminId, ipAddress, userAgent);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @CurrentUser('id') adminId: string,
    @Req() req: Request
  ) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    return this.userService.update(id, updateUserDto, adminId, ipAddress, userAgent);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar status do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiQuery({ name: 'status', enum: UserStatus, description: 'Novo status do usuário' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async updateStatus(
    @Param('id') id: string, 
    @Query('status') status: UserStatus,
    @CurrentUser('id') adminId: string,
    @Req() req: Request
  ) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    return this.userService.changeStatus(id, status, adminId, ipAddress, userAgent);
  }

  @Post(':id/reset-password')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Resetar senha do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Senha resetada com sucesso', schema: {
    properties: {
      password: { type: 'string', description: 'Nova senha temporária' }
    }
  }})
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async resetPassword(
    @Param('id') id: string, 
    @CurrentUser('id') adminId: string,
    @Req() req: Request
  ) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    return this.userService.resetPassword(id, adminId, ipAddress, userAgent);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Usuário excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(
    @Param('id') id: string, 
    @CurrentUser('id') adminId: string,
    @Req() req: Request
  ) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    await this.userService.delete(id, adminId, ipAddress, userAgent);
    return;
  }
}
"@
Set-Content -Path "src/auth/presentation/controllers/user.controller.ts" -Value $userControllerContent

$auditLogControllerContent = @"
// src/auth/presentation/controllers/audit-log.controller.ts
import { 
  Controller, Get, Param, UseGuards, Query 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery 
} from '@nestjs/swagger';
import { AuditLogService } from '../../application/services/audit-log.service';
import { AuditLogResponseDto } from '../../application/dtos/audit-log.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../domain/entities/user.entity';
import { ParseDatePipe } from '../pipes/parse-date.pipe';

@ApiTags('Logs de Auditoria')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os logs de auditoria' })
  @ApiResponse({ status: 200, description: 'Lista de logs retornada com sucesso', type: [AuditLogResponseDto] })
  async findAll() {
    return this.auditLogService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar logs de auditoria por usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de logs retornada com sucesso', type: [AuditLogResponseDto] })
  async findByUserId(@Param('userId') userId: string) {
    return this.auditLogService.findByUserId(userId);
  }

  @Get('resource/:resource')
  @ApiOperation({ summary: 'Listar logs de auditoria por recurso' })
  @ApiParam({ name: 'resource', description: 'Nome do recurso' })
  @ApiResponse({ status: 200, description: 'Lista de logs retornada com sucesso', type: [AuditLogResponseDto] })
  async findByResource(@Param('resource') resource: string) {
    return this.auditLogService.findByResource(resource);
  }

  @Get('action/:action')
  @ApiOperation({ summary: 'Listar logs de auditoria por ação' })
  @ApiParam({ name: 'action', description: 'Nome da ação' })
  @ApiResponse({ status: 200, description: 'Lista de logs retornada com sucesso', type: [AuditLogResponseDto] })
  async findByAction(@Param('action') action: string) {
    return this.auditLogService.findByAction(action);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Listar logs de auditoria por intervalo de datas' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'Data final (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lista de logs retornada com sucesso', type: [AuditLogResponseDto] })
  async findByDateRange(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date
  ) {
    return this.auditLogService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar log de auditoria por ID' })
  @ApiParam({ name: 'id', description: 'ID do log de auditoria' })
  @ApiResponse({ status: 200, description: 'Log encontrado com sucesso', type: AuditLogResponseDto })
  @ApiResponse({ status: 404, description: 'Log não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.auditLogService.findById(id);
  }
}
"@
Set-Content -Path "src/auth/presentation/controllers/audit-log.controller.ts" -Value $auditLogControllerContent

# Custom Pipes
$parseDatePipeContent = @"
// src/auth/presentation/pipes/parse-date.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: any) {
    try {
      const date = new Date(value);
      
      if (isNaN(date.getTime())) {
        throw new Error('Data inválida');
      }
      
      return date;
    } catch (error) {
      throw new BadRequestException('Data inválida. Use o formato YYYY-MM-DD');
    }
  }
}
"@
New-Item -Path "src/auth/presentation/pipes" -ItemType Directory -Force
Set-Content -Path "src/auth/presentation/pipes/parse-date.pipe.ts" -Value $parseDatePipeContent

# Auth Module
$authModuleContent = @"
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserController } from './presentation/controllers/user.controller';
import { AuditLogController } from './presentation/controllers/audit-log.controller';
import { AuthService } from './application/services/auth.service';
import { UserService } from './application/services/user.service';
import { AuditLogService } from './application/services/audit-log.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { AuditLogRepository } from './infrastructure/repositories/audit-log.repository';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1d'),
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    AuditLogController,
  ],
  providers: [
    AuthService,
    UserService,
    AuditLogService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IAuditLogRepository',
      useClass: AuditLogRepository,
    },
  ],
  exports: [
    AuthService,
    UserService,
    AuditLogService,
  ],
})
export class AuthModule {}
"@
Set-Content -Path "src/auth/auth.module.ts" -Value $authModuleContent

#################################################
# MÓDULO DE CONTRATOS (CONTRACTS)
#################################################

Write-Host "Criando módulo de Contratos..." -ForegroundColor Yellow

# Contract Domain Entities
$contractEntityContent = @"
// src/contracts/domain/entities/contract.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Customer } from '../../../customers/domain/entities/customer.entity';
import { Employee } from '../../../employees/domain/entities/employee.entity';
import { Event } from '../../../events/domain/entities/event.entity';
import { ContractItem } from './contract-item.entity';
import { Payment } from './payment.entity';

export enum ContractStatus {
  DRAFT = 'DRAFT',
  FITTING_SCHEDULED = 'FITTING_SCHEDULED',
  SIGNED = 'SIGNED',
  PAID = 'PAID',
  PICKED_UP = 'PICKED_UP',
  RETURNED = 'RETURNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  LATE = 'LATE',
}

export class Contract extends BaseEntity {
  customerId: string;
  employeeId: string;
  eventId?: string;
  contractNumber: string;
  fittingDate?: Date;
  pickupDate: Date;
  returnDate: Date;
  status: ContractStatus;
  totalAmount: number;
  depositAmount?: number;
  specialConditions?: string;
  observations?: string;
  
  // Relacionamentos
  customer?: Customer;
  employee?: Employee;
  event?: Event;
  items?: ContractItem[];
  payments?: Payment[];
}
"@
New-Item -Path "src/contracts/domain/entities" -ItemType Directory -Force
Set-Content -Path "src/contracts/domain/entities/contract.entity.ts" -Value $contractEntityContent

$contractItemEntityContent = @"
// src/contracts/domain/entities/contract-item.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Product } from '../../../inventory/domain/entities/product.entity';

export class ContractItem extends BaseEntity {
  contractId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  
  // Relacionamentos
  product?: Product;
}
"@
Set-Content -Path "src/contracts/domain/entities/contract-item.entity.ts" -Value $contractItemEntityContent

$paymentEntityContent = @"
// src/contracts/domain/entities/payment.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PIX = 'PIX',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export class Payment extends BaseEntity {
  contractId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  installments: number;
  reference?: string;
  paidAt?: Date;
  dueDate?: Date;
}
"@
Set-Content -Path "src/contracts/domain/entities/payment.entity.ts" -Value $paymentEntityContent

$notificationEntityContent = @"
// src/contracts/domain/entities/notification.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum NotificationType {
  FITTING_REMINDER = 'FITTING_REMINDER',
  RESERVATION_CONFIRMATION = 'RESERVATION_CONFIRMATION',
  RETURN_ALERT = 'RETURN_ALERT',
  BIRTHDAY = 'BIRTHDAY',
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
  GENERAL = 'GENERAL',
}

export class Notification extends BaseEntity {
  customerId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: Date;
  readAt?: Date;
}
"@
Set-Content -Path "src/contracts/domain/entities/notification.entity.ts" -Value $notificationEntityContent

# Contract Repository Interfaces
$contractRepositoryInterfaceContent = @"
// src/contracts/domain/repositories/contract.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Contract, ContractStatus } from '../entities/contract.entity';

export interface IContractRepository extends IBaseRepository<Contract> {
  findByContractNumber(contractNumber: string): Promise<Contract | null>;
  findByCustomerId(customerId: string): Promise<Contract[]>;
  findByEmployeeId(employeeId: string): Promise<Contract[]>;
  findByEventId(eventId: string): Promise<Contract[]>;
  findByStatus(status: ContractStatus): Promise<Contract[]>;
  findLateContracts(): Promise<Contract[]>;
  findByDateRange(startDate: Date, endDate: Date, field: 'pickupDate' | 'returnDate'): Promise<Contract[]>;
  updateStatus(id: string, status: ContractStatus): Promise<Contract>;
  calculateTotalAmount(id: string): Promise<number>;
  countContractsByMonthYear(): Promise<{ month: number; year: number; count: number }[]>;
  sumContractValuesByMonthYear(): Promise<{ month: number; year: number; total: number }[]>;
}
"@
New-Item -Path "src/contracts/domain/repositories" -ItemType Directory -Force
Set-Content -Path "src/contracts/domain/repositories/contract.repository.interface.ts" -Value $contractRepositoryInterfaceContent

$contractItemRepositoryInterfaceContent = @"
// src/contracts/domain/repositories/contract-item.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { ContractItem } from '../entities/contract-item.entity';

export interface IContractItemRepository extends IBaseRepository<ContractItem> {
  findByContractId(contractId: string): Promise<ContractItem[]>;
  findByProductId(productId: string): Promise<ContractItem[]>;
  updateQuantity(id: string, quantity: number): Promise<ContractItem>;
  createBulk(items: Partial<ContractItem>[]): Promise<ContractItem[]>;
  deleteByContractId(contractId: string): Promise<void>;
}
"@
Set-Content -Path "src/contracts/domain/repositories/contract-item.repository.interface.ts" -Value $contractItemRepositoryInterfaceContent

$paymentRepositoryInterfaceContent = @"
// src/contracts/domain/repositories/payment.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Payment, PaymentStatus } from '../entities/payment.entity';

export interface IPaymentRepository extends IBaseRepository<Payment> {
  findByContractId(contractId: string): Promise<Payment[]>;
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
  sumPaymentsByContractId(contractId: string): Promise<number>;
  markAsPaid(id: string): Promise<Payment>;
}
"@
Set-Content -Path "src/contracts/domain/repositories/payment.repository.interface.ts" -Value $paymentRepositoryInterfaceContent

$notificationRepositoryInterfaceContent = @"
// src/contracts/domain/repositories/notification.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Notification, NotificationType } from '../entities/notification.entity';

export interface INotificationRepository extends IBaseRepository<Notification> {
  findByCustomerId(customerId: string): Promise<Notification[]>;
  findUnreadByCustomerId(customerId: string): Promise<Notification[]>;
  findByType(type: NotificationType): Promise<Notification[]>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(customerId: string): Promise<void>;
  countUnreadByCustomerId(customerId: string): Promise<number>;
}
"@
Set-Content -Path "src/contracts/domain/repositories/notification.repository.interface.ts" -Value $notificationRepositoryInterfaceContent

# Contract Repository Implementations
$contractRepositoryContent = @"
// src/contracts/infrastructure/repositories/contract.repository.ts
import { Injectable } from '@nestjs/common';
import { Contract, ContractStatus } from '../../domain/entities/contract.entity';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ContractRepository implements IContractRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Contract | null> {
    return this.prisma.contract.findUnique({
      where: { id },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  async findByContractNumber(contractNumber: string): Promise<Contract | null> {
    return this.prisma.contract.findUnique({
      where: { contractNumber },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  async findByCustomerId(customerId: string): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      where: { customerId },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEmployeeId(employeeId: string): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      where: { employeeId },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEventId(eventId: string): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      where: { eventId },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: ContractStatus): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      where: { status },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findLateContracts(): Promise<Contract[]> {
    const today = new Date();
    
    return this.prisma.contract.findMany({
      where: {
        returnDate: { lt: today },
        status: {
          in: [
            ContractStatus.PICKED_UP,
            ContractStatus.PAID,
          ],
        },
      },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { returnDate: 'asc' },
    });
  }

  async findByDateRange(
    startDate: Date, 
    endDate: Date, 
    field: 'pickupDate' | 'returnDate'
  ): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      where: {
        [field]: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: { [field]: 'asc' },
    });
  }

  async create(data: Partial<Contract>): Promise<Contract> {
    return this.prisma.contract.create({
      data: {
        customerId: data.customerId,
        employeeId: data.employeeId,
        eventId: data.eventId,
        contractNumber: data.contractNumber,
        fittingDate: data.fittingDate,
        pickupDate: data.pickupDate,
        returnDate: data.returnDate,
        status: data.status || ContractStatus.DRAFT,
        totalAmount: data.totalAmount as any,
        depositAmount: data.depositAmount as any,
        specialConditions: data.specialConditions,
        observations: data.observations,
      },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: true,
        payments: true,
      },
    });
  }

  async update(id: string, data: Partial<Contract>): Promise<Contract> {
    return this.prisma.contract.update({
      where: { id },
      data: data as any,
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  async updateStatus(id: string, status: ContractStatus): Promise<Contract> {
    return this.prisma.contract.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        employee: true,
        event: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  async calculateTotalAmount(id: string): Promise<number> {
    const items = await this.prisma.contractItem.findMany({
      where: { contractId: id },
    });
    
    return items.reduce((total, item) => total + item.subtotal, 0);
  }

  async countContractsByMonthYear(): Promise<{ month: number; year: number; count: number }[]> {
    const result = await this.prisma.$queryRaw\`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month, 
        EXTRACT(YEAR FROM "createdAt") as year,
        COUNT(*) as count
      FROM "Contract"
      GROUP BY month, year
      ORDER BY year, month
    \`;
    
    return result as { month: number; year: number; count: number }[];
  }

  async sumContractValuesByMonthYear(): Promise<{ month: number; year: number; total: number }[]> {
    const result = await this.prisma.$queryRaw\`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month, 
        EXTRACT(YEAR FROM "createdAt") as year,
        SUM("totalAmount") as total
      FROM "Contract"
      WHERE "status" NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY month, year
      ORDER BY year, month
    \`;
    
    return result as { month: number; year: number; total: number }[];
  }

  async delete(id: string): Promise<void> {
    // Excluir itens do contrato e pagamentos primeiro (cascade)
    await this.prisma.contractItem.deleteMany({
      where: { contractId: id },
    });
    
    await this.prisma.payment.deleteMany({
      where: { contractId: id },
    });
    
    // Excluir o contrato
    await this.prisma.contract.delete({
      where: { id },
    });
  }
}
"@
New-Item -Path "src/contracts/infrastructure/repositories" -ItemType Directory -Force
Set-Content -Path "src/contracts/infrastructure/repositories/contract.repository.ts" -Value $contractRepositoryContent

# Continuação do arquivo contract-item.repository.ts
$contractItemRepositoryContentContinued = @"
    // Se a quantidade ou preço for atualizado, recalcular o subtotal
    let updateData: any = { ...data };
    
    if (data.quantity !== undefined || data.unitPrice !== undefined) {
      const currentItem = await this.prisma.contractItem.findUnique({
        where: { id },
      });
      
      const quantity = data.quantity !== undefined ? data.quantity : currentItem.quantity;
      const unitPrice = data.unitPrice !== undefined ? data.unitPrice : currentItem.unitPrice;
      
      updateData.subtotal = quantity * unitPrice;
    }
    
    return this.prisma.contractItem.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
      },
    });
  }

  async updateQuantity(id: string, quantity: number): Promise<ContractItem> {
    // Obter o item atual para ter o preço unitário
    const currentItem = await this.prisma.contractItem.findUnique({
      where: { id },
    });
    
    // Calcular o novo subtotal
    const subtotal = quantity * currentItem.unitPrice;
    
    return this.prisma.contractItem.update({
      where: { id },
      data: {
        quantity,
        subtotal,
      },
      include: {
        product: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.contractItem.delete({
      where: { id },
    });
  }

  async deleteByContractId(contractId: string): Promise<void> {
    await this.prisma.contractItem.deleteMany({
      where: { contractId },
    });
  }
}
"@
Add-Content -Path "src/contracts/infrastructure/repositories/contract-item.repository.ts" -Value $contractItemRepositoryContentContinued

$paymentRepositoryContent = @"
// src/contracts/infrastructure/repositories/payment.repository.ts
import { Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }

  async findByContractId(contractId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { contractId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Partial<Payment>): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        contractId: data.contractId,
        amount: data.amount as any,
        method: data.method,
        status: data.status || PaymentStatus.PENDING,
        installments: data.installments || 1,
        reference: data.reference,
        paidAt: data.paidAt,
        dueDate: data.dueDate,
      },
    });
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: data as any,
    });
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: { status },
    });
  }

  async markAsPaid(id: string): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    });
  }

  async sumPaymentsByContractId(contractId: string): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: {
        contractId,
        status: PaymentStatus.PAID,
      },
      _sum: {
        amount: true,
      },
    });
    
    return result._sum.amount || 0;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payment.delete({
      where: { id },
    });
  }
}
"@
Set-Content -Path "src/contracts/infrastructure/repositories/payment.repository.ts" -Value $paymentRepositoryContent

$notificationRepositoryContent = @"
// src/contracts/infrastructure/repositories/notification.repository.ts
import { Injectable } from '@nestjs/common';
import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      orderBy: { sentAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async findByCustomerId(customerId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { customerId },
      orderBy: { sentAt: 'desc' },
    });
  }

  async findUnreadByCustomerId(customerId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        customerId,
        isRead: false,
      },
      orderBy: { sentAt: 'desc' },
    });
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { type },
      orderBy: { sentAt: 'desc' },
    });
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        customerId: data.customerId,
        type: data.type,
        title: data.title,
        message: data.message,
        isRead: data.isRead || false,
        sentAt: data.sentAt || new Date(),
        readAt: data.readAt,
      },
    });
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: data as any,
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(customerId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        customerId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async countUnreadByCustomerId(customerId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        customerId,
        isRead: false,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }
}
"@
Set-Content -Path "src/contracts/infrastructure/repositories/notification.repository.ts" -Value $notificationRepositoryContent

# Contract DTOs
$contractDtosContent = @"
// src/contracts/application/dtos/contract.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, 
  IsNumber, IsUUID, IsISO8601, IsArray, ValidateNested, Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus } from '../../domain/entities/contract.entity';
import { ContractItemDto, CreateContractItemDto } from './contract-item.dto';
import { PaymentDto } from './payment.dto';

export class CreateContractDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'ID do funcionário' })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiPropertyOptional({ description: 'ID do evento (opcional)' })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiPropertyOptional({ description: 'Data da prova', example: '2023-01-01T14:00:00Z' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  fittingDate?: Date;

  @ApiProperty({ description: 'Data de retirada', example: '2023-01-05T10:00:00Z' })
  @IsISO8601()
  @Type(() => Date)
  pickupDate: Date;

  @ApiProperty({ description: 'Data de devolução', example: '2023-01-10T10:00:00Z' })
  @IsISO8601()
  @Type(() => Date)
  returnDate: Date;

  @ApiPropertyOptional({ description: 'Status do contrato', enum: ContractStatus, default: ContractStatus.DRAFT })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @ApiPropertyOptional({ description: 'Valor do depósito/caução' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiPropertyOptional({ description: 'Condições especiais' })
  @IsOptional()
  @IsString()
  specialConditions?: string;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiProperty({ description: 'Itens do contrato', type: [CreateContractItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContractItemDto)
  items: CreateContractItemDto[];
}

export class UpdateContractDto {
  @ApiPropertyOptional({ description: 'ID do cliente' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ description: 'ID do funcionário' })
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'ID do evento' })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiPropertyOptional({ description: 'Data da prova', example: '2023-01-01T14:00:00Z' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  fittingDate?: Date;

  @ApiPropertyOptional({ description: 'Data de retirada', example: '2023-01-05T10:00:00Z' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  pickupDate?: Date;

  @ApiPropertyOptional({ description: 'Data de devolução', example: '2023-01-10T10:00:00Z' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  returnDate?: Date;

  @ApiPropertyOptional({ description: 'Status do contrato', enum: ContractStatus })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @ApiPropertyOptional({ description: 'Valor do depósito/caução' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiPropertyOptional({ description: 'Condições especiais' })
  @IsOptional()
  @IsString()
  specialConditions?: string;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observations?: string;
}

export class ContractResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  employeeId: string;

  @ApiPropertyOptional()
  eventId?: string;

  @ApiProperty()
  contractNumber: string;

  @ApiPropertyOptional()
  fittingDate?: Date;

  @ApiProperty()
  pickupDate: Date;

  @ApiProperty()
  returnDate: Date;

  @ApiProperty({ enum: ContractStatus })
  status: ContractStatus;

  @ApiProperty()
  totalAmount: number;

  @ApiPropertyOptional()
  depositAmount?: number;

  @ApiPropertyOptional()
  specialConditions?: string;

  @ApiPropertyOptional()
  observations?: string;

  @ApiPropertyOptional({ type: [ContractItemDto] })
  items?: ContractItemDto[];

  @ApiPropertyOptional({ type: [PaymentDto] })
  payments?: PaymentDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ContractStatsDto {
  @ApiProperty({ description: 'Mês (1-12)' })
  month: number;

  @ApiProperty({ description: 'Ano' })
  year: number;

  @ApiProperty({ description: 'Total de contratos' })
  count: number;
}

export class ContractRevenueDto {
  @ApiProperty({ description: 'Mês (1-12)' })
  month: number;

  @ApiProperty({ description: 'Ano' })
  year: number;

  @ApiProperty({ description: 'Valor total dos contratos' })
  total: number;
}
"@
New-Item -Path "src/contracts/application/dtos" -ItemType Directory -Force
Set-Content -Path "src/contracts/application/dtos/contract.dto.ts" -Value $contractDtosContent

$contractItemDtosContent = @"
// src/contracts/application/dtos/contract-item.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt, IsUUID, Min } from 'class-validator';

export class CreateContractItemDto {
  @ApiPropertyOptional({ description: 'ID do contrato (pode ser omitido se estiver criando junto com o contrato)' })
  @IsOptional()
  @IsUUID()
  contractId?: string;

  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantidade' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: 'Preço unitário (se omitido, será usado o preço de aluguel do produto)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class UpdateContractItemDto {
  @ApiPropertyOptional({ description: 'Quantidade' })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Preço unitário' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class ContractItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contractId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  createdAt: Date;
}
"@
Set-Content -Path "src/contracts/application/dtos/contract-item.dto.ts" -Value $contractItemDtosContent

$paymentDtosContent = @"
// src/contracts/application/dtos/payment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, 
  IsInt, IsUUID, Min, Max, IsISO8601 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '../../domain/entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID do contrato' })
  @IsUUID()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({ description: 'Valor do pagamento' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Método de pagamento', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Status do pagamento', enum: PaymentStatus, default: PaymentStatus.PENDING })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Número de parcelas', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number;

  @ApiPropertyOptional({ description: 'Referência externa (número do comprovante, etc.)' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ description: 'Data de pagamento', example: '2023-01-01' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  paidAt?: Date;

  @ApiPropertyOptional({ description: 'Data de vencimento', example: '2023-01-01' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  dueDate?: Date;
}

export class UpdatePaymentDto {
  @ApiPropertyOptional({ description: 'Valor do pagamento' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ description: 'Método de pagamento', enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Status do pagamento', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Número de parcelas' })
  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number;

  @ApiPropertyOptional({ description: 'Referência externa (número do comprovante, etc.)' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ description: 'Data de pagamento', example: '2023-01-01' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  paidAt?: Date;

  @ApiPropertyOptional({ description: 'Data de vencimento', example: '2023-01-01' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  dueDate?: Date;
}

export class PaymentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contractId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  installments: number;

  @ApiPropertyOptional()
  reference?: string;

  @ApiPropertyOptional()
  paidAt?: Date;

  @ApiPropertyOptional()
  dueDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
"@
Set-Content -Path "src/contracts/application/dtos/payment.dto.ts" -Value $paymentDtosContent

$notificationDtosContent = @"
// src/contracts/application/dtos/notification.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, 
  IsUUID, IsDate, IsISO8601
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../../domain/entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Tipo da notificação', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Título da notificação' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Mensagem da notificação' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Notificação marcada como lida', default: false })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({ description: 'Data de envio', example: '2023-01-01T10:00:00Z' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  sentAt?: Date;
}

export class UpdateNotificationDto {
  @ApiPropertyOptional({ description: 'Tipo da notificação', enum: NotificationType })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({ description: 'Título da notificação' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Mensagem da notificação' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'Notificação marcada como lida' })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class NotificationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  sentAt: Date;

  @ApiPropertyOptional()
  readAt?: Date;
}
"@
Set-Content -Path "src/contracts/application/dtos/notification.dto.ts" -Value $notificationDtosContent

# Contract Services
$contractServiceContent = @"
// src/contracts/application/services/contract.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Contract, ContractStatus } from '../../domain/entities/contract.entity';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { IContractItemRepository } from '../../domain/repositories/contract-item.repository.interface';
import { CreateContractDto, UpdateContractDto } from '../dtos/contract.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../../inventory/domain/repositories/product.repository.interface';
import { ProductStatus } from '../../../inventory/domain/entities/product.entity';
import { NotificationService } from './notification.service';
import { NotificationType } from '../../domain/entities/notification.entity';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface';

@Injectable()
export class ContractService extends BaseService<Contract> {
  constructor(
    private readonly contractRepository: IContractRepository,
    private readonly contractItemRepository: IContractItemRepository,
    private readonly productRepository: IProductRepository,
    private readonly customerRepository: ICustomerRepository,
    private readonly notificationService: NotificationService,
  ) {
    super(contractRepository);
  }

  async findAll(): Promise<Contract[]> {
    return this.contractRepository.findAll();
  }

  async findByContractNumber(contractNumber: string): Promise<Contract> {
    const contract = await this.contractRepository.findByContractNumber(contractNumber);
    if (!contract) {
      throw new NotFoundException(\`Contrato com número \${contractNumber} não encontrado\`);
    }
    return contract;
  }

  async findByCustomerId(customerId: string): Promise<Contract[]> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(\`Cliente com ID \${customerId} não encontrado\`);
    }
    
    return this.contractRepository.findByCustomerId(customerId);
  }

  async findByEmployeeId(employeeId: string): Promise<Contract[]> {
    return this.contractRepository.findByEmployeeId(employeeId);
  }

  async findByEventId(eventId: string): Promise<Contract[]> {
    return this.contractRepository.findByEventId(eventId);
  }

  async findByStatus(status: ContractStatus): Promise<Contract[]> {
    return this.contractRepository.findByStatus(status);
  }

  async findLateContracts(): Promise<Contract[]> {
    return this.contractRepository.findLateContracts();
  }

  async findByDateRange(
    startDate: Date, 
    endDate: Date, 
    field: 'pickupDate' | 'returnDate'
  ): Promise<Contract[]> {
    if (startDate > endDate) {
      throw new BadRequestException('A data inicial deve ser anterior à data final');
    }
    
    return this.contractRepository.findByDateRange(startDate, endDate, field);
  }

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    // Validar cliente
    const customer = await this.customerRepository.findById(createContractDto.customerId);
    if (!customer) {
      throw new NotFoundException(\`Cliente com ID \${createContractDto.customerId} não encontrado\`);
    }
    
    // Validar datas
    const now = new Date();
    
    if (createContractDto.fittingDate && createContractDto.fittingDate < now) {
      throw new BadRequestException('A data da prova deve ser futura');
    }
    
    if (createContractDto.pickupDate < now) {
      throw new BadRequestException('A data de retirada deve ser futura');
    }
    
    if (createContractDto.returnDate < createContractDto.pickupDate) {
      throw new BadRequestException('A data de devolução deve ser posterior à data de retirada');
    }
    
    // Validar disponibilidade dos produtos
    for (const item of createContractDto.items) {
      const product = await this.productRepository.findById(item.productId);
      
      if (!product) {
        throw new NotFoundException(\`Produto com ID \${item.productId} não encontrado\`);
      }
      
      if (product.status !== ProductStatus.AVAILABLE) {
        throw new BadRequestException(\`Produto \${product.name} não está disponível para aluguel\`);
      }
      
      if (product.quantity < item.quantity) {
        throw new BadRequestException(\`Quantidade insuficiente do produto \${product.name}. Disponível: \${product.quantity}\`);
      }
      
      // Atualizar o preço unitário se não fornecido
      if (!item.unitPrice) {
        item.unitPrice = product.rentalPrice;
      }
    }
    
    // Gerar número do contrato (formato: ARC-YEAR-SEQUENCE)
    const year = new Date().getFullYear();
    const sequence = Math.floor(10000 + Math.random() * 90000); // 5 dígitos
    const contractNumber = \`ARC-\${year}-\${sequence}\`;
    
    // Calcular o valor total com base nos itens
    const totalAmount = createContractDto.items.reduce(
      (total, item) => total + (item.quantity * item.unitPrice),
      0,
    );
    
    // Criar o contrato
    const contract = await this.contractRepository.create({
      ...createContractDto,
      contractNumber,
      totalAmount,
      status: createContractDto.status || ContractStatus.DRAFT,
    });
    
    // Criar os itens do contrato
    await this.contractItemRepository.createBulk(
      createContractDto.items.map(item => ({
        contractId: contract.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    );
    
    // Atualizar o estoque dos produtos
    for (const item of createContractDto.items) {
      const product = await this.productRepository.findById(item.productId);
      await this.productRepository.update(item.productId, {
        quantity: product.quantity - item.quantity,
      });
    }
    
    // Enviar notificação de confirmação de reserva
    await this.notificationService.create({
      customerId: contract.customerId,
      type: NotificationType.RESERVATION_CONFIRMATION,
      title: 'Reserva Confirmada',
      message: \`Sua reserva foi confirmada com sucesso! Número do contrato: \${contractNumber}\`,
    });
    
    // Se tiver data de prova, enviar lembrete de prova
    if (contract.fittingDate) {
      const fittingDate = new Date(contract.fittingDate);
      await this.notificationService.create({
        customerId: contract.customerId,
        type: NotificationType.FITTING_REMINDER,
        title: 'Lembrete de Prova',
        message: \`Sua prova está agendada para \${fittingDate.toLocaleDateString()} às \${fittingDate.toLocaleTimeString()}\`,
      });
    }
    
    // Buscar o contrato completo com itens
    return this.findById(contract.id);
  }

  async update(id: string, updateContractDto: UpdateContractDto): Promise<Contract> {
    // Verificar se o contrato existe
    const contract = await this.findById(id);
    
    // Verificar se o contrato não está finalizado ou cancelado
    if (
      contract.status === ContractStatus.COMPLETED || 
      contract.status === ContractStatus.CANCELLED
    ) {
      throw new BadRequestException('Não é possível atualizar contratos finalizados ou cancelados');
    }
    
    // Validar datas
    const now = new Date();
    
    if (updateContractDto.fittingDate && updateContractDto.fittingDate < now) {
      throw new BadRequestException('A data da prova deve ser futura');
    }
    
    if (updateContractDto.pickupDate && updateContractDto.pickupDate < now) {
      throw new BadRequestException('A data de retirada deve ser futura');
    }
    
    if (updateContractDto.returnDate && updateContractDto.pickupDate) {
      if (updateContractDto.returnDate < updateContractDto.pickupDate) {
        throw new BadRequestException('A data de devolução deve ser posterior à data de retirada');
      }
    } else if (updateContractDto.returnDate && !updateContractDto.pickupDate) {
      if (updateContractDto.returnDate < contract.pickupDate) {
        throw new BadRequestException('A data de devolução deve ser posterior à data de retirada');
      }
    } else if (!updateContractDto.returnDate && updateContractDto.pickupDate) {
      if (contract.returnDate < updateContractDto.pickupDate) {
        throw new BadRequestException('A data de devolução deve ser posterior à data de retirada');
      }
    }
    
    // Atualizar o contrato
    return this.contractRepository.update(id, updateContractDto);
  }

  async updateStatus(id: string, status: ContractStatus): Promise<Contract> {
    // Verificar se o contrato existe
    const contract = await this.findById(id);
    
    // Verificar transições de status válidas
    this.validateStatusTransition(contract.status, status);
    
    // Atualizar o status do contrato
    const updatedContract = await this.contractRepository.updateStatus(id, status);
    
    // Executar ações conforme o novo status
    await this.executeStatusActions(updatedContract, status);
    
    return updatedContract;
  }

  async calculateTotalAmount(id: string): Promise<number> {
    // Verificar se o contrato existe
    await this.findById(id);
    
    return this.contractRepository.calculateTotalAmount(id);
  }

  async getContractStats(): Promise<{ month: number; year: number; count: number }[]> {
    return this.contractRepository.countContractsByMonthYear();
  }

  async getRevenueStats(): Promise<{ month: number; year: number; total: number }[]> {
    return this.contractRepository.sumContractValuesByMonthYear();
  }

  async delete(id: string): Promise<void> {
    // Verificar se o contrato existe
    const contract = await this.findById(id);
    
    // Só permitir excluir contratos em rascunho
    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException('Somente contratos em rascunho podem ser excluídos');
    }
    
    // Obter os itens do contrato
    const items = await this.contractItemRepository.findByContractId(id);
    
    // Devolver os itens ao estoque
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      await this.productRepository.update(item.productId, {
        quantity: product.quantity + item.quantity,
      });
    }
    
    // Excluir o contrato
    return this.contractRepository.delete(id);
  }

  private validateStatusTransition(currentStatus: ContractStatus, newStatus: ContractStatus): void {
    const allowedTransitions = {
      [ContractStatus.DRAFT]: [
        ContractStatus.FITTING_SCHEDULED, 
        ContractStatus.SIGNED, 
        ContractStatus.CANCELLED
      ],
      [ContractStatus.FITTING_SCHEDULED]: [
        ContractStatus.SIGNED, 
        ContractStatus.DRAFT, 
        ContractStatus.CANCELLED
      ],
      [ContractStatus.SIGNED]: [
        ContractStatus.PAID, 
        ContractStatus.CANCELLED
      ],
      [ContractStatus.PAID]: [
        ContractStatus.PICKED_UP, 
        ContractStatus.CANCELLED
      ],
      [ContractStatus.PICKED_UP]: [
        ContractStatus.RETURNED, 
        ContractStatus.LATE
      ],
      [ContractStatus.LATE]: [
        ContractStatus.RETURNED
      ],
      [ContractStatus.RETURNED]: [
        ContractStatus.COMPLETED
      ],
      [ContractStatus.CANCELLED]: [],
      [ContractStatus.COMPLETED]: [],
    };
    
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        \`Transição de status inválida: \${currentStatus} para \${newStatus}\`
      );
    }
  }

  private async executeStatusActions(contract: Contract, status: ContractStatus): Promise<void> {
    switch (status) {
      case ContractStatus.FITTING_SCHEDULED:
        // Enviar notificação de agendamento de prova
        if (contract.fittingDate) {
          const fittingDate = new Date(contract.fittingDate);
          await this.notificationService.create({
            customerId: contract.customerId,
            type: NotificationType.FITTING_REMINDER,
            title: 'Prova Agendada',
            message: \`Sua prova foi agendada para \${fittingDate.toLocaleDateString()} às \${fittingDate.toLocaleTimeString()}\`,
          });
        }
        break;
        
      case ContractStatus.PAID:
        // Enviar notificação de confirmação de pagamento
        await this.notificationService.create({
          customerId: contract.customerId,
          type: NotificationType.PAYMENT_CONFIRMATION,
          title: 'Pagamento Confirmado',
          message: \`Seu pagamento foi confirmado! Você já pode retirar suas peças conforme combinado.\`,
        });
        break;
        
      case ContractStatus.PICKED_UP:
        // Enviar notificação de lembrete de devolução
        const returnDate = new Date(contract.returnDate);
        await this.notificationService.create({
          customerId: contract.customerId,
          type: NotificationType.RETURN_ALERT,
          title: 'Lembrete de Devolução',
          message: \`Lembre-se: a devolução está agendada para \${returnDate.toLocaleDateString()}. Aguardamos você!\`,
        });
        break;
        
      case ContractStatus.RETURNED:
        // Devolver os itens ao estoque
        const items = await this.contractItemRepository.findByContractId(contract.id);
        
        for (const item of items) {
          const product = await this.productRepository.findById(item.productId);
          await this.productRepository.update(item.productId, {
            quantity: product.quantity + item.quantity,
            status: ProductStatus.AVAILABLE,
          });
        }
        break;
        
      case ContractStatus.CANCELLED:
        // Devolver os itens ao estoque se o contrato for cancelado
        if (
          contract.status !== ContractStatus.DRAFT && 
          contract.status !== ContractStatus.FITTING_SCHEDULED
        ) {
          const items = await this.contractItemRepository.findByContractId(contract.id);
          
          for (const item of items) {
            const product = await this.productRepository.findById(item.productId);
            await this.productRepository.update(item.productId, {
              quantity: product.quantity + item.quantity,
              status: ProductStatus.AVAILABLE,
            });
          }
        }
        break;
    }
  }
}
"@
New-Item -Path "src/contracts/application/services" -ItemType Directory -Force
Set-Content -Path "src/contracts/application/services/contract.service.ts" -Value $contractServiceContent

$contractItemServiceContent = @"
// src/contracts/application/services/contract-item.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContractItem } from '../../domain/entities/contract-item.entity';
import { IContractItemRepository } from '../../domain/repositories/contract-item.repository.interface';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { IProductRepository } from '../../../inventory/domain/repositories/product.repository.interface';
import { CreateContractItemDto, UpdateContractItemDto } from '../dtos/contract-item.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ContractStatus } from '../../domain/entities/contract.entity';
import { ProductStatus } from '../../../inventory/domain/entities/product.entity';

@Injectable()
export class ContractItemService extends BaseService<ContractItem> {
  constructor(
    private readonly contractItemRepository: IContractItemRepository,
    private readonly contractRepository: IContractRepository,
    private readonly productRepository: IProductRepository,
  ) {
    super(contractItemRepository);
  }

  async findAll(): Promise<ContractItem[]> {
    return this.contractItemRepository.findAll();
  }

  async findByContractId(contractId: string): Promise<ContractItem[]> {
    // Verificar se o contrato existe
    const contractExists = await this.contractRepository.findById(contractId);
    if (!contractExists) {
      throw new NotFoundException(\`Contrato com ID \${contractId} não encontrado\`);
    }
    
    return this.contractItemRepository.findByContractId(contractId);
  }

  async findByProductId(productId: string): Promise<ContractItem[]> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(\`Produto com ID \${productId} não encontrado\`);
    }
    
    return this.contractItemRepository.findByProductId(productId);
  }

  async create(createContractItemDto: CreateContractItemDto): Promise<ContractItem> {
    // Verificar se o contrato existe
    const contract = await this.contractRepository.findById(createContractItemDto.contractId);
    if (!contract) {
      throw new NotFoundException(\`Contrato com ID \${createContractItemDto.contractId} não encontrado\`);
    }
    
    // Verificar se o contrato está em um estado que permite adicionar itens
    if (
      contract.status !== ContractStatus.DRAFT &&
      contract.status !== ContractStatus.FITTING_SCHEDULED
    ) {
      throw new BadRequestException('Não é possível adicionar itens a este contrato no estado atual');
    }
    
    // Verificar se o produto existe
    const product = await this.productRepository.findById(createContractItemDto.productId);
    if (!product) {
      throw new NotFoundException(\`Produto com ID \${createContractItemDto.productId} não encontrado\`);
    }
    
    // Verificar se o produto está disponível
    if (product.status !== ProductStatus.AVAILABLE) {
      throw new BadRequestException(\`Produto \${product.name} não está disponível para aluguel\`);
    }
    
    // Verificar se há quantidade suficiente
    if (product.quantity < createContractItemDto.quantity) {
      throw new BadRequestException(\`Quantidade insuficiente do produto \${product.name}. Disponível: \${product.quantity}\`);
    }
    
    // Se não for fornecido o preço unitário, usar o preço do produto
    if (!createContractItemDto.unitPrice) {
      createContractItemDto.unitPrice = product.rentalPrice;
    }
    
    // Criar o item
    const contractItem = await this.contractItemRepository.create(createContractItemDto);
    
    // Atualizar o estoque do produto
    await this.productRepository.update(product.id, {
      quantity: product.quantity - createContractItemDto.quantity,
    });
    
    // Recalcular o valor total do contrato
    const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
    await this.contractRepository.update(contract.id, { totalAmount });
    
    return contractItem;
  }

  async update(id: string, updateContractItemDto: UpdateContractItemDto): Promise<ContractItem> {
    // Verificar se o item existe
    const item = await this.findById(id);
    
    // Verificar se o contrato existe e está em um estado que permite atualizar itens
    const contract = await this.contractRepository.findById(item.contractId);
    if (
      contract.status !== ContractStatus.DRAFT &&
      contract.status !== ContractStatus.FITTING_SCHEDULED
    ) {
      throw new BadRequestException('Não é possível atualizar itens deste contrato no estado atual');
    }
    
    // Verificar se está aumentando a quantidade
    if (updateContractItemDto.quantity && updateContractItemDto.quantity > item.quantity) {
      // Verificar se há estoque suficiente
      const product = await this.productRepository.findById(item.productId);
      const additionalQuantity = updateContractItemDto.quantity - item.quantity;
      
      if (product.quantity < additionalQuantity) {
        throw new BadRequestException(\`Quantidade insuficiente do produto. Disponível: \${product.quantity}\`);
      }
      
      // Atualizar o estoque do produto (reduzir)
      await this.productRepository.update(product.id, {
        quantity: product.quantity - additionalQuantity,
      });
    } else if (updateContractItemDto.quantity && updateContractItemDto.quantity < item.quantity) {
      // Está diminuindo a quantidade, devolver ao estoque
      const product = await this.productRepository.findById(item.productId);
      const returnedQuantity = item.quantity - updateContractItemDto.quantity;
      
      // Atualizar o estoque do produto (aumentar)
      await this.productRepository.update(product.id, {
        quantity: product.quantity + returnedQuantity,
      });
    }
    
    // Atualizar o item
    const updatedItem = await this.contractItemRepository.update(id, updateContractItemDto);
    
    // Recalcular o valor total do contrato
    const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
    await this.contractRepository.update(contract.id, { totalAmount });
    
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    // Verificar se o item existe
    const item = await this.findById(id);
    
    // Verificar se o contrato existe e está em um estado que permite remover itens
    const contract = await this.contractRepository.findById(item.contractId);
    if (
      contract.status !== ContractStatus.DRAFT &&
      contract.status !== ContractStatus.FITTING_SCHEDULED
    ) {
      throw new BadRequestException('Não é possível remover itens deste contrato no estado atual');
    }
    
    // Devolver a quantidade ao estoque
    const product = await this.productRepository.findById(item.productId);
    await this.productRepository.update(product.id, {
      quantity: product.quantity + item.quantity,
    });
    
    // Excluir o item
    await this.contractItemRepository.delete(id);
    
    // Recalcular o valor total do contrato
    const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
    await this.contractRepository.update(contract.id, { totalAmount });
  }
}
"@
Set-Content -Path "src/contracts/application/services/contract-item.service.ts" -Value $contractItemServiceContent

$paymentServiceContent = @"
// src/contracts/application/services/payment.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { CreatePaymentDto, UpdatePaymentDto } from '../dtos/payment.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ContractStatus } from '../../domain/entities/contract.entity';
import { NotificationService } from './notification.service';
import { NotificationType } from '../../domain/entities/notification.entity';

@Injectable()
export class PaymentService extends BaseService<Payment> {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly contractRepository: IContractRepository,
    private readonly notificationService: NotificationService,
  ) {
    super(paymentRepository);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findByContractId(contractId: string): Promise<Payment[]> {
    // Verificar se o contrato existe
    const contractExists = await this.contractRepository.findById(contractId);
    if (!contractExists) {
      throw new NotFoundException(\`Contrato com ID \${contractId} não encontrado\`);
    }
    
    return this.paymentRepository.findByContractId(contractId);
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return this.paymentRepository.findByStatus(status);
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Verificar se o contrato existe
    const contract = await this.contractRepository.findById(createPaymentDto.contractId);
    if (!contract) {
      throw new NotFoundException(\`Contrato com ID \${createPaymentDto.contractId} não encontrado\`);
    }
    
    // Verificar se o contrato está assinado ou pago
    if (
      contract.status !== ContractStatus.SIGNED &&
      contract.status !== ContractStatus.PAID &&
      contract.status !== ContractStatus.PICKED_UP
    ) {
      throw new BadRequestException('O contrato deve estar assinado ou pago para registrar pagamentos');
    }
    
    // Verificar o valor total já pago
    const paidAmount = await this.paymentRepository.sumPaymentsByContractId(contract.id);
    const pendingAmount = contract.totalAmount - paidAmount;
    
    // Verificar se o valor não ultrapassa o total
    if (createPaymentDto.amount > pendingAmount) {
      throw new BadRequestException(\`Valor excede o saldo pendente. Valor pendente: \${pendingAmount}\`);
    }
    
    // Criar o pagamento
    const payment = await this.paymentRepository.create(createPaymentDto);
    
    // Se o pagamento for marcado como pago na criação
    if (payment.status === PaymentStatus.PAID) {
      // Enviar notificação de confirmação
      await this.notificationService.create({
        customerId: contract.customerId,
        type: NotificationType.PAYMENT_CONFIRMATION,
        title: 'Pagamento Confirmado',
        message: \`Seu pagamento de R$ \${payment.amount.toFixed(2)} foi confirmado!\`,
      });
      
      // Verificar se o contrato está totalmente pago
      await this.checkContractFullyPaid(contract.id);
    }
    
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    // Verificar se o pagamento existe
    const payment = await this.findById(id);
    
    // Verificar se o contrato existe
    const contract = await this.contractRepository.findById(payment.contractId);
    
    // Verificar se está alterando o valor
    if (updatePaymentDto.amount && updatePaymentDto.amount !== payment.amount) {
      // Calcular o valor total já pago sem este pagamento
      const paidAmount = await this.paymentRepository.sumPaymentsByContractId(payment.contractId);
      const paidAmountWithoutThis = payment.status === PaymentStatus.PAID
        ? paidAmount - payment.amount
        : paidAmount;
      
      const pendingAmount = contract.totalAmount - paidAmountWithoutThis;
      
      // Verificar se o novo valor não ultrapassa o total
      if (updatePaymentDto.amount > pendingAmount) {
        throw new BadRequestException(\`Valor excede o saldo pendente. Valor pendente: \${pendingAmount}\`);
      }
    }
    
    // Verificar se está alterando o status para PAGO
    const becomingPaid = 
      payment.status !== PaymentStatus.PAID && 
      updatePaymentDto.status === PaymentStatus.PAID;
    
    // Atualizar o pagamento
    const updatedPayment = await this.paymentRepository.update(id, updatePaymentDto);
    
    // Se o pagamento foi marcado como pago nesta atualização
    if (becomingPaid) {
      // Enviar notificação de confirmação
      await this.notificationService.create({
        customerId: contract.customerId,
        type: NotificationType.PAYMENT_CONFIRMATION,
        title: 'Pagamento Confirmado',
        message: \`Seu pagamento de R$ \${updatedPayment.amount.toFixed(2)} foi confirmado!\`,
      });
      
      // Verificar se o contrato está totalmente pago
      await this.checkContractFullyPaid(updatedPayment.contractId);
    }
    
    return updatedPayment;
  }

  async markAsPaid(id: string): Promise<Payment> {
    // Verificar se o pagamento existe
    const payment = await this.findById(id);
    
    // Verificar se já está pago
    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Este pagamento já está marcado como pago');
    }
    
    // Verificar se o contrato existe
    const contract = await this.contractRepository.findById(payment.contractId);
    
    // Marcar como pago
    const updatedPayment = await this.paymentRepository.markAsPaid(id);
    
    // Enviar notificação de confirmação
    await this.notificationService.create({
      customerId: contract.customerId,
      type: NotificationType.PAYMENT_CONFIRMATION,
      title: 'Pagamento Confirmado',
      message: \`Seu pagamento de R$ \${updatedPayment.amount.toFixed(2)} foi confirmado!\`,
    });
    
    // Verificar se o contrato está totalmente pago
    await this.checkContractFullyPaid(updatedPayment.contractId);
    
    return updatedPayment;
  }

  async delete(id: string): Promise<void> {
    // Verificar se o pagamento existe
    const payment = await this.findById(id);
    
    // Verificar se o pagamento está pago
    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Não é possível excluir um pagamento já confirmado');
    }
    
    // Excluir o pagamento
    await this.paymentRepository.delete(id);
  }

  private async checkContractFullyPaid(contractId: string): Promise<void> {
    // Obter o contrato
    const contract = await this.contractRepository.findById(contractId);
    
    // Calcular o valor total pago
    const paidAmount = await this.paymentRepository.sumPaymentsByContractId(contractId);
    
    // Verificar se o contrato está totalmente pago
    if (paidAmount >= contract.totalAmount) {
      // Atualizar o status do contrato para PAGO se estiver ASSINADO
      if (contract.status === ContractStatus.SIGNED) {
        await this.contractRepository.updateStatus(contractId, ContractStatus.PAID);
      }
    }
  }
}
"@
Set-Content -Path "src/contracts/application/services/payment.service.ts" -Value $paymentServiceContent

$notificationServiceContent = @"
// src/contracts/application/services/notification.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { CreateNotificationDto, UpdateNotificationDto } from '../dtos/notification.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly customerRepository: ICustomerRepository,
  ) {
    super(notificationRepository);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.findAll();
  }

  async findByCustomerId(customerId: string): Promise<Notification[]> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(\`Cliente com ID \${customerId} não encontrado\`);
    }
    
    return this.notificationRepository.findByCustomerId(customerId);
  }

  async findUnreadByCustomerId(customerId: string): Promise<Notification[]> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(\`Cliente com ID \${customerId} não encontrado\`);
    }
    
    return this.notificationRepository.findUnreadByCustomerId(customerId);
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return this.notificationRepository.findByType(type);
  }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(createNotificationDto.customerId);
    if (!customerExists) {
      throw new NotFoundException(\`Cliente com ID \${createNotificationDto.customerId} não encontrado\`);
    }
    
    // Definir data de envio se não fornecida
    if (!createNotificationDto.sentAt) {
      createNotificationDto.sentAt = new Date();
    }
    
    return this.notificationRepository.create(createNotificationDto);
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    // Verificar se a notificação existe
    await this.findById(id);
    
    return this.notificationRepository.update(id, updateNotificationDto);
  }

  async markAsRead(id: string): Promise<Notification> {
    // Verificar se a notificação existe
    const notification = await this.findById(id);
    
    // Verificar se já está lida
    if (notification.isRead) {
      return notification;
    }
    
    return this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(customerId: string): Promise<void> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(\`Cliente com ID \${customerId} não encontrado\`);
    }
    
    return this.notificationRepository.markAllAsRead(customerId);
  }

  async countUnreadByCustomerId(customerId: string): Promise<number> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(\`Cliente com ID \${customerId} não encontrado\`);
    }
    
    return this.notificationRepository.countUnreadByCustomerId(customerId);
  }

  async delete(id: string): Promise<void> {
    // Verificar se a notificação existe
    await this.findById(id);
    
    return this.notificationRepository.delete(id);
  }
}
"@
Set-Content -Path "src/contracts/application/services/notification.service.ts" -Value $notificationServiceContent

# Contract Controllers
$contractControllerContent = @"
// src/contracts/presentation/controllers/contract.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, HttpStatus, ParseEnumPipe, 
  HttpCode, BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery 
} from '@nestjs/swagger';
import { ContractService } from '../../application/services/contract.service';
import { 
  CreateContractDto, UpdateContractDto, ContractResponseDto,
  ContractStatsDto, ContractRevenueDto 
} from '../../application/dtos/contract.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { ContractStatus } from '../../domain/entities/contract.entity';
import { ParseDatePipe } from '../../../auth/presentation/pipes/parse-date.pipe';

@ApiTags('Contratos')
@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar todos os contratos' })
  @ApiResponse({ status: 200, description: 'Lista de contratos retornada com sucesso', type: [ContractResponseDto] })
  async findAll() {
    return this.contractService.findAll();
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Obter estatísticas de contratos por mês e ano' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso', type: [ContractStatsDto] })
  async getContractStats() {
    return this.contractService.getContractStats();
  }

  @Get('revenue')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Obter estatísticas de faturamento por mês e ano' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso', type: [ContractRevenueDto] })
  async getRevenueStats() {
    return this.contractService.getRevenueStats();
  }

  @Get('by-number/:contractNumber')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar contrato por número' })
  @ApiParam({ name: 'contractNumber', description: 'Número do contrato' })
  @ApiResponse({ status: 200, description: 'Contrato encontrado com sucesso', type: ContractResponseDto })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findByContractNumber(@Param('contractNumber') contractNumber: string) {
    return this.contractService.findByContractNumber(contractNumber);
  }

  @Get('customer/:customerId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Lista de contratos do cliente', type: [ContractResponseDto] })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByCustomerId(@Param('customerId') customerId: string) {
    return this.contractService.findByCustomerId(customerId);
  }

  @Get('employee/:employeeId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar contratos de um funcionário' })
  @ApiParam({ name: 'employeeId', description: 'ID do funcionário' })
  @ApiResponse({ status: 200, description: 'Lista de contratos do funcionário', type: [ContractResponseDto] })
  async findByEmployeeId(@Param('employeeId') employeeId: string) {
    return this.contractService.findByEmployeeId(employeeId);
  }

  @Get('event/:eventId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos de um evento' })
  @ApiParam({ name: 'eventId', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Lista de contratos do evento', type: [ContractResponseDto] })
  async findByEventId(@Param('eventId') eventId: string) {
    return this.contractService.findByEventId(eventId);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos por status' })
  @ApiParam({ name: 'status', enum: ContractStatus, description: 'Status do contrato' })
  @ApiResponse({ status: 200, description: 'Lista de contratos filtrada por status', type: [ContractResponseDto] })
  async findByStatus(
    @Param('status', new ParseEnumPipe(ContractStatus)) status: ContractStatus
  ) {
    return this.contractService.findByStatus(status);
  }

  @Get('late')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos em atraso' })
  @ApiResponse({ status: 200, description: 'Lista de contratos em atraso', type: [ContractResponseDto] })
  async findLateContracts() {
    return this.contractService.findLateContracts();
  }

  @Get('date-range')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos por intervalo de datas' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'Data final (YYYY-MM-DD)' })
  @ApiQuery({ name: 'field', required: true, enum: ['pickupDate', 'returnDate'], description: 'Campo de data' })
  @ApiResponse({ status: 200, description: 'Lista de contratos no intervalo de datas', type: [ContractResponseDto] })
  async findByDateRange(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Query('field') field: 'pickupDate' | 'returnDate'
  ) {
    if (field !== 'pickupDate' && field !== 'returnDate') {
      throw new BadRequestException('O campo deve ser "pickupDate" ou "returnDate"');
    }
    
    return this.contractService.findByDateRange(startDate, endDate, field);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar contrato por ID' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ status: 200, description: 'Contrato encontrado com sucesso', type: ContractResponseDto })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.contractService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Criar novo contrato' })
  @ApiResponse({ status: 201, description: 'Contrato criado com sucesso', type: ContractResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Recurso não encontrado' })
  async create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ status: 200, description: 'Contrato atualizado com sucesso', type: ContractResponseDto })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractService.update(id, updateContractDto);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar status do contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiQuery({ name: 'status', enum: ContractStatus, description: 'Novo status do contrato' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso', type: ContractResponseDto })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async updateStatus(
    @Param('id') id: string,
    @Query('status', new ParseEnumPipe(ContractStatus)) status: ContractStatus
  ) {
    return this.contractService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Excluir contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Contrato excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contractService.delete(id);
  }
}
"@
New-Item -Path "src/contracts/presentation/controllers" -ItemType Directory -Force
Set-Content -Path "src/contracts/presentation/controllers/contract.controller.ts" -Value $contractControllerContent

$contractItemControllerContent = @"
// src/contracts/presentation/controllers/contract-item.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, HttpStatus, HttpCode
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { ContractItemService } from '../../application/services/contract-item.service';
import { 
  CreateContractItemDto, UpdateContractItemDto, ContractItemDto 
} from '../../application/dtos/contract-item.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Itens de Contrato')
@Controller('contract-items')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractItemController {
  constructor(private readonly contractItemService: ContractItemService) {}

  @Get('contract/:contractId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar itens de um contrato' })
  @ApiParam({ name: 'contractId', description: 'ID do contrato' })
  @ApiResponse({ status: 200, description: 'Lista de itens do contrato', type: [ContractItemDto] })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findByContractId(@Param('contractId') contractId: string) {
    return this.contractItemService.findByContractId(contractId);
  }

  @Get('product/:productId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar aluguéis de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Lista de aluguéis do produto', type: [ContractItemDto] })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findByProductId(@Param('productId') productId: string) {
    return this.contractItemService.findByProductId(productId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar item por ID' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Item encontrado com sucesso', type: ContractItemDto })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.contractItemService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Adicionar item ao contrato' })
  @ApiResponse({ status: 201, description: 'Item adicionado com sucesso', type: ContractItemDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Recurso não encontrado' })
  async create(@Body() createContractItemDto: CreateContractItemDto) {
    return this.contractItemService.create(createContractItemDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar item do contrato' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso', type: ContractItemDto })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async update(@Param('id') id: string, @Body() updateContractItemDto: UpdateContractItemDto) {
    return this.contractItemService.update(id, updateContractItemDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Remover item do contrato' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contractItemService.delete(id);
  }
}
"@
Set-Content -Path "src/contracts/presentation/controllers/contract-item.controller.ts" -Value $contractItemControllerContent

$paymentControllerContent = @"
// src/contracts/presentation/controllers/payment.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, HttpStatus, ParseEnumPipe, HttpCode 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery 
} from '@nestjs/swagger';
import { PaymentService } from '../../application/services/payment.service';
import { 
  CreatePaymentDto, UpdatePaymentDto, PaymentDto 
} from '../../application/dtos/payment.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { PaymentStatus } from '../../domain/entities/payment.entity';

@ApiTags('Pagamentos')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar todos os pagamentos' })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos retornada com sucesso', type: [PaymentDto] })
  async findAll() {
    return this.paymentService.findAll();
  }

  @Get('contract/:contractId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar pagamentos de um contrato' })
  @ApiParam({ name: 'contractId', description: 'ID do contrato' })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos do contrato', type: [PaymentDto] })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findByContractId(@Param('contractId') contractId: string) {
    return this.paymentService.findByContractId(contractId);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar pagamentos por status' })
  @ApiParam({ name: 'status', enum: PaymentStatus, description: 'Status do pagamento' })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos filtrada por status', type: [PaymentDto] })
  async findByStatus(
    @Param('status', new ParseEnumPipe(PaymentStatus)) status: PaymentStatus
  ) {
    return this.paymentService.findByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado com sucesso', type: PaymentDto })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.paymentService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Registrar novo pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento registrado com sucesso', type: PaymentDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento atualizado com sucesso', type: PaymentDto })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Put(':id/mark-as-paid')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Marcar pagamento como pago' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento marcado como pago com sucesso', type: PaymentDto })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async markAsPaid(@Param('id') id: string) {
    return this.paymentService.markAsPaid(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Excluir pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Pagamento excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.paymentService.delete(id);
  }
}
"@
Set-Content -Path "src/contracts/presentation/controllers/payment.controller.ts" -Value $paymentControllerContent

$notificationControllerContent = @"
// src/contracts/presentation/controllers/notification.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, HttpStatus, ParseEnumPipe, HttpCode 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery 
} from '@nestjs/swagger';
import { NotificationService } from '../../application/services/notification.service';
import { 
  CreateNotificationDto, UpdateNotificationDto, NotificationDto 
} from '../../application/dtos/notification.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { NotificationType } from '../../domain/entities/notification.entity';

@ApiTags('Notificações')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar todas as notificações' })
  @ApiResponse({ status: 200, description: 'Lista de notificações retornada com sucesso', type: [NotificationDto] })
  async findAll() {
    return this.notificationService.findAll();
  }

  @Get('customer/:customerId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar notificações de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Lista de notificações do cliente', type: [NotificationDto] })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByCustomerId(@Param('customerId') customerId: string) {
    return this.notificationService.findByCustomerId(customerId);
  }

  @Get('customer/:customerId/unread')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar notificações não lidas de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Lista de notificações não lidas do cliente', type: [NotificationDto] })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findUnreadByCustomerId(@Param('customerId') customerId: string) {
    return this.notificationService.findUnreadByCustomerId(customerId);
  }

  @Get('customer/:customerId/count-unread')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Contar notificações não lidas de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Contagem de notificações não lidas', schema: {
    properties: {
      count: { type: 'number', description: 'Número de notificações não lidas' }
    }
  }})
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async countUnreadByCustomerId(@Param('customerId') customerId: string) {
    const count = await this.notificationService.countUnreadByCustomerId(customerId);
    return { count };
  }

  @Get('type/:type')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar notificações por tipo' })
  @ApiParam({ name: 'type', enum: NotificationType, description: 'Tipo da notificação' })
  @ApiResponse({ status: 200, description: 'Lista de notificações filtrada por tipo', type: [NotificationDto] })
  async findByType(
    @Param('type', new ParseEnumPipe(NotificationType)) type: NotificationType
  ) {
    return this.notificationService.findByType(type);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar notificação por ID' })
  @ApiParam({ name: 'id', description: 'ID da notificação' })
  @ApiResponse({ status: 200, description: 'Notificação encontrada com sucesso', type: NotificationDto })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.notificationService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Criar nova notificação' })
  @ApiResponse({ status: 201, description: 'Notificação criada com sucesso', type: NotificationDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar notificação' })
  @ApiParam({ name: 'id', description: 'ID da notificação' })
  @ApiResponse({ status: 200, description: 'Notificação atualizada com sucesso', type: NotificationDto })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  async update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Put(':id/mark-as-read')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiParam({ name: 'id', description: 'ID da notificação' })
  @ApiResponse({ status: 200, description: 'Notificação marcada como lida com sucesso', type: NotificationDto })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Put('customer/:customerId/mark-all-as-read')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Marcar todas as notificações do cliente como lidas' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Notificações marcadas como lidas com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async markAllAsRead(@Param('customerId') customerId: string) {
    await this.notificationService.markAllAsRead(customerId);
    return { message: 'Todas as notificações foram marcadas como lidas' };
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Excluir notificação' })
  @ApiParam({ name: 'id', description: 'ID da notificação' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Notificação excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.notificationService.delete(id);
  }
}
"@
Set-Content -Path "src/contracts/presentation/controllers/notification.controller.ts" -Value $notificationControllerContent

# Contracts Module
# Continuação do arquivo contracts.module.ts
$contractsModuleContentContinued = @"
import { Module } from '@nestjs/common';
import { ContractController } from './presentation/controllers/contract.controller';
import { ContractItemController } from './presentation/controllers/contract-item.controller';
import { PaymentController } from './presentation/controllers/payment.controller';
import { NotificationController } from './presentation/controllers/notification.controller';
import { ContractService } from './application/services/contract.service';
import { ContractItemService } from './application/services/contract-item.service';
import { PaymentService } from './application/services/payment.service';
import { NotificationService } from './application/services/notification.service';
import { ContractRepository } from './infrastructure/repositories/contract.repository';
import { ContractItemRepository } from './infrastructure/repositories/contract-item.repository';
import { PaymentRepository } from './infrastructure/repositories/payment.repository';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    PrismaModule,
    InventoryModule,
    CustomersModule,
  ],
  controllers: [
    ContractController,
    ContractItemController,
    PaymentController,
    NotificationController,
  ],
  providers: [
    ContractService,
    ContractItemService,
    PaymentService,
    NotificationService,
    {
      provide: 'IContractRepository',
      useClass: ContractRepository,
    },
    {
      provide: 'IContractItemRepository',
      useClass: ContractItemRepository,
    },
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
  ],
  exports: [
    ContractService,
    ContractItemService,
    PaymentService,
    NotificationService,
  ],
})
export class ContractsModule {}
"@
Set-Content -Path "src/contracts/contracts.module.ts" -Value $contractsModuleContentContinued

# Atualizar o app.module.ts para incluir todos os módulos
$appModuleContent = @"
// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';
import { CustomersModule } from './customers/customers.module';
import { InventoryModule } from './inventory/inventory.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { ContractsModule } from './contracts/contracts.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { LoggerMiddleware } from './shared/presentation/middlewares/logger.middleware';

@Module({
  imports: [
    // Configuração do ambiente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Módulos da aplicação
    PrismaModule,
    AuthModule,
    EmployeesModule,
    CustomersModule,
    InventoryModule,
    EventsModule,
    ContractsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
"@
Set-Content -Path "src/app.module.ts" -Value $appModuleContent

# Criar um script para finalizar a configuração do projeto
$finalizeProjectScript = @"
# FinalizeProjectSetup.ps1
# Script para finalizar a configuração do projeto

Write-Host "Finalizando configuração do projeto..." -ForegroundColor Cyan

# Atualizar package.json com scripts e dependências adicionais
$packageJsonPath = "package.json"
$packageJson = Get-Content -Path $packageJsonPath -Raw | ConvertFrom-Json

# Adicionar dependência do lodash e tipos
Write-Host "Adicionando dependências adicionais..." -ForegroundColor Yellow
npm install --save lodash
npm install --save-dev @types/lodash

# Adicionar script para gerar relatórios de cobertura de testes
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "test:cov" -Value "jest --coverage"

# Adicionar script para executar seeds
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "seed" -Value "ts-node prisma/seed.ts"

# Adicionar script para executar testes e2e
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "test:e2e" -Value "jest --config ./test/jest-e2e.json"

# Salvar package.json atualizado
$packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path $packageJsonPath

# Criar arquivo .env.example
$envExampleContent = @"
# Configurações do Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aluguel_roupas?schema=public"

# Configurações de Autenticação
JWT_SECRET="chave-super-secreta-substitua-em-producao"
JWT_EXPIRATION="1d"
REFRESH_TOKEN_SECRET="chave-refresh-super-secreta-substitua-em-producao"
REFRESH_TOKEN_EXPIRATION="7d"

# Configurações da Aplicação
PORT=3000
NODE_ENV=development
"@
Set-Content -Path ".env.example" -Value $envExampleContent

# Criar arquivo README.md atualizado
$readmeContent = @"
# Sistema de Gerenciamento para Loja de Aluguel de Roupas

Sistema completo para gerenciamento de loja de aluguel de roupas construído com NestJS, TypeScript, Prisma ORM e PostgreSQL.

## Arquitetura

O sistema segue uma arquitetura de microserviços com princípios do Domain-Driven Design (DDD).

### Camadas
- Camada de Domínio: Entidades, Agregados, Serviços de Domínio
- Camada de Aplicação: Casos de Uso, DTOs, Serviços de Aplicação
- Camada de Infraestrutura: Repositórios, Adaptadores Externos
- Camada de Apresentação: Controladores, Middlewares

### Módulos
- Autenticação: Gerenciamento de usuários, permissões e logs de auditoria
- Funcionários: Gerenciamento de funcionários da loja
- Clientes: Gerenciamento de dados e histórico de clientes
- Inventário: Gerenciamento de produtos, categorias e manutenção
- Eventos/Locais: Gerenciamento de eventos e locais associados
- Contratos: Gerenciamento de aluguéis, pagamentos e notificações

## Tecnologias Utilizadas

- **Backend**: NestJS + TypeScript
- **ORM**: Prisma ORM
- **Banco de Dados**: PostgreSQL
- **API**: REST com documentação Swagger
- **Autenticação**: JWT com refresh tokens e controle de acesso baseado em papéis
- **Testes**: Jest + Supertest
- **Validação**: class-validator + class-transformer

## Requisitos

- Node.js (v16 ou superior)
- PostgreSQL (v13 ou superior)

## Instalação

1. Clone este repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure o arquivo `.env` com suas variáveis de ambiente (use `.env.example` como base)
4. Execute as migrações do banco de dados:
   ```
   npx prisma migrate dev
   ```
5. Execute os seeds para popular dados iniciais (opcional):
   ```
   npm run seed
   ```

## Executando o Projeto

### Desenvolvimento
```
npm run start:dev
```

### Produção
```
npm run build
npm run start:prod
```

## Acesso à API

- API REST: http://localhost:3000/api
- Documentação Swagger: http://localhost:3000/api/docs

## Testes

### Executar testes unitários
```
npm run test
```

### Executar testes de integração
```
npm run test:e2e
```

### Gerar relatório de cobertura
```
npm run test:cov
```

## Estrutura do Projeto
```
aluguel-roupas/
├── src/
│   ├── auth/              # Módulo de autenticação
│   ├── employees/         # Módulo de funcionários
│   ├── customers/         # Módulo de clientes
│   ├── inventory/         # Módulo de inventário
│   ├── events/            # Módulo de eventos/locais
│   ├── contracts/         # Módulo de contratos
│   ├── shared/            # Código compartilhado
│   ├── app.module.ts      # Módulo principal
│   └── main.ts            # Ponto de entrada
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── seed.ts            # Script de seeds
├── test/                  # Testes de integração
├── .env                   # Variáveis de ambiente
└── package.json
```
"@
Set-Content -Path "README.md" -Value $readmeContent

# Adicionar arquivo .gitignore mais completo
$gitignoreContent = @"
# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# Environment
.env
.env.local
.env.development
.env.test
.env.production

# Prisma
/prisma/migrations
/prisma/dev.db
/prisma/dev.db-journal

# Reports
/reports
"@
Set-Content -Path ".gitignore" -Value $gitignoreContent

# Criar arquivo LICENSE
$licenseContent = @"
MIT License

Copyright (c) 2023 Aluguel de Roupas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@
Set-Content -Path "LICENSE" -Value $licenseContent

# Criar arquivo de seed inicial
$seedContent = @"
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeds...');

  // Limpar dados existentes
  await cleanDatabase();

  // Criar usuário administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    },
  });

  console.log('Usuário admin criado:', adminUser.email);

  // Criar usuário gerente
  const managerPassword = await bcrypt.hash('manager123', 10);
  const managerUser = await prisma.user.create({
    data: {
      email: 'gerente@example.com',
      password: managerPassword,
      role: 'MANAGER',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    },
  });

  console.log('Usuário gerente criado:', managerUser.email);

  // Criar usuário funcionário
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employeeUser = await prisma.user.create({
    data: {
      email: 'funcionario@example.com',
      password: employeePassword,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    },
  });

  console.log('Usuário funcionário criado:', employeeUser.email);

  // Criar funcionários
  const admin = await prisma.employee.create({
    data: {
      userId: adminUser.id,
      name: 'Administrador',
      cpf: '12345678900',
      phone: '11999999999',
      address: 'Rua Admin, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      position: 'Administrador',
      salary: 10000,
      hireDate: new Date('2020-01-01'),
      workingHours: '09:00-18:00',
    },
  });

  console.log('Funcionário administrador criado:', admin.name);

  const manager = await prisma.employee.create({
    data: {
      userId: managerUser.id,
      name: 'Gerente',
      cpf: '98765432100',
      phone: '11988888888',
      address: 'Rua Gerente, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      position: 'Gerente',
      salary: 7000,
      hireDate: new Date('2020-01-01'),
      workingHours: '09:00-18:00',
    },
  });

  console.log('Funcionário gerente criado:', manager.name);

  const employee = await prisma.employee.create({
    data: {
      userId: employeeUser.id,
      name: 'Funcionário',
      cpf: '11122233344',
      phone: '11977777777',
      address: 'Rua Funcionário, 789',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      position: 'Atendente',
      salary: 3000,
      hireDate: new Date('2021-01-01'),
      workingHours: '09:00-18:00',
    },
  });

  console.log('Funcionário atendente criado:', employee.name);

  // Criar categorias de produtos
  const categorias = [
    'Vestidos de Gala',
    'Vestidos de Noiva',
    'Ternos e Smokings',
    'Vestidos para Debutantes',
    'Vestidos para Madrinhas',
    'Fantasias',
  ];

  for (const nome of categorias) {
    await prisma.category.create({
      data: {
        name: nome,
        description: `Categoria para ${nome}`,
      },
    });
    console.log('Categoria criada:', nome);
  }

  // Buscar as categorias criadas
  const categoriasDB = await prisma.category.findMany();

  // Criar produtos em cada categoria
  const produtos = [
    {
      name: 'Vestido Longo Azul',
      categoryId: categoriasDB.find(c => c.name === 'Vestidos de Gala').id,
      code: 'VLA001',
      color: 'Azul',
      size: 'M',
      rentalPrice: 250,
      replacementCost: 1500,
      quantity: 3,
      description: 'Vestido longo azul marinho com detalhes em renda.',
    },
    {
      name: 'Smoking Preto Clássico',
      categoryId: categoriasDB.find(c => c.name === 'Ternos e Smokings').id,
      code: 'SPC001',
      color: 'Preto',
      size: '42',
      rentalPrice: 300,
      replacementCost: 2000,
      quantity: 5,
      description: 'Smoking preto clássico com lapela cetim.',
    },
    {
      name: 'Vestido de Noiva Princesa',
      categoryId: categoriasDB.find(c => c.name === 'Vestidos de Noiva').id,
      code: 'VNP001',
      color: 'Branco',
      size: '38',
      rentalPrice: 900,
      replacementCost: 5000,
      quantity: 2,
      description: 'Vestido de noiva estilo princesa com cauda longa.',
    },
    {
      name: 'Vestido Rosa para Debutante',
      categoryId: categoriasDB.find(c => c.name === 'Vestidos para Debutantes').id,
      code: 'VRD001',
      color: 'Rosa',
      size: '36',
      rentalPrice: 450,
      replacementCost: 2500,
      quantity: 2,
      description: 'Vestido rosa com saia volumosa para debutante.',
    },
  ];

  for (const produto of produtos) {
    await prisma.product.create({
      data: {
        ...produto,
        status: 'AVAILABLE',
      },
    });
    console.log('Produto criado:', produto.name);
  }

  // Criar locais
  const locais = [
    {
      name: 'Buffet Jardins',
      address: 'Rua dos Jardins, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      capacity: 300,
      type: 'Buffet',
      description: 'Buffet para eventos sociais e corporativos.',
    },
    {
      name: 'Espaço Verde',
      address: 'Avenida das Flores, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      capacity: 200,
      type: 'Chácara',
      description: 'Espaço ao ar livre para eventos.',
    },
    {
      name: 'Clube Náutico',
      address: 'Avenida da Praia, 789',
      city: 'Santos',
      state: 'SP',
      zipCode: '11000000',
      capacity: 500,
      type: 'Clube',
      description: 'Clube com vista para o mar.',
    },
  ];

  for (const local of locais) {
    await prisma.location.create({
      data: local,
    });
    console.log('Local criado:', local.name);
  }

  // Criar eventos
  const locaisDB = await prisma.location.findMany();
  const hoje = new Date();
  const eventos = [
    {
      name: 'Casamento Silva e Santos',
      date: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 15, 20, 0),
      category: 'Casamento',
      locationId: locaisDB.find(l => l.name === 'Buffet Jardins').id,
      capacity: 250,
      organizer: 'Cerimonial Elegance',
      description: 'Casamento formal com cerimônia religiosa.',
    },
    {
      name: 'Formatura Medicina USP',
      date: new Date(hoje.getFullYear(), hoje.getMonth() + 2, 10, 19, 0),
      category: 'Formatura',
      locationId: locaisDB.find(l => l.name === 'Clube Náutico').id,
      capacity: 400,
      organizer: 'Comissão de Formatura',
      description: 'Formatura da turma de Medicina da USP.',
    },
    {
      name: 'Festa de 15 Anos Laura',
      date: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 20, 21, 0),
      category: 'Debutante',
      locationId: locaisDB.find(l => l.name === 'Espaço Verde').id,
      capacity: 150,
      organizer: 'Família Oliveira',
      description: 'Festa de 15 anos com temática jardim encantado.',
    },
  ];

  for (const evento of eventos) {
    await prisma.event.create({
      data: evento,
    });
    console.log('Evento criado:', evento.name);
  }

  // Criar clientes de exemplo
  const clientes = [
    {
      name: 'João da Silva',
      documentType: 'CPF',
      documentNumber: '11122233344',
      birthDate: new Date('1985-05-15'),
      phone: '11999999999',
      email: 'joao.silva@example.com',
      instagram: '@joaosilva',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      bodyMeasurements: {
        bust: 100,
        waist: 80,
        hips: 100,
        height: 180,
      },
      loyaltyPoints: 0,
      preferences: 'Prefere cores escuras',
      observations: 'Cliente assíduo',
    },
    {
      name: 'Maria Oliveira',
      documentType: 'CPF',
      documentNumber: '22233344455',
      birthDate: new Date('1990-10-20'),
      phone: '11988888888',
      email: 'maria.oliveira@example.com',
      instagram: '@mariaoliveira',
      address: 'Avenida Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310000',
      bodyMeasurements: {
        bust: 90,
        waist: 70,
        hips: 95,
        height: 165,
      },
      loyaltyPoints: 0,
      preferences: 'Prefere vestidos longos',
      observations: 'Alérgica a tecidos sintéticos',
    },
  ];

  for (const cliente of clientes) {
    await prisma.customer.create({
      data: cliente,
    });
    console.log('Cliente criado:', cliente.name);
  }

  console.log('Seeds concluídos com sucesso!');
}

async function cleanDatabase() {
  // Limpar tabelas na ordem correta (respeitando chaves estrangeiras)
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.contractItem.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.event.deleteMany();
  await prisma.location.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('Banco de dados limpo com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.\$disconnect();
  });
"@
New-Item -Path "prisma" -ItemType Directory -Force
Set-Content -Path "prisma/seed.ts" -Value $seedContent

# Mensagem final
Write-Host @"

=====================================
Configuração do projeto finalizada!
=====================================

Seu projeto de Sistema de Gerenciamento para Loja de Aluguel de Roupas está configurado.

Para completar a configuração:
1. Verifique se o PostgreSQL está instalado e em execução
2. Crie um banco de dados chamado 'aluguel_roupas'
3. Execute os seguintes comandos:
   - npm install (instalar todas as dependências)
   - npx prisma generate (gerar o cliente Prisma)
   - npx prisma migrate dev --name init (criar as tabelas do banco de dados)
   - npm run seed (popular dados iniciais)
   - npm run start:dev (iniciar o servidor de desenvolvimento)

4. Acesse a documentação Swagger em: http://localhost:3000/api/docs

Credenciais de exemplo:
- Admin: admin@example.com / admin123
- Gerente: gerente@example.com / manager123
- Funcionário: funcionario@example.com / employee123

"@ -ForegroundColor Green