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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const category_service_1 = require("../../application/services/category.service");
const category_dto_1 = require("../../application/dtos/category.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async findAll() {
        return this.categoryService.findAll();
    }
    async getWithProductCount() {
        return this.categoryService.getWithProductCount();
    }
    async findOne(id) {
        return this.categoryService.findById(id);
    }
    async findByName(name) {
        return this.categoryService.findByName(name);
    }
    async create(createCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }
    async update(id, updateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }
    async remove(id) {
        await this.categoryService.delete(id);
        return;
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as categorias' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de categorias retornada com sucesso',
        type: [category_dto_1.CategoryDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('with-product-count'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar categorias com contagem de produtos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de categorias com contagem',
        type: [category_dto_1.CategoryWithProductCountDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getWithProductCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar categoria por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da categoria' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Categoria encontrada com sucesso',
        type: category_dto_1.CategoryDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar categoria por nome' }),
    (0, swagger_1.ApiParam)({ name: 'name', description: 'Nome da categoria' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Categoria encontrada com sucesso',
        type: category_dto_1.CategoryDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findByName", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova categoria' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Categoria criada com sucesso',
        type: category_dto_1.CategoryDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar categoria' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da categoria' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Categoria atualizada com sucesso',
        type: category_dto_1.CategoryDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir categoria' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da categoria' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Categoria excluída com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "remove", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('Categorias'),
    (0, common_1.Controller)('categories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map