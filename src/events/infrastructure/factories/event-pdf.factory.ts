// src/events/infrastructure/factories/event-pdf.factory.ts
import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import { Location } from '../../domain/entities/location.entity';

@Injectable()
export class EventPDFFactory {
  /**
   * Prepares data for event PDF generation
   */
  public prepareEventData(event: Event, contracts: any[] = []): any {
    return {
      event,
      contracts,
      // Add any additional transformations or data needed for PDF
    };
  }

  /**
   * Prepares data for location PDF generation
   */
  public prepareLocationData(
    location: Location,
    events: Event[] = [],
    upcomingEvents: Event[] = [],
  ): any {
    return {
      location,
      events,
      upcomingEvents,
      // Add any additional transformations or data needed for PDF
    };
  }

  /**
   * Prepares data for events calendar PDF generation
   */
  public prepareEventsCalendarData(events: Event[], startDate: Date, endDate: Date): any {
    return {
      events,
      period: {
        startDate,
        endDate,
      },
      title: 'Calendário de Eventos',
      subtitle: `Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      generatedBy: 'Sistema',
      content: [
        {
          title: 'Eventos Programados',
          table: {
            headers: ['Nome', 'Categoria', 'Data', 'Local', 'Organizador'],
            rows: events.map((event) => [
              event.name,
              event.category,
              new Date(event.date).toLocaleDateString() +
                ' ' +
                new Date(event.date).toLocaleTimeString(),
              event.location?.name || 'N/A',
              event.organizer || 'N/A',
            ]),
          },
        },
      ],
    };
  }
}
