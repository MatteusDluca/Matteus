import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterDto, LoginDto, ChangePasswordDto, TokenResponseDto, TwoFactorResponseDto, TwoFactorAuthDto } from '../dtos/auth.dto';
import { AuditLogService } from './audit-log.service';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly auditLogService;
    constructor(userRepository: IUserRepository, jwtService: JwtService, configService: ConfigService, auditLogService: AuditLogService);
    register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<User>;
    login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<TokenResponseDto | {
        twoFactorRequired: true;
    }>;
    verifyTwoFactorAuth(twoFactorAuthDto: TwoFactorAuthDto, ipAddress?: string, userAgent?: string): Promise<TokenResponseDto>;
    generateTwoFactorSecret(userId: string): Promise<TwoFactorResponseDto>;
    enableTwoFactor(userId: string, enable: boolean, code?: string): Promise<User>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto, ipAddress?: string, userAgent?: string): Promise<void>;
    refreshTokens(refreshToken: string): Promise<TokenResponseDto>;
    private incrementFailedLoginAttempts;
    private generateTokens;
    private calculateExpirationDate;
    private hashPassword;
    private comparePasswords;
}
