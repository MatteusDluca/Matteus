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
exports.MaintenanceLogService = void 0;
const common_1 = require("@nestjs/common");
const maintenance_log_entity_1 = require("../../domain/entities/maintenance-log.entity");
const base_service_1 = require("../../../shared/application/services/base.service");
const product_entity_1 = require("../../domain/entities/product.entity");
let MaintenanceLogService = class MaintenanceLogService extends base_service_1.BaseService {
    constructor(maintenanceLogRepository, productRepository) {
        super(maintenanceLogRepository);
        this.maintenanceLogRepository = maintenanceLogRepository;
        this.productRepository = productRepository;
    }
    async findAll() {
        return this.maintenanceLogRepository.findAll();
    }
    async findByProductId(productId) {
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new common_1.NotFoundException(`Produto com ID ${productId} não encontrado`);
        }
        return this.maintenanceLogRepository.findByProductId(productId);
    }
    async findActiveByProductId(productId) {
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new common_1.NotFoundException(`Produto com ID ${productId} não encontrado`);
        }
        return this.maintenanceLogRepository.findActiveByProductId(productId);
    }
    async findByStatus(status) {
        return this.maintenanceLogRepository.findByStatus(status);
    }
    async create(createMaintenanceLogDto) {
        const product = await this.productRepository.findById(createMaintenanceLogDto.productId);
        if (!product) {
            throw new common_1.NotFoundException(`Produto com ID ${product} não encontrado`);
        }
        if (createMaintenanceLogDto.status === maintenance_log_entity_1.MaintenanceStatus.SCHEDULED ||
            createMaintenanceLogDto.status === maintenance_log_entity_1.MaintenanceStatus.IN_PROGRESS) {
            await this.productRepository.updateStatus(product.id, product_entity_1.ProductStatus.MAINTENANCE);
        }
        return this.maintenanceLogRepository.create(createMaintenanceLogDto);
    }
    async update(id, updateMaintenanceLogDto) {
        const maintenanceLog = await this.findById(id);
        if (updateMaintenanceLogDto.status === maintenance_log_entity_1.MaintenanceStatus.COMPLETED &&
            !updateMaintenanceLogDto.endDate &&
            !maintenanceLog.endDate) {
            throw new common_1.BadRequestException('Data de término deve ser informada para completar a manutenção');
        }
        const updatedLog = await this.maintenanceLogRepository.update(id, updateMaintenanceLogDto);
        if (updateMaintenanceLogDto.status === maintenance_log_entity_1.MaintenanceStatus.COMPLETED) {
            const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(updatedLog.productId);
            if (activeLogs.length === 0) {
                await this.productRepository.updateStatus(updatedLog.productId, product_entity_1.ProductStatus.AVAILABLE);
            }
        }
        return updatedLog;
    }
    async completeMaintenance(id, completeDto) {
        const maintenanceLog = await this.findById(id);
        if (maintenanceLog.status === maintenance_log_entity_1.MaintenanceStatus.COMPLETED) {
            throw new common_1.BadRequestException('Essa manutenção já foi concluída');
        }
        const updatedLog = await this.maintenanceLogRepository.completeMaintenanceLog(id, completeDto.endDate);
        const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(updatedLog.productId);
        if (activeLogs.length === 0) {
            await this.productRepository.updateStatus(updatedLog.productId, product_entity_1.ProductStatus.AVAILABLE);
        }
        return updatedLog;
    }
    async delete(id) {
        const maintenanceLog = await this.findById(id);
        await this.maintenanceLogRepository.delete(id);
        if (maintenanceLog.status === maintenance_log_entity_1.MaintenanceStatus.SCHEDULED ||
            maintenanceLog.status === maintenance_log_entity_1.MaintenanceStatus.IN_PROGRESS) {
            const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(maintenanceLog.productId);
            if (activeLogs.length === 0) {
                await this.productRepository.updateStatus(maintenanceLog.productId, product_entity_1.ProductStatus.AVAILABLE);
            }
        }
    }
};
exports.MaintenanceLogService = MaintenanceLogService;
exports.MaintenanceLogService = MaintenanceLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IMaintenanceLogRepository')),
    __param(1, (0, common_1.Inject)('IProductRepository')),
    __metadata("design:paramtypes", [Object, Object])
], MaintenanceLogService);
//# sourceMappingURL=maintenance-log.service.js.map