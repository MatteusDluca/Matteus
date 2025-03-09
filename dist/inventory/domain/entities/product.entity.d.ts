import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { MaintenanceLog } from './maintenance-log.entity';
export declare enum ProductStatus {
    AVAILABLE = "AVAILABLE",
    RENTED = "RENTED",
    MAINTENANCE = "MAINTENANCE",
    CLEANING = "CLEANING",
    DISCARDED = "DISCARDED"
}
export declare class Product extends BaseEntity {
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
    category?: Category;
    images?: ProductImage[];
    maintenanceLogs?: MaintenanceLog[];
}
