// src/inventory/application/services/category.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @Inject('ICategoryRepository') private readonly categoryRepository: ICategoryRepository,
  ) {
    super(categoryRepository);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findByName(name);
    if (!category) {
      throw new NotFoundException(`Categoria com nome ${name} não encontrada`);
    }
    return category;
  }

  async getWithProductCount() {
    return this.categoryRepository.getWithProductCount();
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar se já existe uma categoria com o mesmo nome
    const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
    if (existingCategory) {
      throw new BadRequestException(`Já existe uma categoria com o nome ${createCategoryDto.name}`);
    }

    return this.categoryRepository.create(createCategoryDto);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // Verificar se a categoria existe
    await this.findById(id);

    // Se estiver atualizando o nome, verificar se já existe outra categoria com esse nome
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findByName(updateCategoryDto.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException(
          `Já existe uma categoria com o nome ${updateCategoryDto.name}`,
        );
      }
    }

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async delete(id: string): Promise<void> {
    // Verificar se a categoria existe
    await this.findById(id);

    // Aqui poderia verificar se a categoria tem produtos associados
    // e impedir a exclusão ou implementar uma estratégia de exclusão

    return this.categoryRepository.delete(id);
  }
}
