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
exports.ContractRevenueDto = exports.ContractStatsDto = exports.ContractResponseDto = exports.UpdateContractDto = exports.CreateContractDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contract_entity_1 = require("../../domain/entities/contract.entity");
const contract_item_dto_1 = require("./contract-item.dto");
const payment_dto_1 = require("./payment.dto");
class CreateContractDto {
}
exports.CreateContractDto = CreateContractDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do cliente' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do funcionário' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do evento (opcional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data da prova',
        example: '2023-01-01T14:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateContractDto.prototype, "fittingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de retirada',
        example: '2023-01-05T10:00:00Z',
    }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateContractDto.prototype, "pickupDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de devolução',
        example: '2023-01-10T10:00:00Z',
    }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateContractDto.prototype, "returnDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Status do contrato',
        enum: contract_entity_1.ContractStatus,
        default: contract_entity_1.ContractStatus.DRAFT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contract_entity_1.ContractStatus),
    __metadata("design:type", String)
], CreateContractDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valor do depósito/caução' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "depositAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Condições especiais' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "specialConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Observações' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Itens do contrato',
        type: [contract_item_dto_1.CreateContractItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => contract_item_dto_1.CreateContractItemDto),
    __metadata("design:type", Array)
], CreateContractDto.prototype, "items", void 0);
class UpdateContractDto {
}
exports.UpdateContractDto = UpdateContractDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do cliente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do funcionário' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do evento' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data da prova',
        example: '2023-01-01T14:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateContractDto.prototype, "fittingDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data de retirada',
        example: '2023-01-05T10:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateContractDto.prototype, "pickupDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data de devolução',
        example: '2023-01-10T10:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateContractDto.prototype, "returnDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Status do contrato',
        enum: contract_entity_1.ContractStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contract_entity_1.ContractStatus),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valor do depósito/caução' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateContractDto.prototype, "depositAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Condições especiais' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "specialConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Observações' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "observations", void 0);
class ContractResponseDto {
}
exports.ContractResponseDto = ContractResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ContractResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ContractResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ContractResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ContractResponseDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ContractResponseDto.prototype, "contractNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ContractResponseDto.prototype, "fittingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ContractResponseDto.prototype, "pickupDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ContractResponseDto.prototype, "returnDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: contract_entity_1.ContractStatus }),
    __metadata("design:type", String)
], ContractResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ContractResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ContractResponseDto.prototype, "depositAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ContractResponseDto.prototype, "specialConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ContractResponseDto.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [contract_item_dto_1.ContractItemDto] }),
    __metadata("design:type", Array)
], ContractResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [payment_dto_1.PaymentDto] }),
    __metadata("design:type", Array)
], ContractResponseDto.prototype, "payments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ContractResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ContractResponseDto.prototype, "updatedAt", void 0);
class ContractStatsDto {
}
exports.ContractStatsDto = ContractStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mês (1-12)' }),
    __metadata("design:type", Number)
], ContractStatsDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ano' }),
    __metadata("design:type", Number)
], ContractStatsDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de contratos' }),
    __metadata("design:type", Number)
], ContractStatsDto.prototype, "count", void 0);
class ContractRevenueDto {
}
exports.ContractRevenueDto = ContractRevenueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mês (1-12)' }),
    __metadata("design:type", Number)
], ContractRevenueDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ano' }),
    __metadata("design:type", Number)
], ContractRevenueDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor total dos contratos' }),
    __metadata("design:type", Number)
], ContractRevenueDto.prototype, "total", void 0);
//# sourceMappingURL=contract.dto.js.map