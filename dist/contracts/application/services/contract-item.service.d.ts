import { ContractItem } from '../../domain/entities/contract-item.entity';
import { IContractItemRepository } from '../../domain/repositories/contract-item.repository.interface';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { IProductRepository } from '../../../inventory/domain/repositories/product.repository.interface';
import { CreateContractItemDto, UpdateContractItemDto } from '../dtos/contract-item.dto';
import { BaseService } from '../../../shared/application/services/base.service';
export declare class ContractItemService extends BaseService<ContractItem> {
    private readonly contractItemRepository;
    private readonly contractRepository;
    private readonly productRepository;
    constructor(contractItemRepository: IContractItemRepository, contractRepository: IContractRepository, productRepository: IProductRepository);
    findAll(): Promise<ContractItem[]>;
    findByContractId(contractId: string): Promise<ContractItem[]>;
    findByProductId(productId: string): Promise<ContractItem[]>;
    create(createContractItemDto: CreateContractItemDto): Promise<ContractItem>;
    update(id: string, updateContractItemDto: UpdateContractItemDto): Promise<ContractItem>;
    delete(id: string): Promise<void>;
}
