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
exports.ContractController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contract_service_1 = require("../../application/services/contract.service");
const contract_dto_1 = require("../../application/dtos/contract.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
const contract_entity_1 = require("../../domain/entities/contract.entity");
const parse_date_pipe_1 = require("../../../auth/presentation/pipes/parse-date.pipe");
let ContractController = class ContractController {
    constructor(contractService) {
        this.contractService = contractService;
    }
    async findAll() {
        return this.contractService.findAll();
    }
    async getContractStats() {
        return this.contractService.getContractStats();
    }
    async getRevenueStats() {
        return this.contractService.getRevenueStats();
    }
    async findByContractNumber(contractNumber) {
        return this.contractService.findByContractNumber(contractNumber);
    }
    async findByCustomerId(customerId) {
        return this.contractService.findByCustomerId(customerId);
    }
    async findByEmployeeId(employeeId) {
        return this.contractService.findByEmployeeId(employeeId);
    }
    async findByEventId(eventId) {
        return this.contractService.findByEventId(eventId);
    }
    async findByStatus(status) {
        return this.contractService.findByStatus(status);
    }
    async findLateContracts() {
        return this.contractService.findLateContracts();
    }
    async findByDateRange(startDate, endDate, field) {
        if (field !== 'pickupDate' && field !== 'returnDate') {
            throw new common_1.BadRequestException('O campo deve ser "pickupDate" ou "returnDate"');
        }
        return this.contractService.findByDateRange(startDate, endDate, field);
    }
    async findOne(id) {
        return this.contractService.findById(id);
    }
    async create(createContractDto) {
        return this.contractService.create(createContractDto);
    }
    async update(id, updateContractDto) {
        return this.contractService.update(id, updateContractDto);
    }
    async updateStatus(id, status) {
        return this.contractService.updateStatus(id, status);
    }
    async remove(id) {
        await this.contractService.delete(id);
    }
};
exports.ContractController = ContractController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os contratos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de contratos retornada com sucesso',
        type: [contract_dto_1.ContractResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas de contratos por mês e ano' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estatísticas retornadas com sucesso',
        type: [contract_dto_1.ContractStatsDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "getContractStats", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas de faturamento por mês e ano' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estatísticas retornadas com sucesso',
        type: [contract_dto_1.ContractRevenueDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "getRevenueStats", null);
__decorate([
    (0, common_1.Get)('by-number/:contractNumber'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar contrato por número' }),
    (0, swagger_1.ApiParam)({ name: 'contractNumber', description: 'Número do contrato' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contrato encontrado com sucesso',
        type: contract_dto_1.ContractResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contrato não encontrado' }),
    __param(0, (0, common_1.Param)('contractNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findByContractNumber", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar contratos de um cliente' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de contratos do cliente',
        type: [contract_dto_1.ContractResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findByCustomerId", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar contratos de um funcionário' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', description: 'ID do funcionário' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de contratos do funcionário',
        type: [contract_dto_1.ContractResponseDto],
    }),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findByEmployeeId", null);
__decorate([
    (0, common_1.Get)('event/:eventId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar contratos de um evento' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID do evento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de contratos do evento',
        type: [contract_dto_1.ContractResponseDto],
    }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findByEventId", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar contratos por status' }),
    (0, swagger_1.ApiParam)({
        name: 'status',
        enum: contract_entity_1.ContractStatus,
        description: 'Status do contrato',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de contratos filtrada por status',
        type: [contract_dto_1.ContractResponseDto],
    }),
    __param(0, (0, common_1.Param)('status', new common_1.ParseEnumPipe(contract_entity_1.ContractStatus))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('late'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar contratos em atraso' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de contratos em atraso',
        type: [contract_dto_1.ContractResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findLateContracts", null);
__decorate([
    (0, common_1.Get)('date-range'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar contratos por intervalo de datas' }),
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
    (0, swagger_1.ApiQuery)({
        name: 'field',
        required: true,
        enum: ['pickupDate', 'returnDate'],
        description: 'Campo de data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de contratos no intervalo de datas',
        type: [contract_dto_1.ContractResponseDto],
    }),
    __param(0, (0, common_1.Query)('startDate', parse_date_pipe_1.ParseDatePipe)),
    __param(1, (0, common_1.Query)('endDate', parse_date_pipe_1.ParseDatePipe)),
    __param(2, (0, common_1.Query)('field')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar contrato por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do contrato' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contrato encontrado com sucesso',
        type: contract_dto_1.ContractResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contrato não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo contrato' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Contrato criado com sucesso',
        type: contract_dto_1.ContractResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Recurso não encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contract_dto_1.CreateContractDto]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar contrato' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do contrato' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contrato atualizado com sucesso',
        type: contract_dto_1.ContractResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contrato não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contract_dto_1.UpdateContractDto]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar status do contrato' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do contrato' }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        enum: contract_entity_1.ContractStatus,
        description: 'Novo status do contrato',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Status atualizado com sucesso',
        type: contract_dto_1.ContractResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contrato não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status', new common_1.ParseEnumPipe(contract_entity_1.ContractStatus))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir contrato' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do contrato' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Contrato excluído com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contrato não encontrado' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "remove", null);
exports.ContractController = ContractController = __decorate([
    (0, swagger_1.ApiTags)('Contratos'),
    (0, common_1.Controller)('contracts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [contract_service_1.ContractService])
], ContractController);
//# sourceMappingURL=contract.controller.js.map