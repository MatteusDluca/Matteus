// src/events/infrastructure/repositories/location.repository.ts
import { Injectable } from '@nestjs/common';
import { Location } from '../../domain/entities/location.entity';
import { ILocationRepository } from '../../domain/repositories/location.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Event } from '../../domain/entities/event.entity';

@Injectable()
export class LocationRepository implements ILocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Função auxiliar para mapear eventos do Prisma para entidades de domínio
  private mapPrismaEventToEntity(prismaEvent: any): Event {
    return {
      ...prismaEvent,
      capacity: prismaEvent.capacity === null ? undefined : prismaEvent.capacity,
      organizer: prismaEvent.organizer === null ? undefined : prismaEvent.organizer,
      description: prismaEvent.description === null ? undefined : prismaEvent.description,
    };
  }

  // Função auxiliar para mapear locais do Prisma para entidades de domínio
  private mapPrismaLocationToEntity(prismaLocation: any): Location {
    return {
      ...prismaLocation,
      capacity: prismaLocation.capacity === null ? undefined : prismaLocation.capacity,
      type: prismaLocation.type === null ? undefined : prismaLocation.type,
      description: prismaLocation.description === null ? undefined : prismaLocation.description,
      events: prismaLocation.events
        ? prismaLocation.events.map((event) => this.mapPrismaEventToEntity(event))
        : undefined,
    };
  }

  async findAll(): Promise<Location[]> {
    const locations = await this.prisma.location.findMany({
      orderBy: { name: 'asc' },
    });

    return locations.map((location) => this.mapPrismaLocationToEntity(location));
  }

  async findById(id: string): Promise<Location | null> {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { date: 'asc' },
        },
      },
    });

    return location ? this.mapPrismaLocationToEntity(location) : null;
  }

  async findByCity(city: string): Promise<Location[]> {
    const locations = await this.prisma.location.findMany({
      where: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });

    return locations.map((location) => this.mapPrismaLocationToEntity(location));
  }

  async findByName(name: string): Promise<Location | null> {
    const location = await this.prisma.location.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    return location ? this.mapPrismaLocationToEntity(location) : null;
  }

  async findMostUsedLocations(
    limit: number,
  ): Promise<{ id: string; name: string; eventCount: number }[]> {
    const locations = await this.prisma.location.findMany({
      include: {
        _count: {
          select: { events: true },
        },
      },
      orderBy: {
        events: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return locations.map((location) => ({
      id: location.id,
      name: location.name,
      eventCount: location._count.events,
    }));
  }

  async create(data: Partial<Location>): Promise<Location> {
    const createdLocation = await this.prisma.location.create({
      data: data as any,
    });

    return this.mapPrismaLocationToEntity(createdLocation);
  }

  async update(id: string, data: Partial<Location>): Promise<Location> {
    const updatedLocation = await this.prisma.location.update({
      where: { id },
      data: data as any,
    });

    return this.mapPrismaLocationToEntity(updatedLocation);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.location.delete({
      where: { id },
    });
  }
}
