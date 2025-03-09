// src/inventory/domain/repositories/category.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository extends IBaseRepository<Category> {
  findByName(name: string): Promise<Category | null>;
  getWithProductCount(): Promise<{ id: string; name: string; productCount: number }[]>;
}
