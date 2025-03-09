import { ContractItem } from '../../domain/entities/contract-item.entity';
import { IContractItemRepository } from '../../domain/repositories/contract-item.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class ContractItemRepository implements IContractItemRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapToContractItem;
    findAll(): Promise<ContractItem[]>;
    findById(id: string): Promise<ContractItem | null>;
    findByContractId(contractId: string): Promise<ContractItem[]>;
    findByProductId(productId: string): Promise<ContractItem[]>;
    create(data: Partial<ContractItem>): Promise<ContractItem>;
    createBulk(items: Partial<ContractItem>[]): Promise<ContractItem[]>;
    update(id: string, data: Partial<ContractItem>): Promise<ContractItem>;
    updateQuantity(id: string, quantity: number): Promise<ContractItem>;
    delete(id: string): Promise<void>;
    deleteByContractId(contractId: string): Promise<void>;
}
