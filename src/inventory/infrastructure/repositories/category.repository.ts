// src/inventory/infrastructure/repositories/category.repository.ts
import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories as unknown as Category[];
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    return category as unknown as Category | null;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    return category as unknown as Category | null;
  }

  async getWithProductCount(): Promise<{ id: string; name: string; productCount: number }[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
    }));
  }

  async create(data: Partial<Category>): Promise<Category> {
    if (!data.name) {
      throw new Error('O nome da categoria é obrigatório');
    }

    const category = await this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
    return category as unknown as Category;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return category as unknown as Category;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
