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
exports.LocationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
let LocationRepository = class LocationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapPrismaEventToEntity(prismaEvent) {
        return Object.assign(Object.assign({}, prismaEvent), { capacity: prismaEvent.capacity === null ? undefined : prismaEvent.capacity, organizer: prismaEvent.organizer === null ? undefined : prismaEvent.organizer, description: prismaEvent.description === null ? undefined : prismaEvent.description });
    }
    mapPrismaLocationToEntity(prismaLocation) {
        return Object.assign(Object.assign({}, prismaLocation), { capacity: prismaLocation.capacity === null ? undefined : prismaLocation.capacity, type: prismaLocation.type === null ? undefined : prismaLocation.type, description: prismaLocation.description === null ? undefined : prismaLocation.description, events: prismaLocation.events
                ? prismaLocation.events.map((event) => this.mapPrismaEventToEntity(event))
                : undefined });
    }
    async findAll() {
        const locations = await this.prisma.location.findMany({
            orderBy: { name: 'asc' },
        });
        return locations.map((location) => this.mapPrismaLocationToEntity(location));
    }
    async findById(id) {
        const location = await this.prisma.location.findUnique({
            where: { id },
            include: {
                events: {
                    orderBy: { date: 'asc' },
                },
            },
        });
        return location ? this.mapPrismaLocationToEntity(location) : null;
    }
    async findByCity(city) {
        const locations = await this.prisma.location.findMany({
            where: {
                city: {
                    equals: city,
                    mode: 'insensitive',
                },
            },
            orderBy: { name: 'asc' },
        });
        return locations.map((location) => this.mapPrismaLocationToEntity(location));
    }
    async findByName(name) {
        const location = await this.prisma.location.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });
        return location ? this.mapPrismaLocationToEntity(location) : null;
    }
    async findMostUsedLocations(limit) {
        const locations = await this.prisma.location.findMany({
            include: {
                _count: {
                    select: { events: true },
                },
            },
            orderBy: {
                events: {
                    _count: 'desc',
                },
            },
            take: limit,
        });
        return locations.map((location) => ({
            id: location.id,
            name: location.name,
            eventCount: location._count.events,
        }));
    }
    async create(data) {
        const createdLocation = await this.prisma.location.create({
            data: data,
        });
        return this.mapPrismaLocationToEntity(createdLocation);
    }
    async update(id, data) {
        const updatedLocation = await this.prisma.location.update({
            where: { id },
            data: data,
        });
        return this.mapPrismaLocationToEntity(updatedLocation);
    }
    async delete(id) {
        await this.prisma.location.delete({
            where: { id },
        });
    }
};
exports.LocationRepository = LocationRepository;
exports.LocationRepository = LocationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationRepository);
//# sourceMappingURL=location.repository.js.map