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
exports.NotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let NotificationRepository = class NotificationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const notifications = await this.prisma.notification.findMany({
            orderBy: { sentAt: 'desc' },
        });
        return notifications;
    }
    async findById(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        return notification;
    }
    async findByCustomerId(customerId) {
        const notifications = await this.prisma.notification.findMany({
            where: { customerId },
            orderBy: { sentAt: 'desc' },
        });
        return notifications;
    }
    async findUnreadByCustomerId(customerId) {
        const notifications = await this.prisma.notification.findMany({
            where: {
                customerId,
                isRead: false,
            },
            orderBy: { sentAt: 'desc' },
        });
        return notifications;
    }
    async findByType(type) {
        const notifications = await this.prisma.notification.findMany({
            where: { type },
            orderBy: { sentAt: 'desc' },
        });
        return notifications;
    }
    async create(data) {
        var _a, _b, _c;
        if (!data.customerId || !data.type || !data.title || !data.message) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const notification = await this.prisma.notification.create({
            data: {
                customerId: data.customerId,
                type: data.type,
                title: data.title,
                message: data.message,
                isRead: (_a = data.isRead) !== null && _a !== void 0 ? _a : false,
                sentAt: (_b = data.sentAt) !== null && _b !== void 0 ? _b : new Date(),
                readAt: (_c = data.readAt) !== null && _c !== void 0 ? _c : null,
            },
        });
        return notification;
    }
    async update(id, data) {
        const notification = await this.prisma.notification.update({
            where: { id },
            data: data,
        });
        return notification;
    }
    async markAsRead(id) {
        const notification = await this.prisma.notification.update({
            where: { id },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return notification;
    }
    async markAllAsRead(customerId) {
        await this.prisma.notification.updateMany({
            where: {
                customerId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async countUnreadByCustomerId(customerId) {
        return this.prisma.notification.count({
            where: {
                customerId,
                isRead: false,
            },
        });
    }
    async delete(id) {
        await this.prisma.notification.delete({
            where: { id },
        });
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationRepository);
//# sourceMappingURL=notification.repository.js.map