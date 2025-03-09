// src/events/application/services/event.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ILocationRepository } from '../../domain/repositories/location.repository.interface';

@Injectable()
export class EventService extends BaseService<Event> {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
  ) {
    super(eventRepository);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    if (startDate > endDate) {
      throw new BadRequestException('A data inicial deve ser anterior à data final');
    }

    return this.eventRepository.findByDateRange(startDate, endDate);
  }

  async findByLocationId(locationId: string): Promise<Event[]> {
    // Verificar se o local existe
    const locationExists = await this.locationRepository.findById(locationId);
    if (!locationExists) {
      throw new NotFoundException(`Local com ID ${locationId} não encontrado`);
    }

    return this.eventRepository.findByLocationId(locationId);
  }

  async findUpcomingEvents(limit = 10): Promise<Event[]> {
    return this.eventRepository.findUpcomingEvents(limit);
  }

  async findByCategory(category: string): Promise<Event[]> {
    return this.eventRepository.findByCategory(category);
  }

  async countEventsByMonth() {
    return this.eventRepository.countEventsByMonth();
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Verificar se o local existe
    const locationExists = await this.locationRepository.findById(createEventDto.locationId);
    if (!locationExists) {
      throw new NotFoundException(`Local com ID ${createEventDto.locationId} não encontrado`);
    }

    // Verificar se a data do evento é futura
    const eventDate = new Date(createEventDto.date);
    const today = new Date();

    if (eventDate < today) {
      throw new BadRequestException('A data do evento deve ser futura');
    }

    return this.eventRepository.create(createEventDto);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    // Verificar se o evento existe
    await this.findById(id);

    // Se estiver atualizando o locationId, verificar se o local existe
    if (updateEventDto.locationId) {
      const locationExists = await this.locationRepository.findById(updateEventDto.locationId);
      if (!locationExists) {
        throw new NotFoundException(`Local com ID ${updateEventDto.locationId} não encontrado`);
      }
    }

    // Se estiver atualizando a data, verificar se é futura
    if (updateEventDto.date) {
      const eventDate = new Date(updateEventDto.date);
      const today = new Date();

      if (eventDate < today) {
        throw new BadRequestException('A data do evento deve ser futura');
      }
    }

    return this.eventRepository.update(id, updateEventDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.eventRepository.delete(id);
  }
}
