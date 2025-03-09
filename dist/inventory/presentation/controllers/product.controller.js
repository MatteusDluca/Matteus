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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("../../application/services/product.service");
const product_dto_1 = require("../../application/dtos/product.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const product_entity_1 = require("../../domain/entities/product.entity");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async findAll() {
        return this.productService.findAll();
    }
    async findAvailable() {
        return this.productService.findAvailable();
    }
    async getMostRented(limit) {
        return this.productService.getMostRented(limit);
    }
    async searchProducts(query) {
        return this.productService.searchProducts(query);
    }
    async findByStatus(status) {
        return this.productService.findByStatus(status);
    }
    async findByCategoryId(categoryId) {
        return this.productService.findByCategoryId(categoryId);
    }
    async findOne(id) {
        return this.productService.findById(id);
    }
    async findByCode(code) {
        return this.productService.findByCode(code);
    }
    async create(createProductDto) {
        return this.productService.create(createProductDto);
    }
    async update(id, updateProductDto) {
        return this.productService.update(id, updateProductDto);
    }
    async updateStatus(id, status) {
        return this.productService.updateStatus(id, status);
    }
    async remove(id) {
        await this.productService.delete(id);
        return;
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os produtos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de produtos retornada com sucesso',
        type: [product_dto_1.ProductResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar produtos disponíveis para aluguel' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de produtos disponíveis',
        type: [product_dto_1.ProductResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAvailable", null);
__decorate([
    (0, common_1.Get)('most-rented'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar produtos mais alugados' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Número máximo de produtos (default: 10)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista dos produtos mais alugados',
        type: [product_dto_1.ProductResponseDto],
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getMostRented", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar produtos por termo' }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        required: true,
        type: String,
        description: 'Termo de busca (mínimo 3 caracteres)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Resultados da busca',
        type: [product_dto_1.ProductResponseDto],
    }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar produtos por status' }),
    (0, swagger_1.ApiParam)({
        name: 'status',
        enum: product_entity_1.ProductStatus,
        description: 'Status do produto',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de produtos filtrada por status',
        type: [product_dto_1.ProductResponseDto],
    }),
    __param(0, (0, common_1.Param)('status', new common_1.ParseEnumPipe(product_entity_1.ProductStatus))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar produtos por categoria' }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'ID da categoria' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de produtos por categoria',
        type: [product_dto_1.ProductResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findByCategoryId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar produto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do produto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Produto encontrado com sucesso',
        type: product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar produto por código' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'Código do produto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Produto encontrado com sucesso',
        type: product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo produto' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Produto criado com sucesso',
        type: product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar produto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do produto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Produto atualizado com sucesso',
        type: product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar status do produto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do produto' }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        enum: product_entity_1.ProductStatus,
        description: 'Novo status do produto',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Status atualizado com sucesso',
        type: product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status', new common_1.ParseEnumPipe(product_entity_1.ProductStatus))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir produto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do produto' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Produto excluído com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('Produtos'),
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map