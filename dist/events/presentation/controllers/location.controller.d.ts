import { LocationService } from '../../application/services/location.service';
import { CreateLocationDto, UpdateLocationDto } from '../../application/dtos/location.dto';
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
    findAll(): Promise<import("../../domain/entities/location.entity").Location[]>;
    findMostUsedLocations(limit?: number): Promise<{
        id: string;
        name: string;
        eventCount: number;
    }[]>;
    findByCity(city: string): Promise<import("../../domain/entities/location.entity").Location[]>;
    findByName(name: string): Promise<import("../../domain/entities/location.entity").Location>;
    findOne(id: string): Promise<import("../../domain/entities/location.entity").Location>;
    create(createLocationDto: CreateLocationDto): Promise<import("../../domain/entities/location.entity").Location>;
    update(id: string, updateLocationDto: UpdateLocationDto): Promise<import("../../domain/entities/location.entity").Location>;
    remove(id: string): Promise<void>;
}
