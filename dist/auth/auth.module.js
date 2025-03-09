"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_controller_1 = require("./presentation/controllers/auth.controller");
const user_controller_1 = require("./presentation/controllers/user.controller");
const audit_log_controller_1 = require("./presentation/controllers/audit-log.controller");
const auth_service_1 = require("./application/services/auth.service");
const user_service_1 = require("./application/services/user.service");
const audit_log_service_1 = require("./application/services/audit-log.service");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
const audit_log_repository_1 = require("./infrastructure/repositories/audit-log.repository");
const jwt_strategy_1 = require("./infrastructure/strategies/jwt.strategy");
const local_strategy_1 = require("./infrastructure/strategies/local.strategy");
const prisma_module_1 = require("../shared/infrastructure/prisma/prisma.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION', '1d'),
                    },
                }),
            }),
            config_1.ConfigModule,
        ],
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController, audit_log_controller_1.AuditLogController],
        providers: [
            auth_service_1.AuthService,
            user_service_1.UserService,
            audit_log_service_1.AuditLogService,
            jwt_strategy_1.JwtStrategy,
            local_strategy_1.LocalStrategy,
            {
                provide: 'IUserRepository',
                useClass: user_repository_1.UserRepository,
            },
            {
                provide: 'IAuditLogRepository',
                useClass: audit_log_repository_1.AuditLogRepository,
            },
        ],
        exports: [auth_service_1.AuthService, user_service_1.UserService, audit_log_service_1.AuditLogService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map