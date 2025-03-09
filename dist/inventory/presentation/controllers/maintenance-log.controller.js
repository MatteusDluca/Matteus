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
exports.MaintenanceLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const maintenance_log_service_1 = require("../../application/services/maintenance-log.service");
const maintenance_log_dto_1 = require("../../application/dtos/maintenance-log.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const maintenance_log_entity_1 = require("../../domain/entities/maintenance-log.entity");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let MaintenanceLogController = class MaintenanceLogController {
    constructor(maintenanceLogService) {
        this.maintenanceLogService = maintenanceLogService;
    }
    async findAll() {
        return this.maintenanceLogService.findAll();
    }
    async findByProductId(productId) {
        return this.maintenanceLogService.findByProductId(productId);
    }
    async findActiveByProductId(productId) {
        return this.maintenanceLogService.findActiveByProductId(productId);
    }
    async findByStatus(status) {
        return this.maintenanceLogService.findByStatus(status);
    }
    async findOne(id) {
        return this.maintenanceLogService.findById(id);
    }
    async create(createMaintenanceLogDto) {
        return this.maintenanceLogService.create(createMaintenanceLogDto);
    }
    async update(id, updateMaintenanceLogDto) {
        return this.maintenanceLogService.update(id, updateMaintenanceLogDto);
    }
    async completeMaintenance(id, completeMaintenanceLogDto) {
        return this.maintenanceLogService.completeMaintenance(id, completeMaintenanceLogDto);
    }
    async remove(id) {
        await this.maintenanceLogService.delete(id);
        return;
    }
};
exports.MaintenanceLogController = MaintenanceLogController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os registros de manutenção' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de registros de manutenção',
        type: [maintenance_log_dto_1.MaintenanceLogResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros de manutenção de um produto' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID do produto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de registros de manutenção do produto',
        type: [maintenance_log_dto_1.MaintenanceLogResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "findByProductId", null);
__decorate([
    (0, common_1.Get)('product/:productId/active'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar registros de manutenção ativos de um produto',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID do produto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de registros de manutenção ativos do produto',
        type: [maintenance_log_dto_1.MaintenanceLogResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "findActiveByProductId", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros de manutenção por status' }),
    (0, swagger_1.ApiParam)({
        name: 'status',
        enum: maintenance_log_entity_1.MaintenanceStatus,
        description: 'Status da manutenção',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de registros de manutenção filtrada por status',
        type: [maintenance_log_dto_1.MaintenanceLogResponseDto],
    }),
    __param(0, (0, common_1.Param)('status', new common_1.ParseEnumPipe(maintenance_log_entity_1.MaintenanceStatus))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar registro de manutenção por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do registro de manutenção' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Registro de manutenção encontrado com sucesso',
        type: maintenance_log_dto_1.MaintenanceLogResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Registro de manutenção não encontrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo registro de manutenção' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Registro de manutenção criado com sucesso',
        type: maintenance_log_dto_1.MaintenanceLogResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [maintenance_log_dto_1.CreateMaintenanceLogDto]),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar registro de manutenção' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do registro de manutenção' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Registro de manutenção atualizado com sucesso',
        type: maintenance_log_dto_1.MaintenanceLogResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Registro de manutenção não encontrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, maintenance_log_dto_1.UpdateMaintenanceLogDto]),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Completar registro de manutenção' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do registro de manutenção' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Registro de manutenção completado com sucesso',
        type: maintenance_log_dto_1.MaintenanceLogResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Registro de manutenção não encontrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, maintenance_log_dto_1.CompleteMaintenanceLogDto]),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "completeMaintenance", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir registro de manutenção' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do registro de manutenção' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Registro de manutenção excluído com sucesso',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Registro de manutenção não encontrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaintenanceLogController.prototype, "remove", null);
exports.MaintenanceLogController = MaintenanceLogController = __decorate([
    (0, swagger_1.ApiTags)('Registros de Manutenção'),
    (0, common_1.Controller)('maintenance-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [maintenance_log_service_1.MaintenanceLogService])
], MaintenanceLogController);
//# sourceMappingURL=maintenance-log.controller.js.map