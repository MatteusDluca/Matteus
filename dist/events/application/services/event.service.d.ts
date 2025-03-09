import { Event } from '../../domain/entities/event.entity';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ILocationRepository } from '../../domain/repositories/location.repository.interface';
export declare class EventService extends BaseService<Event> {
    private readonly eventRepository;
    private readonly locationRepository;
    constructor(eventRepository: IEventRepository, locationRepository: ILocationRepository);
    findAll(): Promise<Event[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
    findByLocationId(locationId: string): Promise<Event[]>;
    findUpcomingEvents(limit?: number): Promise<Event[]>;
    findByCategory(category: string): Promise<Event[]>;
    countEventsByMonth(): Promise<{
        month: number;
        count: number;
    }[]>;
    create(createEventDto: CreateEventDto): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    delete(id: string): Promise<void>;
}
