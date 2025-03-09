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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
let ProductService = class ProductService extends base_service_1.BaseService {
    constructor(productRepository, categoryRepository) {
        super(productRepository);
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }
    async findAll() {
        return this.productRepository.findAll();
    }
    async findByCode(code) {
        const product = await this.productRepository.findByCode(code);
        if (!product) {
            throw new common_1.NotFoundException(`Produto com código ${code} não encontrado`);
        }
        return product;
    }
    async findByStatus(status) {
        return this.productRepository.findByStatus(status);
    }
    async findByCategoryId(categoryId) {
        const categoryExists = await this.categoryRepository.findById(categoryId);
        if (!categoryExists) {
            throw new common_1.NotFoundException(`Categoria com ID ${categoryId} não encontrada`);
        }
        return this.productRepository.findByCategoryId(categoryId);
    }
    async findAvailable() {
        return this.productRepository.findAvailable();
    }
    async create(createProductDto) {
        const existingProduct = await this.productRepository.findByCode(createProductDto.code);
        if (existingProduct) {
            throw new common_1.BadRequestException(`Já existe um produto com o código ${createProductDto.code}`);
        }
        const categoryExists = await this.categoryRepository.findById(createProductDto.categoryId);
        if (!categoryExists) {
            throw new common_1.NotFoundException(`Categoria com ID ${createProductDto.categoryId} não encontrada`);
        }
        return this.productRepository.create(createProductDto);
    }
    async update(id, updateProductDto) {
        await this.findById(id);
        if (updateProductDto.categoryId) {
            const categoryExists = await this.categoryRepository.findById(updateProductDto.categoryId);
            if (!categoryExists) {
                throw new common_1.NotFoundException(`Categoria com ID ${updateProductDto.categoryId} não encontrada`);
            }
        }
        return this.productRepository.update(id, updateProductDto);
    }
    async updateStatus(id, status) {
        await this.findById(id);
        return this.productRepository.updateStatus(id, status);
    }
    async searchProducts(query) {
        if (!query || query.trim().length < 3) {
            throw new common_1.BadRequestException('O termo de busca deve ter pelo menos 3 caracteres');
        }
        return this.productRepository.searchProducts(query.trim());
    }
    async getMostRented(limit = 10) {
        return this.productRepository.getMostRented(limit);
    }
    async delete(id) {
        await this.findById(id);
        return this.productRepository.delete(id);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IProductRepository')),
    __param(1, (0, common_1.Inject)('ICategoryRepository')),
    __metadata("design:paramtypes", [Object, Object])
], ProductService);
//# sourceMappingURL=product.service.js.map