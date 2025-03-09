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
exports.EventRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let EventRepository = class EventRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapPrismaEventToEntity(prismaEvent) {
        return Object.assign(Object.assign({}, prismaEvent), { capacity: prismaEvent.capacity === null ? undefined : prismaEvent.capacity, organizer: prismaEvent.organizer === null ? undefined : prismaEvent.organizer, description: prismaEvent.description === null ? undefined : prismaEvent.description, location: prismaEvent.location
                ? Object.assign(Object.assign({}, prismaEvent.location), { capacity: prismaEvent.location.capacity === null ? undefined : prismaEvent.location.capacity, type: prismaEvent.location.type === null ? undefined : prismaEvent.location.type, description: prismaEvent.location.description === null
                        ? undefined
                        : prismaEvent.location.description }) : undefined });
    }
    async findAll() {
        const events = await this.prisma.event.findMany({
            include: {
                location: true,
            },
            orderBy: { date: 'asc' },
        });
        return events.map((event) => this.mapPrismaEventToEntity(event));
    }
    async findById(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                location: true,
            },
        });
        return event ? this.mapPrismaEventToEntity(event) : null;
    }
    async findByDateRange(startDate, endDate) {
        const events = await this.prisma.event.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                location: true,
            },
            orderBy: { date: 'asc' },
        });
        return events.map((event) => this.mapPrismaEventToEntity(event));
    }
    async findByLocationId(locationId) {
        const events = await this.prisma.event.findMany({
            where: { locationId },
            include: {
                location: true,
            },
            orderBy: { date: 'asc' },
        });
        return events.map((event) => this.mapPrismaEventToEntity(event));
    }
    async findUpcomingEvents(limit) {
        const today = new Date();
        const events = await this.prisma.event.findMany({
            where: {
                date: {
                    gte: today,
                },
            },
            include: {
                location: true,
            },
            orderBy: { date: 'asc' },
            take: limit,
        });
        return events.map((event) => this.mapPrismaEventToEntity(event));
    }
    async findByCategory(category) {
        const events = await this.prisma.event.findMany({
            where: {
                category: {
                    equals: category,
                    mode: 'insensitive',
                },
            },
            include: {
                location: true,
            },
            orderBy: { date: 'asc' },
        });
        return events.map((event) => this.mapPrismaEventToEntity(event));
    }
    async countEventsByMonth() {
        const currentYear = new Date().getFullYear();
        const counts = await this.prisma.$queryRaw `
      SELECT 
        EXTRACT(MONTH FROM "date") as month,
        COUNT(*) as count
      FROM "Event"
      WHERE EXTRACT(YEAR FROM "date") = ${currentYear}
      GROUP BY EXTRACT(MONTH FROM "date")
      ORDER BY month
    `;
        return counts;
    }
    async create(data) {
        const createdEvent = await this.prisma.event.create({
            data: data,
            include: {
                location: true,
            },
        });
        return this.mapPrismaEventToEntity(createdEvent);
    }
    async update(id, data) {
        const updatedEvent = await this.prisma.event.update({
            where: { id },
            data: data,
            include: {
                location: true,
            },
        });
        return this.mapPrismaEventToEntity(updatedEvent);
    }
    async delete(id) {
        await this.prisma.event.delete({
            where: { id },
        });
    }
};
exports.EventRepository = EventRepository;
exports.EventRepository = EventRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventRepository);
//# sourceMappingURL=event.repository.js.map