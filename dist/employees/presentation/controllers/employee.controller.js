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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const employee_service_1 = require("../../application/services/employee.service");
const employee_dto_1 = require("../../application/dtos/employee.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let EmployeeController = class EmployeeController {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    async findAll() {
        return this.employeeService.findAll();
    }
    async findTopPerformers(minRate) {
        return this.employeeService.findTopPerformers(minRate);
    }
    async findOne(id) {
        return this.employeeService.findById(id);
    }
    async findByCpf(cpf) {
        return this.employeeService.findByCpf(cpf);
    }
    async findByUserId(userId) {
        return this.employeeService.findByUserId(userId);
    }
    async create(createEmployeeDto) {
        return this.employeeService.create(createEmployeeDto);
    }
    async update(id, updateEmployeeDto) {
        return this.employeeService.update(id, updateEmployeeDto);
    }
    async updatePerformance(id, rate) {
        return this.employeeService.updatePerformance(id, rate);
    }
    async remove(id) {
        await this.employeeService.delete(id);
        return;
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os funcionários' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de funcionários retornada com sucesso',
        type: [employee_dto_1.EmployeeResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('top-performers'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar funcionários com melhor desempenho' }),
    (0, swagger_1.ApiQuery)({
        name: 'minRate',
        required: false,
        type: Number,
        description: 'Taxa mínima de desempenho (default: 80)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de funcionários de alto desempenho',
        type: [employee_dto_1.EmployeeResponseDto],
    }),
    __param(0, (0, common_1.Query)('minRate', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findTopPerformers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar funcionário por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do funcionário' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Funcionário encontrado com sucesso',
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Funcionário não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('cpf/:cpf'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar funcionário por CPF' }),
    (0, swagger_1.ApiParam)({ name: 'cpf', description: 'CPF do funcionário' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Funcionário encontrado com sucesso',
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Funcionário não encontrado' }),
    __param(0, (0, common_1.Param)('cpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findByCpf", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar funcionário por ID de usuário' }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'ID do usuário associado ao funcionário',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Funcionário encontrado com sucesso',
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Funcionário não encontrado' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo funcionário' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Funcionário criado com sucesso',
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar funcionário' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do funcionário' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Funcionário atualizado com sucesso',
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Funcionário não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/performance'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar taxa de desempenho do funcionário' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do funcionário' }),
    (0, swagger_1.ApiQuery)({
        name: 'rate',
        required: true,
        type: Number,
        description: 'Nova taxa de desempenho (0-100)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Taxa de desempenho atualizada com sucesso',
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Funcionário não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('rate', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "updatePerformance", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir funcionário' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do funcionário' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Funcionário excluído com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Funcionário não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "remove", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, swagger_1.ApiTags)('Funcionários'),
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map