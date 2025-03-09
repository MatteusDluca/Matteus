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
exports.ProductImageRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let ProductImageRepository = class ProductImageRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const images = await this.prisma.productImage.findMany();
        return images;
    }
    async findById(id) {
        const image = await this.prisma.productImage.findUnique({
            where: { id },
        });
        return image;
    }
    async findByProductId(productId) {
        const images = await this.prisma.productImage.findMany({
            where: { productId },
            orderBy: { isMain: 'desc' },
        });
        return images;
    }
    async findMainImage(productId) {
        const image = await this.prisma.productImage.findFirst({
            where: {
                productId,
                isMain: true,
            },
        });
        return image;
    }
    async create(data) {
        var _a;
        if (!data.url || !data.productId) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const imagesCount = await this.prisma.productImage.count({
            where: { productId: data.productId },
        });
        const image = await this.prisma.productImage.create({
            data: {
                url: data.url,
                isMain: (_a = data.isMain) !== null && _a !== void 0 ? _a : imagesCount === 0,
                productId: data.productId,
            },
        });
        return image;
    }
    async update(id, data) {
        const image = await this.prisma.productImage.update({
            where: { id },
            data: data,
        });
        return image;
    }
    async setMainImage(id) {
        const image = await this.prisma.productImage.findUnique({
            where: { id },
        });
        if (!image) {
            throw new Error('Imagem não encontrada');
        }
        await this.prisma.productImage.updateMany({
            where: { productId: image.productId },
            data: { isMain: false },
        });
        const updatedImage = await this.prisma.productImage.update({
            where: { id },
            data: { isMain: true },
        });
        return updatedImage;
    }
    async delete(id) {
        const image = await this.prisma.productImage.findUnique({
            where: { id },
        });
        if (!image) {
            throw new Error('Imagem não encontrada');
        }
        await this.prisma.productImage.delete({
            where: { id },
        });
        if (image.isMain) {
            const nextImage = await this.prisma.productImage.findFirst({
                where: { productId: image.productId },
            });
            if (nextImage) {
                await this.prisma.productImage.update({
                    where: { id: nextImage.id },
                    data: { isMain: true },
                });
            }
        }
    }
};
exports.ProductImageRepository = ProductImageRepository;
exports.ProductImageRepository = ProductImageRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductImageRepository);
//# sourceMappingURL=product-image.repository.js.map