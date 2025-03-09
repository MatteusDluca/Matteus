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
exports.MaintenanceLogRepository = void 0;
const common_1 = require("@nestjs/common");
const maintenance_log_entity_1 = require("../../domain/entities/maintenance-log.entity");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
let MaintenanceLogRepository = class MaintenanceLogRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const logs = await this.prisma.maintenanceLog.findMany({
            orderBy: { startDate: 'desc' },
        });
        return logs;
    }
    async findById(id) {
        const log = await this.prisma.maintenanceLog.findUnique({
            where: { id },
        });
        return log;
    }
    async findByProductId(productId) {
        const logs = await this.prisma.maintenanceLog.findMany({
            where: { productId },
            orderBy: { startDate: 'desc' },
        });
        return logs;
    }
    async findActiveByProductId(productId) {
        const logs = await this.prisma.maintenanceLog.findMany({
            where: {
                productId,
                status: {
                    in: [maintenance_log_entity_1.MaintenanceStatus.SCHEDULED, maintenance_log_entity_1.MaintenanceStatus.IN_PROGRESS],
                },
            },
            orderBy: { startDate: 'asc' },
        });
        return logs;
    }
    async findByStatus(status) {
        const logs = await this.prisma.maintenanceLog.findMany({
            where: { status },
            orderBy: { startDate: 'asc' },
        });
        return logs;
    }
    async create(data) {
        var _a;
        if (!data.productId || !data.description || !data.startDate || !data.status) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const cost = data.cost !== undefined ? new client_1.Prisma.Decimal(data.cost) : null;
        const log = await this.prisma.maintenanceLog.create({
            data: {
                productId: data.productId,
                description: data.description,
                cost: cost,
                startDate: data.startDate,
                endDate: (_a = data.endDate) !== null && _a !== void 0 ? _a : null,
                status: data.status,
            },
        });
        return log;
    }
    async update(id, data) {
        const updateData = Object.assign({}, data);
        if (data.cost !== undefined) {
            updateData.cost = new client_1.Prisma.Decimal(data.cost);
        }
        const log = await this.prisma.maintenanceLog.update({
            where: { id },
            data: updateData,
        });
        return log;
    }
    async completeMaintenanceLog(id, endDate) {
        const log = await this.prisma.maintenanceLog.update({
            where: { id },
            data: {
                endDate,
                status: maintenance_log_entity_1.MaintenanceStatus.COMPLETED,
            },
        });
        return log;
    }
    async delete(id) {
        await this.prisma.maintenanceLog.delete({
            where: { id },
        });
    }
};
exports.MaintenanceLogRepository = MaintenanceLogRepository;
exports.MaintenanceLogRepository = MaintenanceLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaintenanceLogRepository);
//# sourceMappingURL=maintenance-log.repository.js.map