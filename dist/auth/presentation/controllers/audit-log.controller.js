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
exports.AuditLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_log_service_1 = require("../../application/services/audit-log.service");
const audit_log_dto_1 = require("../../application/dtos/audit-log.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_entity_1 = require("../../domain/entities/user.entity");
const parse_date_pipe_1 = require("../pipes/parse-date.pipe");
let AuditLogController = class AuditLogController {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.auditLogService.findAll();
    }
    async findByUserId(userId) {
        return this.auditLogService.findByUserId(userId);
    }
    async findByResource(resource) {
        return this.auditLogService.findByResource(resource);
    }
    async findByAction(action) {
        return this.auditLogService.findByAction(action);
    }
    async findByDateRange(startDate, endDate) {
        return this.auditLogService.findByDateRange(startDate, endDate);
    }
    async findOne(id) {
        return this.auditLogService.findById(id);
    }
};
exports.AuditLogController = AuditLogController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os logs de auditoria' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de logs retornada com sucesso',
        type: [audit_log_dto_1.AuditLogResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar logs de auditoria por usuário' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID do usuário' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de logs retornada com sucesso',
        type: [audit_log_dto_1.AuditLogResponseDto],
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)('resource/:resource'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar logs de auditoria por recurso' }),
    (0, swagger_1.ApiParam)({ name: 'resource', description: 'Nome do recurso' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de logs retornada com sucesso',
        type: [audit_log_dto_1.AuditLogResponseDto],
    }),
    __param(0, (0, common_1.Param)('resource')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "findByResource", null);
__decorate([
    (0, common_1.Get)('action/:action'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar logs de auditoria por ação' }),
    (0, swagger_1.ApiParam)({ name: 'action', description: 'Nome da ação' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de logs retornada com sucesso',
        type: [audit_log_dto_1.AuditLogResponseDto],
    }),
    __param(0, (0, common_1.Param)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "findByAction", null);
__decorate([
    (0, common_1.Get)('date-range'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar logs de auditoria por intervalo de datas' }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: true,
        type: String,
        description: 'Data inicial (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: true,
        type: String,
        description: 'Data final (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de logs retornada com sucesso',
        type: [audit_log_dto_1.AuditLogResponseDto],
    }),
    __param(0, (0, common_1.Query)('startDate', parse_date_pipe_1.ParseDatePipe)),
    __param(1, (0, common_1.Query)('endDate', parse_date_pipe_1.ParseDatePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar log de auditoria por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do log de auditoria' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Log encontrado com sucesso',
        type: audit_log_dto_1.AuditLogResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Log não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "findOne", null);
exports.AuditLogController = AuditLogController = __decorate([
    (0, swagger_1.ApiTags)('Logs de Auditoria'),
    (0, common_1.Controller)('audit-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogController);
//# sourceMappingURL=audit-log.controller.js.map