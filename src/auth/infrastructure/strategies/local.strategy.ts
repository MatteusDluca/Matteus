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
