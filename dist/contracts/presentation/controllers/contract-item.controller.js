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
exports.ContractItemController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contract_item_service_1 = require("../../application/services/contract-item.service");
const contract_item_dto_1 = require("../../application/dtos/contract-item.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let ContractItemController = class ContractItemController {
    constructor(contractItemService) {
        this.contractItemService = contractItemService;
    }
    async findByContractId(contractId) {
        return this.contractItemService.findByContractId(contractId);
    }
    async findByProductId(productId) {
        return this.contractItemService.findByProductId(productId);
    }
    async findOne(id) {
        return this.contractItemService.findById(id);
    }
    async create(createContractItemDto) {
        return this.contractItemService.create(createContractItemDto);
    }
    async update(id, updateContractItemDto) {
        return this.contractItemService.update(id, updateContractItemDto);
    }
    async remove(id) {
        await this.contractItemService.delete(id);
    }
};
exports.ContractItemController = ContractItemController;
__decorate([
    (0, common_1.Get)('contract/:contractId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar itens de um contrato' }),
    (0, swagger_1.ApiParam)({ name: 'contractId', description: 'ID do contrato' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de itens do contrato',
        type: [contract_item_dto_1.ContractItemDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contrato não encontrado' }),
    __param(0, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractItemController.prototype, "findByContractId", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar aluguéis de um produto' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID do produto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de aluguéis do produto',
        type: [contract_item_dto_1.ContractItemDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractItemController.prototype, "findByProductId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar item por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do item' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Item encontrado com sucesso',
        type: contract_item_dto_1.ContractItemDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractItemController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar item ao contrato' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Item adicionado com sucesso',
        type: contract_item_dto_1.ContractItemDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Recurso não encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contract_item_dto_1.CreateContractItemDto]),
    __metadata("design:returntype", Promise)
], ContractItemController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar item do contrato' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do item' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Item atualizado com sucesso',
        type: contract_item_dto_1.ContractItemDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contract_item_dto_1.UpdateContractItemDto]),
    __metadata("design:returntype", Promise)
], ContractItemController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Remover item do contrato' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do item' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Item removido com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item não encontrado' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractItemController.prototype, "remove", null);
exports.ContractItemController = ContractItemController = __decorate([
    (0, swagger_1.ApiTags)('Itens de Contrato'),
    (0, common_1.Controller)('contract-items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [contract_item_service_1.ContractItemService])
], ContractItemController);
//# sourceMappingURL=contract-item.controller.js.map