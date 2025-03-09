// src/events/domain/repositories/event.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Event } from '../entities/event.entity';

export interface IEventRepository extends IBaseRepository<Event> {
  findByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
  findByLocationId(locationId: string): Promise<Event[]>;
  findUpcomingEvents(limit: number): Promise<Event[]>;
  findByCategory(category: string): Promise<Event[]>;
  countEventsByMonth(): Promise<{ month: number; count: number }[]>;
}
