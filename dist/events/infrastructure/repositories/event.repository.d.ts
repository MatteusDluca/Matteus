import { Event } from '../../domain/entities/event.entity';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class EventRepository implements IEventRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapPrismaEventToEntity;
    findAll(): Promise<Event[]>;
    findById(id: string): Promise<Event | null>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
    findByLocationId(locationId: string): Promise<Event[]>;
    findUpcomingEvents(limit: number): Promise<Event[]>;
    findByCategory(category: string): Promise<Event[]>;
    countEventsByMonth(): Promise<{
        month: number;
        count: number;
    }[]>;
    create(data: Partial<Event>): Promise<Event>;
    update(id: string, data: Partial<Event>): Promise<Event>;
    delete(id: string): Promise<void>;
}
