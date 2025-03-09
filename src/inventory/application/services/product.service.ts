// src/inventory/application/services/product.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductStatus } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @Inject('IProductRepository') private readonly productRepository: IProductRepository,
    @Inject('ICategoryRepository') private readonly categoryRepository: ICategoryRepository,
  ) {
    super(productRepository);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findByCode(code: string): Promise<Product> {
    const product = await this.productRepository.findByCode(code);
    if (!product) {
      throw new NotFoundException(`Produto com código ${code} não encontrado`);
    }
    return product;
  }

  async findByStatus(status: ProductStatus): Promise<Product[]> {
    return this.productRepository.findByStatus(status);
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    // Verificar se a categoria existe
    const categoryExists = await this.categoryRepository.findById(categoryId);
    if (!categoryExists) {
      throw new NotFoundException(`Categoria com ID ${categoryId} não encontrada`);
    }

    return this.productRepository.findByCategoryId(categoryId);
  }

  async findAvailable(): Promise<Product[]> {
    return this.productRepository.findAvailable();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar se já existe um produto com o mesmo código
    const existingProduct = await this.productRepository.findByCode(createProductDto.code);
    if (existingProduct) {
      throw new BadRequestException(`Já existe um produto com o código ${createProductDto.code}`);
    }

    // Verificar se a categoria existe
    const categoryExists = await this.categoryRepository.findById(createProductDto.categoryId);
    if (!categoryExists) {
      throw new NotFoundException(`Categoria com ID ${createProductDto.categoryId} não encontrada`);
    }

    return this.productRepository.create(createProductDto);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Verificar se o produto existe
    await this.findById(id);

    // Se estiver atualizando o categoryId, verificar se a categoria existe
    if (updateProductDto.categoryId) {
      const categoryExists = await this.categoryRepository.findById(updateProductDto.categoryId);
      if (!categoryExists) {
        throw new NotFoundException(
          `Categoria com ID ${updateProductDto.categoryId} não encontrada`,
        );
      }
    }

    return this.productRepository.update(id, updateProductDto);
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    // Verificar se o produto existe
    await this.findById(id);

    return this.productRepository.updateStatus(id, status);
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim().length < 3) {
      throw new BadRequestException('O termo de busca deve ter pelo menos 3 caracteres');
    }

    return this.productRepository.searchProducts(query.trim());
  }

  async getMostRented(limit = 10): Promise<Product[]> {
    return this.productRepository.getMostRented(limit);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.productRepository.delete(id);
  }
}
