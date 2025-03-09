import { Product, ProductStatus } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class ProductRepository implements IProductRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    findByCode(code: string): Promise<Product | null>;
    findByStatus(status: ProductStatus): Promise<Product[]>;
    findByCategoryId(categoryId: string): Promise<Product[]>;
    findAvailable(): Promise<Product[]>;
    create(data: Partial<Product>): Promise<Product>;
    update(id: string, data: Partial<Product>): Promise<Product>;
    updateStatus(id: string, status: ProductStatus): Promise<Product>;
    delete(id: string): Promise<void>;
    searchProducts(query: string): Promise<Product[]>;
    getMostRented(limit: number): Promise<Product[]>;
}
