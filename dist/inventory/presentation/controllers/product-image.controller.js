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
exports.ProductImageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_image_service_1 = require("../../application/services/product-image.service");
const product_image_dto_1 = require("../../application/dtos/product-image.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let ProductImageController = class ProductImageController {
    constructor(productImageService) {
        this.productImageService = productImageService;
    }
    async findByProductId(productId) {
        return this.productImageService.findByProductId(productId);
    }
    async findMainImage(productId) {
        return this.productImageService.findMainImage(productId);
    }
    async findOne(id) {
        return this.productImageService.findById(id);
    }
    async create(createProductImageDto) {
        return this.productImageService.create(createProductImageDto);
    }
    async update(id, updateProductImageDto) {
        return this.productImageService.update(id, updateProductImageDto);
    }
    async setMainImage(id) {
        return this.productImageService.setMainImage(id);
    }
    async remove(id) {
        await this.productImageService.delete(id);
        return;
    }
};
exports.ProductImageController = ProductImageController;
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar imagens de um produto' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID do produto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de imagens do produto',
        type: [product_image_dto_1.ProductImageResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductImageController.prototype, "findByProductId", null);
__decorate([
    (0, common_1.Get)('product/:productId/main'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Obter imagem principal de um produto' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID do produto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Imagem principal do produto',
        type: product_image_dto_1.ProductImageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Produto não encontrado ou sem imagem principal',
    }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductImageController.prototype, "findMainImage", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar imagem por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da imagem' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Imagem encontrada com sucesso',
        type: product_image_dto_1.ProductImageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imagem não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductImageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar nova imagem a um produto' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Imagem adicionada com sucesso',
        type: product_image_dto_1.ProductImageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_image_dto_1.CreateProductImageDto]),
    __metadata("design:returntype", Promise)
], ProductImageController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar imagem' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da imagem' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Imagem atualizada com sucesso',
        type: product_image_dto_1.ProductImageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imagem não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_image_dto_1.UpdateProductImageDto]),
    __metadata("design:returntype", Promise)
], ProductImageController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/set-main'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Definir imagem como principal' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da imagem' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Imagem definida como principal',
        type: product_image_dto_1.ProductImageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imagem não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductImageController.prototype, "setMainImage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir imagem' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da imagem' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Imagem excluída com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imagem não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductImageController.prototype, "remove", null);
exports.ProductImageController = ProductImageController = __decorate([
    (0, swagger_1.ApiTags)('Imagens de Produtos'),
    (0, common_1.Controller)('product-images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [product_image_service_1.ProductImageService])
], ProductImageController);
//# sourceMappingURL=product-image.controller.js.map