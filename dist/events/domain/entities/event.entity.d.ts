import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Location } from './location.entity';
export declare class Event extends BaseEntity {
    name: string;
    date: Date;
    category: string;
    locationId: string;
    capacity?: number;
    organizer?: string;
    description?: string;
    location?: Location;
}
