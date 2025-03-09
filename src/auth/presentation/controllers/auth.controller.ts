// src/auth/presentation/controllers/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ChangePasswordDto,
  TokenResponseDto,
  TwoFactorResponseDto,
  TwoFactorAuthDto,
  EnableTwoFactorDto,
  VerifyTwoFactorDto,
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
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já em uso',
  })
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    return this.authService.register(registerDto, ipAddress, userAgent);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido',
    type: TokenResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Autenticação bem-sucedida',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Código inválido' })
  async verifyTwoFactorAuth(@Body() twoFactorAuthDto: TwoFactorAuthDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    return this.authService.verifyTwoFactorAuth(twoFactorAuthDto, ipAddress, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar tokens com refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens atualizados com sucesso',
    type: TokenResponseDto,
  })
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
    @Req() req: Request,
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
  @ApiResponse({
    status: 200,
    description: 'Segredo gerado com sucesso',
    type: TwoFactorResponseDto,
  })
  async generateTwoFactorSecret(@CurrentUser('id') userId: string) {
    return this.authService.generateTwoFactorSecret(userId);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ativar/desativar autenticação de dois fatores' })
  @ApiResponse({
    status: 200,
    description: 'Configuração atualizada com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Configuração inválida' })
  async enableTwoFactor(
    @CurrentUser('id') userId: string,
    @Body() enableTwoFactorDto: EnableTwoFactorDto,
    @Body() verifyTwoFactorDto?: VerifyTwoFactorDto,
  ) {
    return this.authService.enableTwoFactor(
      userId,
      enableTwoFactorDto.enable,
      enableTwoFactorDto.enable ? verifyTwoFactorDto?.twoFactorCode : undefined,
    );
  }
}
