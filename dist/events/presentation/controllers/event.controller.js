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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const event_service_1 = require("../../application/services/event.service");
const event_dto_1 = require("../../application/dtos/event.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let EventController = class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async findAll() {
        return this.eventService.findAll();
    }
    async findUpcomingEvents(limit) {
        return this.eventService.findUpcomingEvents(limit);
    }
    async findByDateRange(startDate, endDate) {
        return this.eventService.findByDateRange(new Date(startDate), new Date(endDate));
    }
    async findByLocationId(locationId) {
        return this.eventService.findByLocationId(locationId);
    }
    async findByCategory(category) {
        return this.eventService.findByCategory(category);
    }
    async countEventsByMonth() {
        return this.eventService.countEventsByMonth();
    }
    async findOne(id) {
        return this.eventService.findById(id);
    }
    async create(createEventDto) {
        return this.eventService.create(createEventDto);
    }
    async update(id, updateEventDto) {
        return this.eventService.update(id, updateEventDto);
    }
    async remove(id) {
        await this.eventService.delete(id);
        return;
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os eventos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de eventos retornada com sucesso',
        type: [event_dto_1.EventResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar próximos eventos' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Número máximo de eventos (default: 10)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista dos próximos eventos',
        type: [event_dto_1.EventResponseDto],
    }),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findUpcomingEvents", null);
__decorate([
    (0, common_1.Get)('date-range'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar eventos por intervalo de datas' }),
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
        description: 'Lista de eventos no intervalo de datas',
        type: [event_dto_1.EventResponseDto],
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('location/:locationId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar eventos por local' }),
    (0, swagger_1.ApiParam)({ name: 'locationId', description: 'ID do local' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de eventos do local',
        type: [event_dto_1.EventResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Local não encontrado' }),
    __param(0, (0, common_1.Param)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findByLocationId", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar eventos por categoria' }),
    (0, swagger_1.ApiParam)({ name: 'category', description: 'Categoria do evento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de eventos da categoria',
        type: [event_dto_1.EventResponseDto],
    }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('monthly-count'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Obter contagem de eventos por mês' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contagem de eventos por mês',
        type: [event_dto_1.MonthlyEventCountDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "countEventsByMonth", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar evento por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do evento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Evento encontrado com sucesso',
        type: event_dto_1.EventResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Evento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo evento' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Evento criado com sucesso',
        type: event_dto_1.EventResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Local não encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar evento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do evento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Evento atualizado com sucesso',
        type: event_dto_1.EventResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Evento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir evento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do evento' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Evento excluído com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Evento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "remove", null);
exports.EventController = EventController = __decorate([
    (0, swagger_1.ApiTags)('Eventos'),
    (0, common_1.Controller)('events'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [event_service_1.EventService])
], EventController);
//# sourceMappingURL=event.controller.js.map