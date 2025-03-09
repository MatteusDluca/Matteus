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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_service_1 = require("../../application/services/customer.service");
const customer_dto_1 = require("../../application/dtos/customer.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let CustomerController = class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
    }
    async findAll() {
        return this.customerService.findAll();
    }
    async findTopCustomers(limit) {
        return this.customerService.findTopCustomers(limit);
    }
    async findBirthdaysInMonth(month) {
        return this.customerService.findBirthdaysInMonth(month);
    }
    async findOne(id) {
        return this.customerService.findById(id);
    }
    async findByDocument(documentNumber) {
        return this.customerService.findByDocument(documentNumber);
    }
    async findByEmail(email) {
        return this.customerService.findByEmail(email);
    }
    async findByUserId(userId) {
        return this.customerService.findByUserId(userId);
    }
    async create(createCustomerDto) {
        return this.customerService.create(createCustomerDto);
    }
    async update(id, updateCustomerDto) {
        return this.customerService.update(id, updateCustomerDto);
    }
    async updateLoyaltyPoints(id, updateLoyaltyPointsDto) {
        return this.customerService.updateLoyaltyPoints(id, updateLoyaltyPointsDto.points);
    }
    async updateBodyMeasurements(id, bodyMeasurementsDto) {
        return this.customerService.updateBodyMeasurements(id, bodyMeasurementsDto);
    }
    async remove(id) {
        await this.customerService.delete(id);
        return;
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os clientes' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de clientes retornada com sucesso',
        type: [customer_dto_1.CustomerResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('top'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar os clientes mais fiéis' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Número máximo de clientes (default: 10)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista dos melhores clientes',
        type: [customer_dto_1.CustomerResponseDto],
    }),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findTopCustomers", null);
__decorate([
    (0, common_1.Get)('birthdays'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar aniversariantes do mês' }),
    (0, swagger_1.ApiQuery)({
        name: 'month',
        required: true,
        type: Number,
        description: 'Mês (1-12)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de aniversariantes do mês',
        type: [customer_dto_1.CustomerResponseDto],
    }),
    __param(0, (0, common_1.Query)('month', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findBirthdaysInMonth", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar cliente por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cliente encontrado com sucesso',
        type: customer_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('document/:documentNumber'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar cliente por número de documento' }),
    (0, swagger_1.ApiParam)({ name: 'documentNumber', description: 'CPF ou CNPJ do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cliente encontrado com sucesso',
        type: customer_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('documentNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findByDocument", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar cliente por email' }),
    (0, swagger_1.ApiParam)({ name: 'email', description: 'Email do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cliente encontrado com sucesso',
        type: customer_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar cliente por ID de usuário' }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'ID do usuário associado ao cliente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cliente encontrado com sucesso',
        type: customer_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Cliente criado com sucesso',
        type: customer_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar cliente' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cliente atualizado com sucesso',
        type: customer_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/loyalty-points'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar pontos de fidelidade do cliente' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pontos de fidelidade atualizados com sucesso',
        type: customer_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_dto_1.UpdateLoyaltyPointsDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateLoyaltyPoints", null);
__decorate([
    (0, common_1.Put)(':id/measurements'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar medidas corporais do cliente' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medidas corporais atualizadas com sucesso',
        type: customer_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_dto_1.BodyMeasurementsDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateBodyMeasurements", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir cliente' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Cliente excluído com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "remove", null);
exports.CustomerController = CustomerController = __decorate([
    (0, swagger_1.ApiTags)('Clientes'),
    (0, common_1.Controller)('customers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map