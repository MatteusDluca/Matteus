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
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const location_service_1 = require("../../application/services/location.service");
const location_dto_1 = require("../../application/dtos/location.dto");
const jwt_auth_guard_1 = require("../../../auth/presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/presentation/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/presentation/decorators/roles.decorator");
const user_entity_1 = require("../../../auth/domain/entities/user.entity");
let LocationController = class LocationController {
    constructor(locationService) {
        this.locationService = locationService;
    }
    async findAll() {
        return this.locationService.findAll();
    }
    async findMostUsedLocations(limit) {
        return this.locationService.findMostUsedLocations(limit);
    }
    async findByCity(city) {
        return this.locationService.findByCity(city);
    }
    async findByName(name) {
        return this.locationService.findByName(name);
    }
    async findOne(id) {
        return this.locationService.findById(id);
    }
    async create(createLocationDto) {
        return this.locationService.create(createLocationDto);
    }
    async update(id, updateLocationDto) {
        return this.locationService.update(id, updateLocationDto);
    }
    async remove(id) {
        await this.locationService.delete(id);
        return;
    }
};
exports.LocationController = LocationController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os locais' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de locais retornada com sucesso',
        type: [location_dto_1.LocationDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('most-used'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar locais mais utilizados' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Número máximo de locais (default: 10)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista dos locais mais utilizados',
        type: [location_dto_1.LocationWithEventCountDto],
    }),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findMostUsedLocations", null);
__decorate([
    (0, common_1.Get)('city/:city'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar locais por cidade' }),
    (0, swagger_1.ApiParam)({ name: 'city', description: 'Nome da cidade' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de locais da cidade',
        type: [location_dto_1.LocationDto],
    }),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findByCity", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar local por nome' }),
    (0, swagger_1.ApiParam)({ name: 'name', description: 'Nome do local' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Local encontrado com sucesso',
        type: location_dto_1.LocationDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Local não encontrado' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findByName", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER, user_entity_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar local por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do local' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Local encontrado com sucesso',
        type: location_dto_1.LocationDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Local não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo local' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Local criado com sucesso',
        type: location_dto_1.LocationDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_dto_1.CreateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar local' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do local' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Local atualizado com sucesso',
        type: location_dto_1.LocationDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Local não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir local' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do local' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Local excluído com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Local não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "remove", null);
exports.LocationController = LocationController = __decorate([
    (0, swagger_1.ApiTags)('Locais de Eventos'),
    (0, common_1.Controller)('locations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], LocationController);
//# sourceMappingURL=location.controller.js.map