// src/events/application/services/location.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Location } from '../../domain/entities/location.entity';
import { ILocationRepository } from '../../domain/repositories/location.repository.interface';
import { CreateLocationDto, UpdateLocationDto } from '../dtos/location.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
export class LocationService extends BaseService<Location> {
  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
  ) {
    super(locationRepository);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.findAll();
  }

  async findByCity(city: string): Promise<Location[]> {
    return this.locationRepository.findByCity(city);
  }

  async findByName(name: string): Promise<Location> {
    const location = await this.locationRepository.findByName(name);
    if (!location) {
      throw new NotFoundException('Local com nome não encontrado');
    }
    return location;
  }

  async findMostUsedLocations(limit = 10) {
    return this.locationRepository.findMostUsedLocations(limit);
  }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    // Verificar se já existe um local com o mesmo nome
    const existingLocation = await this.locationRepository.findByName(createLocationDto.name);
    if (existingLocation) {
      throw new BadRequestException(`Já existe um local com o nome ${createLocationDto.name}`);
    }

    return this.locationRepository.create(createLocationDto);
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    // Verificar se o local existe
    await this.findById(id);

    // Se estiver atualizando o nome, verificar se já existe outro local com esse nome
    if (updateLocationDto.name) {
      const existingLocation = await this.locationRepository.findByName(updateLocationDto.name);
      if (existingLocation && existingLocation.id !== id) {
        throw new BadRequestException(`Já existe um local com o nome ${updateLocationDto.name}`);
      }
    }

    return this.locationRepository.update(id, updateLocationDto);
  }

  async delete(id: string): Promise<void> {
    // Verificar se o local existe
    await this.findById(id);

    // Aqui poderia verificar se o local tem eventos associados
    // e impedir a exclusão ou implementar uma estratégia de exclusão

    return this.locationRepository.delete(id);
  }
}
