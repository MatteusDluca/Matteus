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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../../domain/entities/user.entity");
const base_service_1 = require("../../../shared/application/services/base.service");
const audit_log_service_1 = require("./audit-log.service");
let UserService = class UserService extends base_service_1.BaseService {
    constructor(userRepository, auditLogService) {
        super(userRepository);
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.userRepository.findAll();
    }
    async findByEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException(`Usuário com email ${email} não encontrado`);
        }
        return user;
    }
    async create(createUserDto, adminId, ipAddress, userAgent) {
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException(`Já existe um usuário com o email ${createUserDto.email}`);
        }
        const hashedPassword = await this.hashPassword(createUserDto.password);
        const user = await this.userRepository.create(Object.assign(Object.assign({}, createUserDto), { password: hashedPassword, failedLoginAttempts: 0 }));
        if (adminId) {
            await this.auditLogService.create({
                userId: adminId,
                action: 'USER_CREATE',
                resource: 'USER',
                details: `Criação de usuário: ${user.id} (${user.email})`,
                ipAddress,
                userAgent,
            });
        }
        return user;
    }
    async update(id, updateUserDto, adminId, ipAddress, userAgent) {
        await this.findById(id);
        if (updateUserDto.email) {
            const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
            if (existingUser && existingUser.id !== id) {
                throw new common_1.BadRequestException(`Já existe um usuário com o email ${updateUserDto.email}`);
            }
        }
        const updatedUser = await this.userRepository.update(id, updateUserDto);
        if (adminId) {
            await this.auditLogService.create({
                userId: adminId,
                action: 'USER_UPDATE',
                resource: 'USER',
                details: `Atualização de usuário: ${id} (${updatedUser.email})`,
                ipAddress,
                userAgent,
            });
        }
        return updatedUser;
    }
    async resetPassword(id, adminId, ipAddress, userAgent) {
        const user = await this.findById(id);
        const tempPassword = this.generateRandomPassword();
        const hashedPassword = await this.hashPassword(tempPassword);
        await this.userRepository.update(id, {
            password: hashedPassword,
            status: user_entity_1.UserStatus.TEMP_PASSWORD,
            failedLoginAttempts: 0,
        });
        await this.auditLogService.create({
            userId: adminId,
            action: 'PASSWORD_RESET',
            resource: 'USER',
            details: `Reset de senha para usuário: ${id} (${user.email})`,
            ipAddress,
            userAgent,
        });
        return { password: tempPassword };
    }
    async updateStatus(id, status, adminId, ipAddress, userAgent) {
        const user = await this.findById(id);
        const updatedUser = await this.userRepository.updateStatus(id, status);
        await this.auditLogService.create({
            userId: adminId,
            action: 'STATUS_CHANGE',
            resource: 'USER',
            details: `Alteração de status para usuário: ${id} (${user.email}) - Novo status: ${status}`,
            ipAddress,
            userAgent,
        });
        return updatedUser;
    }
    async delete(id, adminId, ipAddress, userAgent) {
        const user = await this.findById(id);
        await this.userRepository.delete(id);
        if (adminId) {
            await this.auditLogService.create({
                userId: adminId,
                action: 'USER_DELETE',
                resource: 'USER',
                details: `Exclusão de usuário: ${id} (${user.email})`,
                ipAddress,
                userAgent,
            });
        }
    }
    generateRandomPassword(length = 10) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, audit_log_service_1.AuditLogService])
], UserService);
//# sourceMappingURL=user.service.js.map