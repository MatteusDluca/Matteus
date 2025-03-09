import { LocationDto } from './location.dto';
export declare class CreateEventDto {
    name: string;
    date: Date;
    category: string;
    locationId: string;
    capacity?: number;
    organizer?: string;
    description?: string;
}
export declare class UpdateEventDto {
    name?: string;
    date?: Date;
    category?: string;
    locationId?: string;
    capacity?: number;
    organizer?: string;
    description?: string;
}
export declare class EventResponseDto {
    id: string;
    name: string;
    date: Date;
    category: string;
    locationId: string;
    capacity?: number;
    organizer?: string;
    description?: string;
    location?: LocationDto;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MonthlyEventCountDto {
    month: number;
    count: number;
}
