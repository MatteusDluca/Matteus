import { ProductStatus } from '../../domain/entities/product.entity';
import { CategoryDto } from './category.dto';
export declare class CreateProductDto {
    name: string;
    code: string;
    color: string;
    size: string;
    rentalPrice: number;
    replacementCost?: number;
    quantity: number;
    status: ProductStatus;
    location?: string;
    description?: string;
    maintenanceInfo?: string;
    categoryId: string;
}
export declare class UpdateProductDto {
    name?: string;
    color?: string;
    size?: string;
    rentalPrice?: number;
    replacementCost?: number;
    quantity?: number;
    status?: ProductStatus;
    location?: string;
    description?: string;
    maintenanceInfo?: string;
    categoryId?: string;
}
export declare class ProductImageDto {
    id: string;
    url: string;
    isMain: boolean;
}
export declare class ProductResponseDto {
    id: string;
    name: string;
    code: string;
    color: string;
    size: string;
    rentalPrice: number;
    replacementCost?: number;
    quantity: number;
    status: ProductStatus;
    location?: string;
    description?: string;
    maintenanceInfo?: string;
    categoryId: string;
    category?: CategoryDto;
    images?: ProductImageDto[];
    createdAt: Date;
    updatedAt: Date;
}
