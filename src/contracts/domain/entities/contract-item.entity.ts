// src/contracts/domain/entities/contract-item.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Product } from '../../../inventory/domain/entities/product.entity';

export class ContractItem extends BaseEntity {
  contractId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;

  // Relacionamentos
  product?: Product;
}
