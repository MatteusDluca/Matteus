import { ProductService } from '../../application/services/product.service';
import { CreateProductDto, UpdateProductDto } from '../../application/dtos/product.dto';
import { ProductStatus } from '../../domain/entities/product.entity';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(): Promise<import("../../domain/entities/product.entity").Product[]>;
    findAvailable(): Promise<import("../../domain/entities/product.entity").Product[]>;
    getMostRented(limit?: number): Promise<import("../../domain/entities/product.entity").Product[]>;
    searchProducts(query: string): Promise<import("../../domain/entities/product.entity").Product[]>;
    findByStatus(status: ProductStatus): Promise<import("../../domain/entities/product.entity").Product[]>;
    findByCategoryId(categoryId: string): Promise<import("../../domain/entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("../../domain/entities/product.entity").Product>;
    findByCode(code: string): Promise<import("../../domain/entities/product.entity").Product>;
    create(createProductDto: CreateProductDto): Promise<import("../../domain/entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../../domain/entities/product.entity").Product>;
    updateStatus(id: string, status: ProductStatus): Promise<import("../../domain/entities/product.entity").Product>;
    remove(id: string): Promise<void>;
}
