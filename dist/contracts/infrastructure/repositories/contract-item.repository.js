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
exports.ContractItemRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
let ContractItemRepository = class ContractItemRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToContractItem(item) {
        return Object.assign(Object.assign({}, item), { updatedAt: item.updatedAt || new Date(), unitPrice: item.unitPrice ? Number(item.unitPrice.toString()) : 0, subtotal: item.subtotal ? Number(item.subtotal.toString()) : 0 });
    }
    async findAll() {
        const items = await this.prisma.contractItem.findMany({
            include: {
                product: true,
            },
        });
        return items.map((item) => this.mapToContractItem(item));
    }
    async findById(id) {
        const item = await this.prisma.contractItem.findUnique({
            where: { id },
            include: {
                product: true,
            },
        });
        return item ? this.mapToContractItem(item) : null;
    }
    async findByContractId(contractId) {
        const items = await this.prisma.contractItem.findMany({
            where: { contractId },
            include: {
                product: true,
            },
        });
        return items.map((item) => this.mapToContractItem(item));
    }
    async findByProductId(productId) {
        const items = await this.prisma.contractItem.findMany({
            where: { productId },
            include: {
                product: true,
            },
        });
        return items.map((item) => this.mapToContractItem(item));
    }
    async create(data) {
        if (!data.contractId || !data.productId || !data.quantity) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const unitPrice = data.unitPrice !== undefined
            ? new client_1.Prisma.Decimal(data.unitPrice)
            : undefined;
        const subtotal = data.quantity * (data.unitPrice || 0);
        const subtotalDecimal = new client_1.Prisma.Decimal(subtotal);
        const item = await this.prisma.contractItem.create({
            data: {
                contractId: data.contractId,
                productId: data.productId,
                quantity: data.quantity,
                unitPrice: unitPrice,
                subtotal: subtotalDecimal,
            },
            include: {
                product: true,
            },
        });
        return this.mapToContractItem(item);
    }
    async createBulk(items) {
        const createdItems = [];
        for (const item of items) {
            if (!item.contractId || !item.productId || !item.quantity) {
                throw new Error('Campos obrigatórios não podem ser undefined');
            }
            const unitPrice = item.unitPrice !== undefined
                ? new client_1.Prisma.Decimal(item.unitPrice)
                : undefined;
            const subtotal = item.quantity * (item.unitPrice || 0);
            const subtotalDecimal = new client_1.Prisma.Decimal(subtotal);
            const createdItem = await this.prisma.contractItem.create({
                data: {
                    contractId: item.contractId,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: unitPrice,
                    subtotal: subtotalDecimal,
                },
                include: {
                    product: true,
                },
            });
            createdItems.push(this.mapToContractItem(createdItem));
        }
        return createdItems;
    }
    async update(id, data) {
        const updateData = Object.assign({}, data);
        if (data.quantity !== undefined || data.unitPrice !== undefined) {
            const currentItem = await this.prisma.contractItem.findUnique({
                where: { id },
            });
            if (!currentItem) {
                throw new Error('Item não encontrado');
            }
            const quantity = data.quantity !== undefined ? data.quantity : currentItem.quantity;
            const unitPrice = data.unitPrice !== undefined
                ? new client_1.Prisma.Decimal(data.unitPrice)
                : currentItem.unitPrice;
            const unitPriceNum = typeof unitPrice === 'object' && 'toNumber' in unitPrice
                ? unitPrice.toNumber()
                : Number(unitPrice);
            const subtotal = quantity * unitPriceNum;
            updateData.subtotal = new client_1.Prisma.Decimal(subtotal);
            if (data.unitPrice !== undefined) {
                updateData.unitPrice = new client_1.Prisma.Decimal(data.unitPrice);
            }
        }
        const item = await this.prisma.contractItem.update({
            where: { id },
            data: updateData,
            include: {
                product: true,
            },
        });
        return this.mapToContractItem(item);
    }
    async updateQuantity(id, quantity) {
        const currentItem = await this.prisma.contractItem.findUnique({
            where: { id },
        });
        if (!currentItem) {
            throw new Error('Item não encontrado');
        }
        const unitPrice = typeof currentItem.unitPrice === 'object' && 'toNumber' in currentItem.unitPrice
            ? currentItem.unitPrice.toNumber()
            : Number(currentItem.unitPrice);
        const subtotal = quantity * unitPrice;
        const subtotalDecimal = new client_1.Prisma.Decimal(subtotal);
        const item = await this.prisma.contractItem.update({
            where: { id },
            data: {
                quantity,
                subtotal: subtotalDecimal,
            },
            include: {
                product: true,
            },
        });
        return this.mapToContractItem(item);
    }
    async delete(id) {
        await this.prisma.contractItem.delete({
            where: { id },
        });
    }
    async deleteByContractId(contractId) {
        await this.prisma.contractItem.deleteMany({
            where: { contractId },
        });
    }
};
exports.ContractItemRepository = ContractItemRepository;
exports.ContractItemRepository = ContractItemRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractItemRepository);
//# sourceMappingURL=contract-item.repository.js.map