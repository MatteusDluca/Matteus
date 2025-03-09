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
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const product_entity_1 = require("../../domain/entities/product.entity");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProductRepository = class ProductRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const products = await this.prisma.product.findMany({
            include: {
                category: true,
                images: true,
            },
            orderBy: { name: 'asc' },
        });
        return products;
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: true,
                maintenanceLogs: {
                    orderBy: { startDate: 'desc' },
                    take: 5,
                },
            },
        });
        return product;
    }
    async findByCode(code) {
        const product = await this.prisma.product.findUnique({
            where: { code },
            include: {
                category: true,
                images: true,
            },
        });
        return product;
    }
    async findByStatus(status) {
        const products = await this.prisma.product.findMany({
            where: { status },
            include: {
                category: true,
                images: true,
            },
            orderBy: { name: 'asc' },
        });
        return products;
    }
    async findByCategoryId(categoryId) {
        const products = await this.prisma.product.findMany({
            where: { categoryId },
            include: {
                category: true,
                images: true,
            },
            orderBy: { name: 'asc' },
        });
        return products;
    }
    async findAvailable() {
        const products = await this.prisma.product.findMany({
            where: {
                status: product_entity_1.ProductStatus.AVAILABLE,
                quantity: { gt: 0 },
            },
            include: {
                category: true,
                images: true,
            },
            orderBy: { name: 'asc' },
        });
        return products;
    }
    async create(data) {
        var _a, _b, _c, _d;
        if (!data.name ||
            !data.code ||
            !data.color ||
            !data.size ||
            !data.rentalPrice ||
            !data.quantity ||
            !data.categoryId) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const rentalPrice = new client_1.Prisma.Decimal(data.rentalPrice);
        const replacementCost = data.replacementCost !== undefined
            ? new client_1.Prisma.Decimal(data.replacementCost)
            : null;
        const product = await this.prisma.product.create({
            data: {
                name: data.name,
                code: data.code,
                color: data.color,
                size: data.size,
                rentalPrice: rentalPrice,
                replacementCost: replacementCost,
                quantity: data.quantity,
                status: (_a = data.status) !== null && _a !== void 0 ? _a : product_entity_1.ProductStatus.AVAILABLE,
                location: (_b = data.location) !== null && _b !== void 0 ? _b : null,
                description: (_c = data.description) !== null && _c !== void 0 ? _c : null,
                maintenanceInfo: (_d = data.maintenanceInfo) !== null && _d !== void 0 ? _d : null,
                categoryId: data.categoryId,
            },
            include: {
                category: true,
                images: true,
            },
        });
        return product;
    }
    async update(id, data) {
        const updateData = Object.assign({}, data);
        if (data.rentalPrice !== undefined) {
            updateData.rentalPrice = new client_1.Prisma.Decimal(data.rentalPrice);
        }
        if (data.replacementCost !== undefined) {
            updateData.replacementCost =
                data.replacementCost !== null
                    ? new client_1.Prisma.Decimal(data.replacementCost)
                    : null;
        }
        const product = await this.prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                images: true,
            },
        });
        return product;
    }
    async updateStatus(id, status) {
        const product = await this.prisma.product.update({
            where: { id },
            data: { status },
            include: {
                category: true,
                images: true,
            },
        });
        return product;
    }
    async delete(id) {
        await this.prisma.product.delete({
            where: { id },
        });
    }
    async searchProducts(query) {
        const products = await this.prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { code: { contains: query, mode: 'insensitive' } },
                    { color: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            include: {
                category: true,
                images: true,
            },
        });
        return products;
    }
    async getMostRented(limit) {
        const products = await this.prisma.product.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                images: true,
            },
        });
        return products;
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map