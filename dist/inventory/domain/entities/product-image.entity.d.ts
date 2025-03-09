import { BaseEntity } from '../../../shared/domain/entities/base.entity';
export declare class ProductImage extends BaseEntity {
    url: string;
    isMain: boolean;
    productId: string;
}
