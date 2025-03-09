import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Location } from '../entities/location.entity';
export interface ILocationRepository extends IBaseRepository<Location> {
    findByCity(city: string): Promise<Location[]>;
    findByName(name: string): Promise<Location | null>;
    findMostUsedLocations(limit: number): Promise<{
        id: string;
        name: string;
        eventCount: number;
    }[]>;
}
