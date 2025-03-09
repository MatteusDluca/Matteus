// src/shared/application/services/base.service.ts
import { NotFoundException } from '@nestjs/common';
import { IBaseRepository } from '../../domain/repositories/base.repository.interface';
import { Inject } from '@nestjs/common';

export abstract class BaseService<T> {
  constructor(private readonly repository: IBaseRepository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entidade com ID ${id} não encontrada`);
    }
    return entity;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.findById(id); // Verifica se existe
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.repository.delete(id);
  }
}
