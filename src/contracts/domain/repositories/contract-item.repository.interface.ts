// src/contracts/domain/repositories/contract-item.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { ContractItem } from '../entities/contract-item.entity';

export interface IContractItemRepository extends IBaseRepository<ContractItem> {
  findByContractId(contractId: string): Promise<ContractItem[]>;
  findByProductId(productId: string): Promise<ContractItem[]>;
  updateQuantity(id: string, quantity: number): Promise<ContractItem>;
  createBulk(items: Partial<ContractItem>[]): Promise<ContractItem[]>;
  deleteByContractId(contractId: string): Promise<void>;
}
