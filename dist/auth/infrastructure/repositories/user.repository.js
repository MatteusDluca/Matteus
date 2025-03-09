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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../domain/entities/user.entity");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            orderBy: { email: 'asc' },
        });
        return users;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user;
    }
    async create(data) {
        var _a, _b, _c, _d, _e;
        if (!data.email || !data.password || !data.role) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                role: data.role,
                status: (_a = data.status) !== null && _a !== void 0 ? _a : user_entity_1.UserStatus.ACTIVE,
                failedLoginAttempts: (_b = data.failedLoginAttempts) !== null && _b !== void 0 ? _b : 0,
                lastLoginAt: (_c = data.lastLoginAt) !== null && _c !== void 0 ? _c : null,
                twoFactorEnabled: (_d = data.twoFactorEnabled) !== null && _d !== void 0 ? _d : false,
                twoFactorSecret: (_e = data.twoFactorSecret) !== null && _e !== void 0 ? _e : null,
            },
        });
        return user;
    }
    async update(id, data) {
        const user = await this.prisma.user.update({
            where: { id },
            data: data,
        });
        return user;
    }
    async updatePassword(id, hashedPassword) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword,
                failedLoginAttempts: 0,
                status: user_entity_1.UserStatus.ACTIVE,
            },
        });
        return user;
    }
    async incrementFailedLoginAttempts(id) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                failedLoginAttempts: {
                    increment: 1,
                },
            },
        });
        return user;
    }
    async resetFailedLoginAttempts(id) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                failedLoginAttempts: 0,
            },
        });
        return user;
    }
    async updateLastLogin(id) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                lastLoginAt: new Date(),
            },
        });
        return user;
    }
    async updateStatus(id, status) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                status,
            },
        });
        return user;
    }
    async updateTwoFactorSecret(id, secret) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                twoFactorSecret: secret,
            },
        });
        return user;
    }
    async enableTwoFactor(id, enabled) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                twoFactorEnabled: enabled,
            },
        });
        return user;
    }
    async delete(id) {
        await this.prisma.user.delete({
            where: { id },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map