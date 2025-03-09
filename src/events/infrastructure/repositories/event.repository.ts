// src/events/infrastructure/repositories/event.repository.ts
import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Função de mapeamento para converter tipos Prisma para tipos de domínio
  private mapPrismaEventToEntity(prismaEvent: any): Event {
    return {
      ...prismaEvent,
      capacity: prismaEvent.capacity === null ? undefined : prismaEvent.capacity,
      organizer: prismaEvent.organizer === null ? undefined : prismaEvent.organizer,
      description: prismaEvent.description === null ? undefined : prismaEvent.description,
      location: prismaEvent.location
        ? {
            ...prismaEvent.location,
            capacity:
              prismaEvent.location.capacity === null ? undefined : prismaEvent.location.capacity,
            type: prismaEvent.location.type === null ? undefined : prismaEvent.location.type,
            description:
              prismaEvent.location.description === null
                ? undefined
                : prismaEvent.location.description,
          }
        : undefined,
    };
  }

  async findAll(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
    });

    return events.map((event) => this.mapPrismaEventToEntity(event));
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });

    return event ? this.mapPrismaEventToEntity(event) : null;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
    });

    return events.map((event) => this.mapPrismaEventToEntity(event));
  }

  async findByLocationId(locationId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { locationId },
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
    });

    return events.map((event) => this.mapPrismaEventToEntity(event));
  }

  async findUpcomingEvents(limit: number): Promise<Event[]> {
    const today = new Date();
    const events = await this.prisma.event.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
      take: limit,
    });

    return events.map((event) => this.mapPrismaEventToEntity(event));
  }

  async findByCategory(category: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        category: {
          equals: category,
          mode: 'insensitive',
        },
      },
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
    });

    return events.map((event) => this.mapPrismaEventToEntity(event));
  }

  async countEventsByMonth(): Promise<{ month: number; count: number }[]> {
    const currentYear = new Date().getFullYear();
    const counts = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "date") as month,
        COUNT(*) as count
      FROM "Event"
      WHERE EXTRACT(YEAR FROM "date") = ${currentYear}
      GROUP BY EXTRACT(MONTH FROM "date")
      ORDER BY month
    `;

    return counts as { month: number; count: number }[];
  }

  async create(data: Partial<Event>): Promise<Event> {
    const createdEvent = await this.prisma.event.create({
      data: data as any,
      include: {
        location: true,
      },
    });

    return this.mapPrismaEventToEntity(createdEvent);
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: data as any,
      include: {
        location: true,
      },
    });

    return this.mapPrismaEventToEntity(updatedEvent);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id },
    });
  }
}
