import { Location } from '../../domain/entities/location.entity';
import { ILocationRepository } from '../../domain/repositories/location.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class LocationRepository implements ILocationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapPrismaEventToEntity;
    private mapPrismaLocationToEntity;
    findAll(): Promise<Location[]>;
    findById(id: string): Promise<Location | null>;
    findByCity(city: string): Promise<Location[]>;
    findByName(name: string): Promise<Location | null>;
    findMostUsedLocations(limit: number): Promise<{
        id: string;
        name: string;
        eventCount: number;
    }[]>;
    create(data: Partial<Location>): Promise<Location>;
    update(id: string, data: Partial<Location>): Promise<Location>;
    delete(id: string): Promise<void>;
}
