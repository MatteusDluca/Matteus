// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventController } from './presentation/controllers/event.controller';
import { LocationController } from './presentation/controllers/location.controller';
import { EventService } from './application/services/event.service';
import { LocationService } from './application/services/location.service';
import { EventRepository } from './infrastructure/repositories/event.repository';
import { LocationRepository } from './infrastructure/repositories/location.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventController, LocationController],
  providers: [
    EventService,
    LocationService,
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
    {
      provide: 'ILocationRepository',
      useClass: LocationRepository,
    },
  ],
  exports: [EventService, LocationService],
})
export class EventsModule {}
