import { Product, ProductStatus } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
export declare class ProductService extends BaseService<Product> {
    private readonly productRepository;
    private readonly categoryRepository;
    constructor(productRepository: IProductRepository, categoryRepository: ICategoryRepository);
    findAll(): Promise<Product[]>;
    findByCode(code: string): Promise<Product>;
    findByStatus(status: ProductStatus): Promise<Product[]>;
    findByCategoryId(categoryId: string): Promise<Product[]>;
    findAvailable(): Promise<Product[]>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    updateStatus(id: string, status: ProductStatus): Promise<Product>;
    searchProducts(query: string): Promise<Product[]>;
    getMostRented(limit?: number): Promise<Product[]>;
    delete(id: string): Promise<void>;
}
