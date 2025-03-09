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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
let ProductImageService = class ProductImageService extends base_service_1.BaseService {
    constructor(productImageRepository, productRepository) {
        super(productImageRepository);
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
    }
    async findAll() {
        return this.productImageRepository.findAll();
    }
    async findByProductId(productId) {
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new common_1.NotFoundException(`Produto com ID ${productId} não encontrado`);
        }
        return this.productImageRepository.findByProductId(productId);
    }
    async findMainImage(productId) {
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new common_1.NotFoundException(`Produto com ID ${productId} não encontrado`);
        }
        return this.productImageRepository.findMainImage(productId);
    }
    async create(createProductImageDto) {
        const productExists = await this.productRepository.findById(createProductImageDto.productId);
        if (!productExists) {
            throw new common_1.NotFoundException(`Produto com ID ${productExists} não encontrado`);
        }
        return this.productImageRepository.create(createProductImageDto);
    }
    async update(id, updateProductImageDto) {
        await this.findById(id);
        return this.productImageRepository.update(id, updateProductImageDto);
    }
    async setMainImage(id) {
        await this.findById(id);
        return this.productImageRepository.setMainImage(id);
    }
    async delete(id) {
        await this.findById(id);
        return this.productImageRepository.delete(id);
    }
};
exports.ProductImageService = ProductImageService;
exports.ProductImageService = ProductImageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IProductImageRepository')),
    __param(1, (0, common_1.Inject)('IProductRepository')),
    __metadata("design:paramtypes", [Object, Object])
], ProductImageService);
//# sourceMappingURL=product-image.service.js.map