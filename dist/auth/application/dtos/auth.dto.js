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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorResponseDto = exports.TokenResponseDto = exports.VerifyTwoFactorDto = exports.EnableTwoFactorDto = exports.ForgotPasswordDto = exports.ResetPasswordDto = exports.ChangePasswordDto = exports.RefreshTokenDto = exports.TwoFactorAuthDto = exports.LoginDto = exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../domain/entities/user.entity");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email do usuário' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Senha do usuário (min. 8 caracteres)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Papel/função do usuário',
        enum: user_entity_1.Role,
        default: user_entity_1.Role.USER,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_entity_1.Role),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email do usuário' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Senha do usuário' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class TwoFactorAuthDto {
}
exports.TwoFactorAuthDto = TwoFactorAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email do usuário' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], TwoFactorAuthDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código de verificação de dois fatores' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TwoFactorAuthDto.prototype, "twoFactorCode", void 0);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Token de atualização' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Senha atual' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nova senha (min. 8 caracteres)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Token de reset de senha' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nova senha (min. 8 caracteres)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email do usuário' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class EnableTwoFactorDto {
}
exports.EnableTwoFactorDto = EnableTwoFactorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ativar/desativar autenticação de dois fatores' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnableTwoFactorDto.prototype, "enable", void 0);
class VerifyTwoFactorDto {
}
exports.VerifyTwoFactorDto = VerifyTwoFactorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código de verificação de dois fatores' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyTwoFactorDto.prototype, "twoFactorCode", void 0);
class TokenResponseDto {
}
exports.TokenResponseDto = TokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Token JWT de acesso' }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Token de atualização' }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data de expiração do token de acesso' }),
    __metadata("design:type", Date)
], TokenResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Papel/função do usuário', enum: user_entity_1.Role }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do usuário' }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "userId", void 0);
class TwoFactorResponseDto {
}
exports.TwoFactorResponseDto = TwoFactorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL QR code para configuração do 2FA' }),
    __metadata("design:type", String)
], TwoFactorResponseDto.prototype, "qrCodeUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Segredo para configuração manual' }),
    __metadata("design:type", String)
], TwoFactorResponseDto.prototype, "secret", void 0);
//# sourceMappingURL=auth.dto.js.map