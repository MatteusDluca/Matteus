import { EventService } from '../../application/services/event.service';
import { CreateEventDto, UpdateEventDto } from '../../application/dtos/event.dto';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    findAll(): Promise<import("../../domain/entities/event.entity").Event[]>;
    findUpcomingEvents(limit?: number): Promise<import("../../domain/entities/event.entity").Event[]>;
    findByDateRange(startDate: string, endDate: string): Promise<import("../../domain/entities/event.entity").Event[]>;
    findByLocationId(locationId: string): Promise<import("../../domain/entities/event.entity").Event[]>;
    findByCategory(category: string): Promise<import("../../domain/entities/event.entity").Event[]>;
    countEventsByMonth(): Promise<{
        month: number;
        count: number;
    }[]>;
    findOne(id: string): Promise<import("../../domain/entities/event.entity").Event>;
    create(createEventDto: CreateEventDto): Promise<import("../../domain/entities/event.entity").Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<import("../../domain/entities/event.entity").Event>;
    remove(id: string): Promise<void>;
}
