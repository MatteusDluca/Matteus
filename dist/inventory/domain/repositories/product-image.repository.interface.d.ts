import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { ProductImage } from '../entities/product-image.entity';
export interface IProductImageRepository extends IBaseRepository<ProductImage> {
    findByProductId(productId: string): Promise<ProductImage[]>;
    findMainImage(productId: string): Promise<ProductImage | null>;
    setMainImage(id: string): Promise<ProductImage>;
}
