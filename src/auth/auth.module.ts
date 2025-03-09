// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
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
    ConfigModule,
  ],
  controllers: [AuthController, UserController, AuditLogController],
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
  exports: [AuthService, UserService, AuditLogService],
})
export class AuthModule {}
