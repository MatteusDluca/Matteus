// src/inventory/infrastructure/repositories/product.repository.ts
import { Injectable } from '@nestjs/common';
import { Product, ProductStatus } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });
    return products as unknown as Product[];
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        maintenanceLogs: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
      },
    });
    return product as unknown as Product | null;
  }

  async findByCode(code: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { code },
      include: {
        category: true,
        images: true,
      },
    });
    return product as unknown as Product | null;
  }

  async findByStatus(status: ProductStatus): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { status },
      include: {
        category: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });
    return products as unknown as Product[];
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });
    return products as unknown as Product[];
  }

  async findAvailable(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        status: ProductStatus.AVAILABLE,
        quantity: { gt: 0 },
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });
    return products as unknown as Product[];
  }

  async create(data: Partial<Product>): Promise<Product> {
    if (
      !data.name ||
      !data.code ||
      !data.color ||
      !data.size ||
      !data.rentalPrice ||
      !data.quantity ||
      !data.categoryId
    ) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    const rentalPrice = new Prisma.Decimal(data.rentalPrice as unknown as string);
    const replacementCost =
      data.replacementCost !== undefined
        ? new Prisma.Decimal(data.replacementCost as unknown as string)
        : null;

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        code: data.code,
        color: data.color,
        size: data.size,
        rentalPrice: rentalPrice as any,
        replacementCost: replacementCost as any,
        quantity: data.quantity,
        status: data.status ?? ProductStatus.AVAILABLE,
        location: data.location ?? null,
        description: data.description ?? null,
        maintenanceInfo: data.maintenanceInfo ?? null,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
        images: true,
      },
    });
    return product as unknown as Product;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const updateData: any = { ...data };

    if (data.rentalPrice !== undefined) {
      updateData.rentalPrice = new Prisma.Decimal(data.rentalPrice as unknown as string);
    }

    if (data.replacementCost !== undefined) {
      updateData.replacementCost =
        data.replacementCost !== null
          ? new Prisma.Decimal(data.replacementCost as unknown as string)
          : null;
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });
    return product as unknown as Product;
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { status },
      include: {
        category: true,
        images: true,
      },
    });
    return product as unknown as Product;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { color: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        images: true,
      },
    });
    return products as unknown as Product[];
  }

  async getMostRented(limit: number): Promise<Product[]> {
    // Isso seria implementado com um raw SQL ou uma consulta mais complexa
    // para obter produtos mais alugados com base em dados de contratos
    // Esta é uma implementação simulada
    const products = await this.prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true,
      },
    });
    return products as unknown as Product[];
  }
}
