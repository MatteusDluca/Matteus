import { ProductImage } from '../../domain/entities/product-image.entity';
import { IProductImageRepository } from '../../domain/repositories/product-image.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class ProductImageRepository implements IProductImageRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<ProductImage[]>;
    findById(id: string): Promise<ProductImage | null>;
    findByProductId(productId: string): Promise<ProductImage[]>;
    findMainImage(productId: string): Promise<ProductImage | null>;
    create(data: Partial<ProductImage>): Promise<ProductImage>;
    update(id: string, data: Partial<ProductImage>): Promise<ProductImage>;
    setMainImage(id: string): Promise<ProductImage>;
    delete(id: string): Promise<void>;
}
