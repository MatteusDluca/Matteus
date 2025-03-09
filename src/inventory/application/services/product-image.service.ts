// src/inventory/application/services/product-image.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { IProductImageRepository } from '../../domain/repositories/product-image.repository.interface';
import { CreateProductImageDto, UpdateProductImageDto } from '../dtos/product-image.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';

@Injectable()
export class ProductImageService extends BaseService<ProductImage> {
  constructor(
    @Inject('IProductImageRepository')
    private readonly productImageRepository: IProductImageRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {
    super(productImageRepository);
  }

  async findAll(): Promise<ProductImage[]> {
    return this.productImageRepository.findAll();
  }

  async findByProductId(productId: string): Promise<ProductImage[]> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado`);
    }

    return this.productImageRepository.findByProductId(productId);
  }

  async findMainImage(productId: string): Promise<ProductImage | null> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado`);
    }

    return this.productImageRepository.findMainImage(productId);
  }

  async create(createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(createProductImageDto.productId);
    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${productExists} não encontrado`);
    }

    return this.productImageRepository.create(createProductImageDto);
  }

  async update(id: string, updateProductImageDto: UpdateProductImageDto): Promise<ProductImage> {
    // Verificar se a imagem existe
    await this.findById(id);

    return this.productImageRepository.update(id, updateProductImageDto);
  }

  async setMainImage(id: string): Promise<ProductImage> {
    // Verificar se a imagem existe
    await this.findById(id);

    return this.productImageRepository.setMainImage(id);
  }

  async delete(id: string): Promise<void> {
    // Verificar se a imagem existe
    await this.findById(id);

    return this.productImageRepository.delete(id);
  }
}
