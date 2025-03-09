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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
let NotificationService = class NotificationService extends base_service_1.BaseService {
    constructor(notificationRepository, customerRepository) {
        super(notificationRepository);
        this.notificationRepository = notificationRepository;
        this.customerRepository = customerRepository;
    }
    async findAll() {
        return this.notificationRepository.findAll();
    }
    async findByCustomerId(customerId) {
        const customerExists = await this.customerRepository.findById(customerId);
        if (!customerExists) {
            throw new common_1.NotFoundException(`Cliente com ID ${customerId} não encontrado`);
        }
        return this.notificationRepository.findByCustomerId(customerId);
    }
    async findUnreadByCustomerId(customerId) {
        const customerExists = await this.customerRepository.findById(customerId);
        if (!customerExists) {
            throw new common_1.NotFoundException(`Cliente com ID ${customerId} não encontrado`);
        }
        return this.notificationRepository.findUnreadByCustomerId(customerId);
    }
    async findByType(type) {
        return this.notificationRepository.findByType(type);
    }
    async create(createNotificationDto) {
        const customerExists = await this.customerRepository.findById(createNotificationDto.customerId);
        if (!customerExists) {
            throw new common_1.NotFoundException(`Cliente com ID ${createNotificationDto.customerId} não encontrado`);
        }
        if (!createNotificationDto.sentAt) {
            createNotificationDto.sentAt = new Date();
        }
        return this.notificationRepository.create(createNotificationDto);
    }
    async update(id, updateNotificationDto) {
        await this.findById(id);
        return this.notificationRepository.update(id, updateNotificationDto);
    }
    async markAsRead(id) {
        const notification = await this.findById(id);
        if (notification.isRead) {
            return notification;
        }
        return this.notificationRepository.markAsRead(id);
    }
    async markAllAsRead(customerId) {
        const customerExists = await this.customerRepository.findById(customerId);
        if (!customerExists) {
            throw new common_1.NotFoundException(`Cliente com ID ${customerId} não encontrado`);
        }
        return this.notificationRepository.markAllAsRead(customerId);
    }
    async countUnreadByCustomerId(customerId) {
        const customerExists = await this.customerRepository.findById(customerId);
        if (!customerExists) {
            throw new common_1.NotFoundException(`Cliente com ID ${customerId} não encontrado`);
        }
        return this.notificationRepository.countUnreadByCustomerId(customerId);
    }
    async delete(id) {
        await this.findById(id);
        return this.notificationRepository.delete(id);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('INotificationRepository')),
    __param(1, (0, common_1.Inject)('ICustomerRepository')),
    __metadata("design:paramtypes", [Object, Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map