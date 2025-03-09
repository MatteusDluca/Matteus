"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../../application/services/auth.service");
const auth_dto_1 = require("../../application/dtos/auth.dto");
const user_dto_1 = require("../../application/dtos/user.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const user_decorator_1 = require("../decorators/user.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto, req) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return this.authService.register(registerDto, ipAddress, userAgent);
    }
    async login(loginDto, req, res) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        const result = await this.authService.login(loginDto, ipAddress, userAgent);
        if ('twoFactorRequired' in result) {
            return res.status(common_1.HttpStatus.OK).json({
                twoFactorRequired: true,
                message: 'Autenticação de dois fatores necessária',
            });
        }
        return res.status(common_1.HttpStatus.OK).json(result);
    }
    async verifyTwoFactorAuth(twoFactorAuthDto, req) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return this.authService.verifyTwoFactorAuth(twoFactorAuthDto, ipAddress, userAgent);
    }
    async refreshTokens(refreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }
    async changePassword(userId, changePasswordDto, req) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        await this.authService.changePassword(userId, changePasswordDto, ipAddress, userAgent);
        return { message: 'Senha alterada com sucesso' };
    }
    async generateTwoFactorSecret(userId) {
        return this.authService.generateTwoFactorSecret(userId);
    }
    async enableTwoFactor(userId, enableTwoFactorDto, verifyTwoFactorDto) {
        return this.authService.enableTwoFactor(userId, enableTwoFactorDto.enable, enableTwoFactorDto.enable ? verifyTwoFactorDto === null || verifyTwoFactorDto === void 0 ? void 0 : verifyTwoFactorDto.twoFactorCode : undefined);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar novo usuário' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuário registrado com sucesso',
        type: user_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dados inválidos ou email já em uso',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Realizar login' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login bem-sucedido',
        type: auth_dto_1.TokenResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciais inválidas' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('2fa/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar código de autenticação de dois fatores' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Autenticação bem-sucedida',
        type: auth_dto_1.TokenResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Código inválido' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.TwoFactorAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTwoFactorAuth", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar tokens com refresh token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tokens atualizados com sucesso',
        type: auth_dto_1.TokenResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token inválido ou expirado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Alterar senha do usuário' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Senha alterada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Senha atual incorreta' }),
    __param(0, (0, user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('2fa/generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar segredo para autenticação de dois fatores' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Segredo gerado com sucesso',
        type: auth_dto_1.TwoFactorResponseDto,
    }),
    __param(0, (0, user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateTwoFactorSecret", null);
__decorate([
    (0, common_1.Post)('2fa/enable'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Ativar/desativar autenticação de dois fatores' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuração atualizada com sucesso',
        type: user_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Configuração inválida' }),
    __param(0, (0, user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_dto_1.EnableTwoFactorDto,
        auth_dto_1.VerifyTwoFactorDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableTwoFactor", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Autenticação'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map