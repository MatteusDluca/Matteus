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
exports.PaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let PaymentRepository = class PaymentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToPayment(payment) {
        return Object.assign(Object.assign({}, payment), { amount: payment.amount ? Number(payment.amount.toString()) : 0 });
    }
    async findAll() {
        const payments = await this.prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((payment) => this.mapToPayment(payment));
    }
    async findById(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        return payment ? this.mapToPayment(payment) : null;
    }
    async findByContractId(contractId) {
        const payments = await this.prisma.payment.findMany({
            where: { contractId },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((payment) => this.mapToPayment(payment));
    }
    async findByStatus(status) {
        const payments = await this.prisma.payment.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((payment) => this.mapToPayment(payment));
    }
    async create(data) {
        const payment = await this.prisma.payment.create({
            data: {
                contractId: data.contractId,
                amount: data.amount,
                method: data.method,
                status: data.status || payment_entity_1.PaymentStatus.PENDING,
                installments: data.installments || 1,
                reference: data.reference,
                paidAt: data.paidAt,
                dueDate: data.dueDate,
            },
        });
        return this.mapToPayment(payment);
    }
    async update(id, data) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: data,
        });
        return this.mapToPayment(payment);
    }
    async updateStatus(id, status) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: { status },
        });
        return this.mapToPayment(payment);
    }
    async markAsPaid(id) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: payment_entity_1.PaymentStatus.PAID,
                paidAt: new Date(),
            },
        });
        return this.mapToPayment(payment);
    }
    async sumPaymentsByContractId(contractId) {
        const result = await this.prisma.payment.aggregate({
            where: {
                contractId,
                status: payment_entity_1.PaymentStatus.PAID,
            },
            _sum: {
                amount: true,
            },
        });
        return result._sum.amount ? Number(result._sum.amount.toString()) : 0;
    }
    async delete(id) {
        await this.prisma.payment.delete({
            where: { id },
        });
    }
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentRepository);
//# sourceMappingURL=payment.repository.js.map