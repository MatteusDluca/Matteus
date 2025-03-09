import { Role } from '../../domain/entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    role?: Role;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class TwoFactorAuthDto {
    email: string;
    twoFactorCode: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class EnableTwoFactorDto {
    enable: boolean;
}
export declare class VerifyTwoFactorDto {
    twoFactorCode: string;
}
export declare class TokenResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    role: Role;
    userId?: string;
}
export declare class TwoFactorResponseDto {
    qrCodeUrl: string;
    secret: string;
}
