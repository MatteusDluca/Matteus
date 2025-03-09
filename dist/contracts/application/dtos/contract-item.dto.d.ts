export declare class CreateContractItemDto {
    contractId?: string;
    productId: string;
    quantity: number;
    unitPrice?: number;
}
export declare class UpdateContractItemDto {
    quantity?: number;
    unitPrice?: number;
}
export declare class ContractItemDto {
    id: string;
    contractId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    createdAt: Date;
}
