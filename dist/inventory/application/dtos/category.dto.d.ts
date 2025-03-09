export declare class CategoryDto {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CategoryWithProductCountDto extends CategoryDto {
    productCount: number;
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
}
