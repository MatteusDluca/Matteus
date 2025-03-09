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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
let EventService = class EventService extends base_service_1.BaseService {
    constructor(eventRepository, locationRepository) {
        super(eventRepository);
        this.eventRepository = eventRepository;
        this.locationRepository = locationRepository;
    }
    async findAll() {
        return this.eventRepository.findAll();
    }
    async findByDateRange(startDate, endDate) {
        if (startDate > endDate) {
            throw new common_1.BadRequestException('A data inicial deve ser anterior à data final');
        }
        return this.eventRepository.findByDateRange(startDate, endDate);
    }
    async findByLocationId(locationId) {
        const locationExists = await this.locationRepository.findById(locationId);
        if (!locationExists) {
            throw new common_1.NotFoundException(`Local com ID ${locationId} não encontrado`);
        }
        return this.eventRepository.findByLocationId(locationId);
    }
    async findUpcomingEvents(limit = 10) {
        return this.eventRepository.findUpcomingEvents(limit);
    }
    async findByCategory(category) {
        return this.eventRepository.findByCategory(category);
    }
    async countEventsByMonth() {
        return this.eventRepository.countEventsByMonth();
    }
    async create(createEventDto) {
        const locationExists = await this.locationRepository.findById(createEventDto.locationId);
        if (!locationExists) {
            throw new common_1.NotFoundException(`Local com ID ${createEventDto.locationId} não encontrado`);
        }
        const eventDate = new Date(createEventDto.date);
        const today = new Date();
        if (eventDate < today) {
            throw new common_1.BadRequestException('A data do evento deve ser futura');
        }
        return this.eventRepository.create(createEventDto);
    }
    async update(id, updateEventDto) {
        await this.findById(id);
        if (updateEventDto.locationId) {
            const locationExists = await this.locationRepository.findById(updateEventDto.locationId);
            if (!locationExists) {
                throw new common_1.NotFoundException(`Local com ID ${updateEventDto.locationId} não encontrado`);
            }
        }
        if (updateEventDto.date) {
            const eventDate = new Date(updateEventDto.date);
            const today = new Date();
            if (eventDate < today) {
                throw new common_1.BadRequestException('A data do evento deve ser futura');
            }
        }
        return this.eventRepository.update(id, updateEventDto);
    }
    async delete(id) {
        await this.findById(id);
        return this.eventRepository.delete(id);
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IEventRepository')),
    __param(1, (0, common_1.Inject)('ILocationRepository')),
    __metadata("design:paramtypes", [Object, Object])
], EventService);
//# sourceMappingURL=event.service.js.map