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
exports.AuditLogRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let AuditLogRepository = class AuditLogRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const logs = await this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return logs;
    }
    async findById(id) {
        const log = await this.prisma.auditLog.findUnique({
            where: { id },
        });
        return log;
    }
    async findByUserId(userId) {
        const logs = await this.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return logs;
    }
    async findByResource(resource) {
        const logs = await this.prisma.auditLog.findMany({
            where: { resource },
            orderBy: { createdAt: 'desc' },
        });
        return logs;
    }
    async findByAction(action) {
        const logs = await this.prisma.auditLog.findMany({
            where: { action },
            orderBy: { createdAt: 'desc' },
        });
        return logs;
    }
    async findByDateRange(startDate, endDate) {
        const logs = await this.prisma.auditLog.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return logs;
    }
    async create(data) {
        var _a, _b, _c;
        if (!data.userId || !data.action || !data.resource) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const log = await this.prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                resource: data.resource,
                details: (_a = data.details) !== null && _a !== void 0 ? _a : null,
                ipAddress: (_b = data.ipAddress) !== null && _b !== void 0 ? _b : null,
                userAgent: (_c = data.userAgent) !== null && _c !== void 0 ? _c : null,
            },
        });
        return log;
    }
    async update(id, data) {
        const log = await this.prisma.auditLog.update({
            where: { id },
            data: data,
        });
        return log;
    }
    async delete(id) {
        await this.prisma.auditLog.delete({
            where: { id },
        });
    }
};
exports.AuditLogRepository = AuditLogRepository;
exports.AuditLogRepository = AuditLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogRepository);
//# sourceMappingURL=audit-log.repository.js.map