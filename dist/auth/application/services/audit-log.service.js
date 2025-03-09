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
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
let AuditLogService = class AuditLogService extends base_service_1.BaseService {
    constructor(auditLogRepository) {
        super(auditLogRepository);
        this.auditLogRepository = auditLogRepository;
    }
    async findAll() {
        return this.auditLogRepository.findAll();
    }
    async findByUserId(userId) {
        return this.auditLogRepository.findByUserId(userId);
    }
    async findByResource(resource) {
        return this.auditLogRepository.findByResource(resource);
    }
    async findByAction(action) {
        return this.auditLogRepository.findByAction(action);
    }
    async findByDateRange(startDate, endDate) {
        return this.auditLogRepository.findByDateRange(startDate, endDate);
    }
    async create(createAuditLogDto) {
        return this.auditLogRepository.create(createAuditLogDto);
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IAuditLogRepository')),
    __metadata("design:paramtypes", [Object])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map