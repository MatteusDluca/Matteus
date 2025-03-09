import { Contract, ContractStatus } from '../../domain/entities/contract.entity';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { IContractItemRepository } from '../../domain/repositories/contract-item.repository.interface';
import { CreateContractDto, UpdateContractDto } from '../dtos/contract.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../../inventory/domain/repositories/product.repository.interface';
import { NotificationService } from './notification.service';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface';
export declare class ContractService extends BaseService<Contract> {
    private readonly contractRepository;
    private readonly contractItemRepository;
    private readonly productRepository;
    private readonly customerRepository;
    private readonly notificationService;
    constructor(contractRepository: IContractRepository, contractItemRepository: IContractItemRepository, productRepository: IProductRepository, customerRepository: ICustomerRepository, notificationService: NotificationService);
    findAll(): Promise<Contract[]>;
    findByContractNumber(contractNumber: string): Promise<Contract>;
    findByCustomerId(customerId: string): Promise<Contract[]>;
    findByEmployeeId(employeeId: string): Promise<Contract[]>;
    findByEventId(eventId: string): Promise<Contract[]>;
    findByStatus(status: ContractStatus): Promise<Contract[]>;
    findLateContracts(): Promise<Contract[]>;
    findByDateRange(startDate: Date, endDate: Date, field: 'pickupDate' | 'returnDate'): Promise<Contract[]>;
    create(data: Partial<Contract> | CreateContractDto): Promise<Contract>;
    update(id: string, updateContractDto: UpdateContractDto): Promise<Contract>;
    updateStatus(id: string, status: ContractStatus): Promise<Contract>;
    calculateTotalAmount(id: string): Promise<number>;
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
    delete(id: string): Promise<void>;
    private validateStatusTransition;
    private executeStatusActions;
}
