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
exports.CustomerRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let CustomerRepository = class CustomerRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const customers = await this.prisma.customer.findMany({
            orderBy: { name: 'asc' },
        });
        return customers;
    }
    async findById(id) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
        });
        return customer;
    }
    async findByDocument(documentNumber) {
        const customer = await this.prisma.customer.findUnique({
            where: { documentNumber },
        });
        return customer;
    }
    async findByEmail(email) {
        const customer = await this.prisma.customer.findFirst({
            where: { email },
        });
        return customer;
    }
    async findByUserId(userId) {
        const customer = await this.prisma.customer.findUnique({
            where: { userId },
        });
        return customer;
    }
    async findTopCustomers(limit) {
        const customers = await this.prisma.customer.findMany({
            orderBy: { loyaltyPoints: 'desc' },
            take: limit,
        });
        return customers;
    }
    async findBirthdaysInMonth(month) {
        const customers = await this.prisma.$queryRaw `
      SELECT * FROM "Customer"
      WHERE EXTRACT(MONTH FROM "birthDate") = ${month}
      ORDER BY EXTRACT(DAY FROM "birthDate") ASC
    `;
        return customers;
    }
    async create(data) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!data.name ||
            !data.documentType ||
            !data.documentNumber ||
            !data.phone ||
            !data.email ||
            !data.address ||
            !data.city ||
            !data.state ||
            !data.zipCode) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const loyaltyPoints = (_a = data.loyaltyPoints) !== null && _a !== void 0 ? _a : 0;
        const customer = await this.prisma.customer.create({
            data: {
                name: data.name,
                documentType: data.documentType,
                documentNumber: data.documentNumber,
                birthDate: (_b = data.birthDate) !== null && _b !== void 0 ? _b : null,
                phone: data.phone,
                email: data.email,
                instagram: (_c = data.instagram) !== null && _c !== void 0 ? _c : null,
                address: data.address,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                bodyMeasurements: (_d = data.bodyMeasurements) !== null && _d !== void 0 ? _d : null,
                loyaltyPoints: loyaltyPoints,
                preferences: (_e = data.preferences) !== null && _e !== void 0 ? _e : null,
                observations: (_f = data.observations) !== null && _f !== void 0 ? _f : null,
                userId: (_g = data.userId) !== null && _g !== void 0 ? _g : null,
            },
        });
        return customer;
    }
    async update(id, data) {
        const customer = await this.prisma.customer.update({
            where: { id },
            data: data,
        });
        return customer;
    }
    async updateLoyaltyPoints(id, points) {
        const customer = await this.prisma.customer.update({
            where: { id },
            data: {
                loyaltyPoints: {
                    increment: points,
                },
            },
        });
        return customer;
    }
    async delete(id) {
        await this.prisma.customer.delete({
            where: { id },
        });
    }
};
exports.CustomerRepository = CustomerRepository;
exports.CustomerRepository = CustomerRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerRepository);
//# sourceMappingURL=customer.repository.js.map