import { ProductImageService } from '../../application/services/product-image.service';
import { CreateProductImageDto, UpdateProductImageDto } from '../../application/dtos/product-image.dto';
export declare class ProductImageController {
    private readonly productImageService;
    constructor(productImageService: ProductImageService);
    findByProductId(productId: string): Promise<import("../../domain/entities/product-image.entity").ProductImage[]>;
    findMainImage(productId: string): Promise<import("../../domain/entities/product-image.entity").ProductImage>;
    findOne(id: string): Promise<import("../../domain/entities/product-image.entity").ProductImage>;
    create(createProductImageDto: CreateProductImageDto): Promise<import("../../domain/entities/product-image.entity").ProductImage>;
    update(id: string, updateProductImageDto: UpdateProductImageDto): Promise<import("../../domain/entities/product-image.entity").ProductImage>;
    setMainImage(id: string): Promise<import("../../domain/entities/product-image.entity").ProductImage>;
    remove(id: string): Promise<void>;
}
