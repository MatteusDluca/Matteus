// src/inventory/domain/repositories/product.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Product, ProductStatus } from '../entities/product.entity';

export interface IProductRepository extends IBaseRepository<Product> {
  findByCode(code: string): Promise<Product | null>;
  findByStatus(status: ProductStatus): Promise<Product[]>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findAvailable(): Promise<Product[]>;
  updateStatus(id: string, status: ProductStatus): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
  getMostRented(limit: number): Promise<Product[]>;
}
