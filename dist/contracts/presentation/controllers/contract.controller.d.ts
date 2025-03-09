import { ContractService } from '../../application/services/contract.service';
import { CreateContractDto, UpdateContractDto } from '../../application/dtos/contract.dto';
import { ContractStatus } from '../../domain/entities/contract.entity';
export declare class ContractController {
    private readonly contractService;
    constructor(contractService: ContractService);
    findAll(): Promise<import("../../domain/entities/contract.entity").Contract[]>;
    getContractStats(): Promise<{
        month: number;
        year: number;
        count: number;
    }[]>;
    getRevenueStats(): Promise<{
        month: number;
        year: number;
        total: number;
    }[]>;
    findByContractNumber(contractNumber: string): Promise<import("../../domain/entities/contract.entity").Contract>;
    findByCustomerId(customerId: string): Promise<import("../../domain/entities/contract.entity").Contract[]>;
    findByEmployeeId(employeeId: string): Promise<import("../../domain/entities/contract.entity").Contract[]>;
    findByEventId(eventId: string): Promise<import("../../domain/entities/contract.entity").Contract[]>;
    findByStatus(status: ContractStatus): Promise<import("../../domain/entities/contract.entity").Contract[]>;
    findLateContracts(): Promise<import("../../domain/entities/contract.entity").Contract[]>;
    findByDateRange(startDate: Date, endDate: Date, field: 'pickupDate' | 'returnDate'): Promise<import("../../domain/entities/contract.entity").Contract[]>;
    findOne(id: string): Promise<import("../../domain/entities/contract.entity").Contract>;
    create(createContractDto: CreateContractDto): Promise<import("../../domain/entities/contract.entity").Contract>;
    update(id: string, updateContractDto: UpdateContractDto): Promise<import("../../domain/entities/contract.entity").Contract>;
    updateStatus(id: string, status: ContractStatus): Promise<import("../../domain/entities/contract.entity").Contract>;
    remove(id: string): Promise<void>;
}
