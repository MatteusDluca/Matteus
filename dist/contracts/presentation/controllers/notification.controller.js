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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notification_service_1 = require("../../application/services/notification.service");
const notification_dto_1 = require("../../application/dtos/notification.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
const notification_entity_1 = require("../../domain/entities/notification.entity");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async findAll() {
        return this.notificationService.findAll();
    }
    async findByCustomerId(customerId) {
        return this.notificationService.findByCustomerId(customerId);
    }
    async findUnreadByCustomerId(customerId) {
        return this.notificationService.findUnreadByCustomerId(customerId);
    }
    async countUnreadByCustomerId(customerId) {
        const count = await this.notificationService.countUnreadByCustomerId(customerId);
        return { count };
    }
    async findByType(type) {
        return this.notificationService.findByType(type);
    }
    async findOne(id) {
        return this.notificationService.findById(id);
    }
    async create(createNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }
    async update(id, updateNotificationDto) {
        return this.notificationService.update(id, updateNotificationDto);
    }
    async markAsRead(id) {
        return this.notificationService.markAsRead(id);
    }
    async markAllAsRead(customerId) {
        await this.notificationService.markAllAsRead(customerId);
        return { message: 'Todas as notificações foram marcadas como lidas' };
    }
    async remove(id) {
        await this.notificationService.delete(id);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as notificações' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de notificações retornada com sucesso',
        type: [notification_dto_1.NotificationDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar notificações de um cliente' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de notificações do cliente',
        type: [notification_dto_1.NotificationDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findByCustomerId", null);
__decorate([
    (0, common_1.Get)('customer/:customerId/unread'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar notificações não lidas de um cliente' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de notificações não lidas do cliente',
        type: [notification_dto_1.NotificationDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findUnreadByCustomerId", null);
__decorate([
    (0, common_1.Get)('customer/:customerId/count-unread'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Contar notificações não lidas de um cliente' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contagem de notificações não lidas',
        schema: {
            properties: {
                count: {
                    type: 'number',
                    description: 'Número de notificações não lidas',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "countUnreadByCustomerId", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar notificações por tipo' }),
    (0, swagger_1.ApiParam)({
        name: 'type',
        enum: notification_entity_1.NotificationType,
        description: 'Tipo da notificação',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de notificações filtrada por tipo',
        type: [notification_dto_1.NotificationDto],
    }),
    __param(0, (0, common_1.Param)('type', new common_1.ParseEnumPipe(notification_entity_1.NotificationType))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar notificação por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da notificação' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notificação encontrada com sucesso',
        type: notification_dto_1.NotificationDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notificação não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova notificação' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Notificação criada com sucesso',
        type: notification_dto_1.NotificationDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar notificação' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da notificação' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notificação atualizada com sucesso',
        type: notification_dto_1.NotificationDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notificação não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/mark-as-read'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar notificação como lida' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da notificação' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notificação marcada como lida com sucesso',
        type: notification_dto_1.NotificationDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notificação não encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('customer/:customerId/mark-all-as-read'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({
        summary: 'Marcar todas as notificações do cliente como lidas',
    }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'ID do cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notificações marcadas como lidas com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir notificação' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da notificação' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Notificação excluída com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notificação não encontrada' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "remove", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('Notificações'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map