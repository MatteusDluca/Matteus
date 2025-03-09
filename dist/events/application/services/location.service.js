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
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
let LocationService = class LocationService extends base_service_1.BaseService {
    constructor(locationRepository) {
        super(locationRepository);
        this.locationRepository = locationRepository;
    }
    async findAll() {
        return this.locationRepository.findAll();
    }
    async findByCity(city) {
        return this.locationRepository.findByCity(city);
    }
    async findByName(name) {
        const location = await this.locationRepository.findByName(name);
        if (!location) {
            throw new common_1.NotFoundException('Local com nome não encontrado');
        }
        return location;
    }
    async findMostUsedLocations(limit = 10) {
        return this.locationRepository.findMostUsedLocations(limit);
    }
    async create(createLocationDto) {
        const existingLocation = await this.locationRepository.findByName(createLocationDto.name);
        if (existingLocation) {
            throw new common_1.BadRequestException(`Já existe um local com o nome ${createLocationDto.name}`);
        }
        return this.locationRepository.create(createLocationDto);
    }
    async update(id, updateLocationDto) {
        await this.findById(id);
        if (updateLocationDto.name) {
            const existingLocation = await this.locationRepository.findByName(updateLocationDto.name);
            if (existingLocation && existingLocation.id !== id) {
                throw new common_1.BadRequestException(`Já existe um local com o nome ${updateLocationDto.name}`);
            }
        }
        return this.locationRepository.update(id, updateLocationDto);
    }
    async delete(id) {
        await this.findById(id);
        return this.locationRepository.delete(id);
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ILocationRepository')),
    __metadata("design:paramtypes", [Object])
], LocationService);
//# sourceMappingURL=location.service.js.map