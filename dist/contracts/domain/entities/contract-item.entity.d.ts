import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Product } from '../../../inventory/domain/entities/product.entity';
export declare class ContractItem extends BaseEntity {
    contractId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product?: Product;
}
