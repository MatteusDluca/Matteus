import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ChangePasswordDto, TokenResponseDto, TwoFactorResponseDto, TwoFactorAuthDto, EnableTwoFactorDto, VerifyTwoFactorDto } from '../../application/dtos/auth.dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, req: Request): Promise<import("../../domain/entities/user.entity").User>;
    login(loginDto: LoginDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyTwoFactorAuth(twoFactorAuthDto: TwoFactorAuthDto, req: Request): Promise<TokenResponseDto>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto, req: Request): Promise<{
        message: string;
    }>;
    generateTwoFactorSecret(userId: string): Promise<TwoFactorResponseDto>;
    enableTwoFactor(userId: string, enableTwoFactorDto: EnableTwoFactorDto, verifyTwoFactorDto?: VerifyTwoFactorDto): Promise<import("../../domain/entities/user.entity").User>;
}
