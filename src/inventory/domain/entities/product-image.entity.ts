// src/inventory/domain/entities/product-image.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export class ProductImage extends BaseEntity {
  url: string;
  isMain: boolean;
  productId: string;
}
