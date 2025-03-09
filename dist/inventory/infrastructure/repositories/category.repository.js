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
exports.CategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let CategoryRepository = class CategoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        return categories;
    }
    async findById(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
        return category;
    }
    async findByName(name) {
        const category = await this.prisma.category.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
        });
        return category;
    }
    async getWithProductCount() {
        const categories = await this.prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            productCount: category._count.products,
        }));
    }
    async create(data) {
        var _a;
        if (!data.name) {
            throw new Error('O nome da categoria é obrigatório');
        }
        const category = await this.prisma.category.create({
            data: {
                name: data.name,
                description: (_a = data.description) !== null && _a !== void 0 ? _a : null,
            },
        });
        return category;
    }
    async update(id, data) {
        const category = await this.prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
            },
        });
        return category;
    }
    async delete(id) {
        await this.prisma.category.delete({
            where: { id },
        });
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryRepository);
//# sourceMappingURL=category.repository.js.map