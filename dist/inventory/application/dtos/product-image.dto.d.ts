export declare class CreateProductImageDto {
    url: string;
    isMain?: boolean;
    productId: string;
}
export declare class UpdateProductImageDto {
    url?: string;
    isMain?: boolean;
}
export declare class ProductImageResponseDto {
    id: string;
    url: string;
    isMain: boolean;
    productId: string;
    createdAt: Date;
}
