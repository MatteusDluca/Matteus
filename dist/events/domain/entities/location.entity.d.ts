import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Event } from './event.entity';
export declare class Location extends BaseEntity {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    capacity?: number | null;
    type?: string | null;
    description?: string | null;
    events?: Event[];
}
