import { ProductImage } from '../../domain/entities/product-image.entity';
import { IProductImageRepository } from '../../domain/repositories/product-image.repository.interface';
import { CreateProductImageDto, UpdateProductImageDto } from '../dtos/product-image.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
export declare class ProductImageService extends BaseService<ProductImage> {
    private readonly productImageRepository;
    private readonly productRepository;
    constructor(productImageRepository: IProductImageRepository, productRepository: IProductRepository);
    findAll(): Promise<ProductImage[]>;
    findByProductId(productId: string): Promise<ProductImage[]>;
    findMainImage(productId: string): Promise<ProductImage | null>;
    create(createProductImageDto: CreateProductImageDto): Promise<ProductImage>;
    update(id: string, updateProductImageDto: UpdateProductImageDto): Promise<ProductImage>;
    setMainImage(id: string): Promise<ProductImage>;
    delete(id: string): Promise<void>;
}
