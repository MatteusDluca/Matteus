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
exports.ContractRepository = void 0;
const common_1 = require("@nestjs/common");
const contract_entity_1 = require("../../domain/entities/contract.entity");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
let ContractRepository = class ContractRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const contracts = await this.prisma.contract.findMany({
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return contracts;
    }
    async findById(id) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
        });
        return contract;
    }
    async findByContractNumber(contractNumber) {
        const contract = await this.prisma.contract.findUnique({
            where: { contractNumber },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
        });
        return contract;
    }
    async findByCustomerId(customerId) {
        const contracts = await this.prisma.contract.findMany({
            where: { customerId },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return contracts;
    }
    async findByEmployeeId(employeeId) {
        const contracts = await this.prisma.contract.findMany({
            where: { employeeId },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return contracts;
    }
    async findByEventId(eventId) {
        const contracts = await this.prisma.contract.findMany({
            where: { eventId },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return contracts;
    }
    async findByStatus(status) {
        const contracts = await this.prisma.contract.findMany({
            where: { status },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return contracts;
    }
    async findLateContracts() {
        const today = new Date();
        const contracts = await this.prisma.contract.findMany({
            where: {
                returnDate: { lt: today },
                status: {
                    in: [contract_entity_1.ContractStatus.PICKED_UP, contract_entity_1.ContractStatus.PAID],
                },
            },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: { returnDate: 'asc' },
        });
        return contracts;
    }
    async findByDateRange(startDate, endDate, field) {
        const contracts = await this.prisma.contract.findMany({
            where: {
                [field]: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: { [field]: 'asc' },
        });
        return contracts;
    }
    async create(data) {
        if (!data.customerId ||
            !data.employeeId ||
            !data.contractNumber ||
            !data.pickupDate ||
            !data.returnDate) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const totalAmount = data.totalAmount !== undefined
            ? new client_1.Prisma.Decimal(data.totalAmount)
            : undefined;
        const depositAmount = data.depositAmount !== undefined
            ? new client_1.Prisma.Decimal(data.depositAmount)
            : undefined;
        const contract = await this.prisma.contract.create({
            data: {
                customerId: data.customerId,
                employeeId: data.employeeId,
                eventId: data.eventId || null,
                contractNumber: data.contractNumber,
                fittingDate: data.fittingDate || null,
                pickupDate: data.pickupDate,
                returnDate: data.returnDate,
                status: data.status || contract_entity_1.ContractStatus.DRAFT,
                totalAmount: totalAmount,
                depositAmount: depositAmount,
                specialConditions: data.specialConditions || null,
                observations: data.observations || null,
            },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: true,
                payments: true,
            },
        });
        return contract;
    }
    async update(id, data) {
        const updateData = Object.assign({}, data);
        if (data.totalAmount !== undefined) {
            updateData.totalAmount = new client_1.Prisma.Decimal(data.totalAmount);
        }
        if (data.depositAmount !== undefined) {
            updateData.depositAmount =
                data.depositAmount !== null
                    ? new client_1.Prisma.Decimal(data.depositAmount)
                    : null;
        }
        const contract = await this.prisma.contract.update({
            where: { id },
            data: updateData,
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
        });
        return contract;
    }
    async updateStatus(id, status) {
        const contract = await this.prisma.contract.update({
            where: { id },
            data: { status },
            include: {
                customer: true,
                employee: true,
                event: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
        });
        return contract;
    }
    async calculateTotalAmount(id) {
        const items = await this.prisma.contractItem.findMany({
            where: { contractId: id },
        });
        return items.reduce((total, item) => {
            const subtotal = typeof item.subtotal === 'object' && 'toNumber' in item.subtotal
                ? item.subtotal.toNumber()
                : Number(item.subtotal);
            return total + subtotal;
        }, 0);
    }
    async countContractsByMonthYear() {
        const result = await this.prisma.$queryRaw `
      SELECT 
        EXTRACT(MONTH FROM "createdAt")::integer as month, 
        EXTRACT(YEAR FROM "createdAt")::integer as year,
        COUNT(*)::integer as count
      FROM "Contract"
      GROUP BY month, year
      ORDER BY year, month
    `;
        return result;
    }
    async sumContractValuesByMonthYear() {
        const result = await this.prisma.$queryRaw `
      SELECT 
        EXTRACT(MONTH FROM "createdAt")::integer as month, 
        EXTRACT(YEAR FROM "createdAt")::integer as year,
        SUM("totalAmount")::float as total
      FROM "Contract"
      WHERE "status" NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY month, year
      ORDER BY year, month
    `;
        return result;
    }
    async delete(id) {
        await this.prisma.contractItem.deleteMany({
            where: { contractId: id },
        });
        await this.prisma.payment.deleteMany({
            where: { contractId: id },
        });
        await this.prisma.contract.delete({
            where: { id },
        });
    }
};
exports.ContractRepository = ContractRepository;
exports.ContractRepository = ContractRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractRepository);
//# sourceMappingURL=contract.repository.js.map