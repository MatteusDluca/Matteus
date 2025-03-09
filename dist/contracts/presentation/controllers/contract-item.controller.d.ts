import { ContractItemService } from '../../application/services/contract-item.service';
import { CreateContractItemDto, UpdateContractItemDto } from '../../application/dtos/contract-item.dto';
export declare class ContractItemController {
    private readonly contractItemService;
    constructor(contractItemService: ContractItemService);
    findByContractId(contractId: string): Promise<import("../../domain/entities/contract-item.entity").ContractItem[]>;
    findByProductId(productId: string): Promise<import("../../domain/entities/contract-item.entity").ContractItem[]>;
    findOne(id: string): Promise<import("../../domain/entities/contract-item.entity").ContractItem>;
    create(createContractItemDto: CreateContractItemDto): Promise<import("../../domain/entities/contract-item.entity").ContractItem>;
    update(id: string, updateContractItemDto: UpdateContractItemDto): Promise<import("../../domain/entities/contract-item.entity").ContractItem>;
    remove(id: string): Promise<void>;
}
