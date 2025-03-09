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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceLogResponseDto = exports.CompleteMaintenanceLogDto = exports.UpdateMaintenanceLogDto = exports.CreateMaintenanceLogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const maintenance_log_entity_1 = require("../../domain/entities/maintenance-log.entity");
class CreateMaintenanceLogDto {
}
exports.CreateMaintenanceLogDto = CreateMaintenanceLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do produto em manutenção' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaintenanceLogDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descrição do serviço de manutenção' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaintenanceLogDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custo da manutenção' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMaintenanceLogDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de início da manutenção',
        example: '2023-01-01',
    }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateMaintenanceLogDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data prevista de término',
        example: '2023-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateMaintenanceLogDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da manutenção',
        enum: maintenance_log_entity_1.MaintenanceStatus,
        default: maintenance_log_entity_1.MaintenanceStatus.SCHEDULED,
    }),
    (0, class_validator_1.IsEnum)(maintenance_log_entity_1.MaintenanceStatus),
    __metadata("design:type", String)
], CreateMaintenanceLogDto.prototype, "status", void 0);
class UpdateMaintenanceLogDto {
}
exports.UpdateMaintenanceLogDto = UpdateMaintenanceLogDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descrição do serviço de manutenção' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaintenanceLogDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custo da manutenção' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateMaintenanceLogDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data de início da manutenção',
        example: '2023-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateMaintenanceLogDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data prevista de término',
        example: '2023-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateMaintenanceLogDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Status da manutenção',
        enum: maintenance_log_entity_1.MaintenanceStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(maintenance_log_entity_1.MaintenanceStatus),
    __metadata("design:type", String)
], UpdateMaintenanceLogDto.prototype, "status", void 0);
class CompleteMaintenanceLogDto {
}
exports.CompleteMaintenanceLogDto = CompleteMaintenanceLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data efetiva de término da manutenção',
        example: '2023-01-10',
    }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CompleteMaintenanceLogDto.prototype, "endDate", void 0);
class MaintenanceLogResponseDto {
}
exports.MaintenanceLogResponseDto = MaintenanceLogResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MaintenanceLogResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MaintenanceLogResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MaintenanceLogResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], MaintenanceLogResponseDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MaintenanceLogResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], MaintenanceLogResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: maintenance_log_entity_1.MaintenanceStatus }),
    __metadata("design:type", String)
], MaintenanceLogResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MaintenanceLogResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MaintenanceLogResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=maintenance-log.dto.js.map