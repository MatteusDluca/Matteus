import { Location } from '../../domain/entities/location.entity';
import { ILocationRepository } from '../../domain/repositories/location.repository.interface';
import { CreateLocationDto, UpdateLocationDto } from '../dtos/location.dto';
import { BaseService } from '../../../shared/application/services/base.service';
export declare class LocationService extends BaseService<Location> {
    private readonly locationRepository;
    constructor(locationRepository: ILocationRepository);
    findAll(): Promise<Location[]>;
    findByCity(city: string): Promise<Location[]>;
    findByName(name: string): Promise<Location>;
    findMostUsedLocations(limit?: number): Promise<{
        id: string;
        name: string;
        eventCount: number;
    }[]>;
    create(createLocationDto: CreateLocationDto): Promise<Location>;
    update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location>;
    delete(id: string): Promise<void>;
}
