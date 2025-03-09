// src/inventory/infrastructure/repositories/product-image.repository.ts
import { Injectable } from '@nestjs/common';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { IProductImageRepository } from '../../domain/repositories/product-image.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ProductImageRepository implements IProductImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductImage[]> {
    const images = await this.prisma.productImage.findMany();
    return images as unknown as ProductImage[];
  }

  async findById(id: string): Promise<ProductImage | null> {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });
    return image as unknown as ProductImage | null;
  }

  async findByProductId(productId: string): Promise<ProductImage[]> {
    const images = await this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { isMain: 'desc' },
    });
    return images as unknown as ProductImage[];
  }

  async findMainImage(productId: string): Promise<ProductImage | null> {
    const image = await this.prisma.productImage.findFirst({
      where: {
        productId,
        isMain: true,
      },
    });
    return image as unknown as ProductImage | null;
  }

  async create(data: Partial<ProductImage>): Promise<ProductImage> {
    if (!data.url || !data.productId) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    // Se for a primeira imagem, marcar como principal
    const imagesCount = await this.prisma.productImage.count({
      where: { productId: data.productId },
    });

    const image = await this.prisma.productImage.create({
      data: {
        url: data.url,
        isMain: data.isMain ?? imagesCount === 0,
        productId: data.productId,
      },
    });
    return image as unknown as ProductImage;
  }

  async update(id: string, data: Partial<ProductImage>): Promise<ProductImage> {
    const image = await this.prisma.productImage.update({
      where: { id },
      data: data as any,
    });
    return image as unknown as ProductImage;
  }

  async setMainImage(id: string): Promise<ProductImage> {
    // Primeiro, obter a imagem para saber o productId
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new Error('Imagem não encontrada');
    }

    // Remover flag de principal de todas as imagens do produto
    await this.prisma.productImage.updateMany({
      where: { productId: image.productId },
      data: { isMain: false },
    });

    // Definir esta como principal
    const updatedImage = await this.prisma.productImage.update({
      where: { id },
      data: { isMain: true },
    });
    return updatedImage as unknown as ProductImage;
  }

  async delete(id: string): Promise<void> {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new Error('Imagem não encontrada');
    }

    await this.prisma.productImage.delete({
      where: { id },
    });

    // Se a imagem excluída era a principal, definir outra como principal
    if (image.isMain) {
      const nextImage = await this.prisma.productImage.findFirst({
        where: { productId: image.productId },
      });

      if (nextImage) {
        await this.prisma.productImage.update({
          where: { id: nextImage.id },
          data: { isMain: true },
        });
      }
    }
  }
}
