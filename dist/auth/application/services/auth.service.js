"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const user_entity_1 = require("../../domain/entities/user.entity");
const audit_log_service_1 = require("./audit-log.service");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, configService, auditLogService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.auditLogService = auditLogService;
    }
    async register(registerDto, ipAddress, userAgent) {
        const existingUser = await this.userRepository.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Este email já está em uso');
        }
        const hashedPassword = await this.hashPassword(registerDto.password);
        const user = await this.userRepository.create({
            email: registerDto.email,
            password: hashedPassword,
            role: registerDto.role || user_entity_1.Role.USER,
            status: user_entity_1.UserStatus.ACTIVE,
            failedLoginAttempts: 0,
            twoFactorEnabled: false,
        });
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
    async login(loginDto, ipAddress, userAgent) {
        const user = await this.userRepository.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (user.status === user_entity_1.UserStatus.BLOCKED) {
            await this.auditLogService.create({
                userId: user.id,
                action: 'LOGIN_FAILED',
                resource: 'AUTH',
                details: 'Tentativa de login em conta bloqueada',
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Conta bloqueada devido a múltiplas tentativas de login malsucedidas. Entre em contato com o administrador.');
        }
        if (user.status === user_entity_1.UserStatus.INACTIVE) {
            throw new common_1.UnauthorizedException('Conta inativa. Entre em contato com o administrador.');
        }
        const isPasswordValid = await this.comparePasswords(loginDto.password, user.password);
        if (!isPasswordValid) {
            await this.incrementFailedLoginAttempts(user);
            await this.auditLogService.create({
                userId: user.id,
                action: 'LOGIN_FAILED',
                resource: 'AUTH',
                details: 'Senha inválida',
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        await this.userRepository.resetFailedLoginAttempts(user.id);
        if (user.status === user_entity_1.UserStatus.TEMP_PASSWORD) {
            await this.auditLogService.create({
                userId: user.id,
                action: 'LOGIN_TEMP_PASSWORD',
                resource: 'AUTH',
                details: 'Login com senha temporária',
                ipAddress,
                userAgent,
            });
            throw new common_1.BadRequestException('É necessário alterar a senha temporária antes de continuar');
        }
        if (user.twoFactorEnabled) {
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
        await this.userRepository.updateLastLogin(user.id);
        const tokens = await this.generateTokens(user);
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
    async verifyTwoFactorAuth(twoFactorAuthDto, ipAddress, userAgent) {
        const user = await this.userRepository.findByEmail(twoFactorAuthDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (!user.twoFactorEnabled || !user.twoFactorSecret) {
            throw new common_1.BadRequestException('Autenticação de dois fatores não habilitada para este usuário');
        }
        const isCodeValid = otplib_1.authenticator.verify({
            token: twoFactorAuthDto.twoFactorCode,
            secret: user.twoFactorSecret,
        });
        if (!isCodeValid) {
            await this.incrementFailedLoginAttempts(user);
            await this.auditLogService.create({
                userId: user.id,
                action: 'LOGIN_2FA_FAILED',
                resource: 'AUTH',
                details: 'Código de 2FA inválido',
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Código de autenticação inválido');
        }
        await this.userRepository.resetFailedLoginAttempts(user.id);
        await this.userRepository.updateLastLogin(user.id);
        const tokens = await this.generateTokens(user);
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
    async generateTwoFactorSecret(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const secret = otplib_1.authenticator.generateSecret();
        await this.userRepository.updateTwoFactorSecret(user.id, secret);
        const otpauth = otplib_1.authenticator.keyuri(user.email, 'AluguelRoupasSistema', secret);
        const qrCodeUrl = await (0, qrcode_1.toDataURL)(otpauth);
        return {
            qrCodeUrl,
            secret,
        };
    }
    async enableTwoFactor(userId, enable, code) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        if (enable && code) {
            if (!user.twoFactorSecret) {
                throw new common_1.BadRequestException('Configure a autenticação de dois fatores primeiro');
            }
            const isCodeValid = otplib_1.authenticator.verify({
                token: code,
                secret: user.twoFactorSecret,
            });
            if (!isCodeValid) {
                throw new common_1.UnauthorizedException('Código de verificação inválido');
            }
        }
        else if (enable && !code) {
            throw new common_1.BadRequestException('Código de verificação necessário para ativar a autenticação de dois fatores');
        }
        return this.userRepository.enableTwoFactor(user.id, enable);
    }
    async changePassword(userId, changePasswordDto, ipAddress, userAgent) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const isCurrentPasswordValid = await this.comparePasswords(changePasswordDto.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Senha atual incorreta');
        }
        const hashedPassword = await this.hashPassword(changePasswordDto.newPassword);
        await this.userRepository.updatePassword(user.id, hashedPassword);
        if (user.status === user_entity_1.UserStatus.TEMP_PASSWORD) {
            await this.userRepository.updateStatus(user.id, user_entity_1.UserStatus.ACTIVE);
        }
        await this.auditLogService.create({
            userId: user.id,
            action: 'PASSWORD_CHANGE',
            resource: 'USER',
            details: 'Alteração de senha pelo usuário',
            ipAddress,
            userAgent,
        });
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            });
            const user = await this.userRepository.findById(payload.sub);
            if (!user || user.status !== user_entity_1.UserStatus.ACTIVE) {
                throw new common_1.UnauthorizedException('Token inválido');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token inválido ou expirado');
        }
    }
    async incrementFailedLoginAttempts(user) {
        const updatedUser = await this.userRepository.incrementFailedLoginAttempts(user.id);
        if (updatedUser.failedLoginAttempts >= 5) {
            await this.userRepository.updateStatus(user.id, user_entity_1.UserStatus.BLOCKED);
        }
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION', '1d'),
        });
        const refreshToken = this.jwtService.sign({ sub: user.id }, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION', '7d'),
        });
        const expiresIn = this.configService.get('JWT_EXPIRATION', '1d');
        const expiresAt = this.calculateExpirationDate(expiresIn);
        return {
            accessToken,
            refreshToken,
            expiresAt,
            role: user.role,
            userId: user.id,
        };
    }
    calculateExpirationDate(expiresIn) {
        const now = new Date();
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1), 10);
        switch (unit) {
            case 'd':
                return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
            case 'h':
                return new Date(now.getTime() + value * 60 * 60 * 1000);
            case 'm':
                return new Date(now.getTime() + value * 60 * 1000);
            case 's':
                return new Date(now.getTime() + value * 1000);
            default:
                return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        }
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        config_1.ConfigService,
        audit_log_service_1.AuditLogService])
], AuthService);
//# sourceMappingURL=auth.service.js.map