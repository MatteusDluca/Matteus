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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("../../application/services/payment.service");
const payment_dto_1 = require("../../application/dtos/payment.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
const payment_entity_1 = require("../../domain/entities/payment.entity");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async findAll() {
        return this.paymentService.findAll();
    }
    async findByContractId(contractId) {
        return this.paymentService.findByContractId(contractId);
    }
    async findByStatus(status) {
        return this.paymentService.findByStatus(status);
    }
    async findOne(id) {
        return this.paymentService.findById(id);
    }
    async create(createPaymentDto) {
        return this.paymentService.create(createPaymentDto);
    }
    async update(id, updatePaymentDto) {
        return this.paymentService.update(id, updatePaymentDto);
    }
    async markAsPaid(id) {
        return this.paymentService.markAsPaid(id);
    }
    async remove(id) {
        await this.paymentService.delete(id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os pagamentos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de pagamentos retornada com sucesso',
        type: [payment_dto_1.PaymentDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('contract/:contractId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar pagamentos de um contrato' }),
    (0, swagger_1.ApiParam)({ name: 'contractId', description: 'ID do contrato' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de pagamentos do contrato',
        type: [payment_dto_1.PaymentDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contrato não encontrado' }),
    __param(0, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findByContractId", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar pagamentos por status' }),
    (0, swagger_1.ApiParam)({
        name: 'status',
        enum: payment_entity_1.PaymentStatus,
        description: 'Status do pagamento',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de pagamentos filtrada por status',
        type: [payment_dto_1.PaymentDto],
    }),
    __param(0, (0, common_1.Param)('status', new common_1.ParseEnumPipe(payment_entity_1.PaymentStatus))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar pagamento por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do pagamento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pagamento encontrado com sucesso',
        type: payment_dto_1.PaymentDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar novo pagamento' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Pagamento registrado com sucesso',
        type: payment_dto_1.PaymentDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar pagamento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do pagamento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pagamento atualizado com sucesso',
        type: payment_dto_1.PaymentDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/mark-as-paid'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar pagamento como pago' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do pagamento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pagamento marcado como pago com sucesso',
        type: payment_dto_1.PaymentDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "markAsPaid", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir pagamento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do pagamento' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Pagamento excluído com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "remove", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Pagamentos'),
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map