// src/auth/application/services/auth.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { User, UserStatus, Role } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  TokenResponseDto,
  TwoFactorResponseDto,
  TwoFactorAuthDto,
} from '../dtos/auth.dto';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
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
  async login(
    loginDto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<TokenResponseDto | { twoFactorRequired: true }> {
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

      throw new UnauthorizedException(
        'Conta bloqueada devido a múltiplas tentativas de login malsucedidas. Entre em contato com o administrador.',
      );
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
  async verifyTwoFactorAuth(
    twoFactorAuthDto: TwoFactorAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<TokenResponseDto> {
    // Buscar o usuário pelo email
    const user = await this.userRepository.findByEmail(twoFactorAuthDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar se a autenticação de dois fatores está habilitada
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException(
        'Autenticação de dois fatores não habilitada para este usuário',
      );
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
      throw new BadRequestException(
        'Código de verificação necessário para ativar a autenticação de dois fatores',
      );
    }

    // Atualizar o status da autenticação de dois fatores
    return this.userRepository.enableTwoFactor(user.id, enable);
  }

  /**
   * Troca a senha do usuário
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
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
