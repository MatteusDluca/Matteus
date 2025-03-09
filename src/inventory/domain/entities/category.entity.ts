// src/inventory/domain/entities/category.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Product } from './product.entity';

export class Category extends BaseEntity {
  name: string;
  description?: string;

  // Relacionamentos
  products?: Product[];
}
