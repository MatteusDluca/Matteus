import { Contract, ContractStatus } from '../../domain/entities/contract.entity';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class ContractRepository implements IContractRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Contract[]>;
    findById(id: string): Promise<Contract | null>;
    findByContractNumber(contractNumber: string): Promise<Contract | null>;
    findByCustomerId(customerId: string): Promise<Contract[]>;
    findByEmployeeId(employeeId: string): Promise<Contract[]>;
    findByEventId(eventId: string): Promise<Contract[]>;
    findByStatus(status: ContractStatus): Promise<Contract[]>;
    findLateContracts(): Promise<Contract[]>;
    findByDateRange(startDate: Date, endDate: Date, field: 'pickupDate' | 'returnDate'): Promise<Contract[]>;
    create(data: Partial<Contract>): Promise<Contract>;
    update(id: string, data: Partial<Contract>): Promise<Contract>;
    updateStatus(id: string, status: ContractStatus): Promise<Contract>;
    calculateTotalAmount(id: string): Promise<number>;
    countContractsByMonthYear(): Promise<{
        month: number;
        year: number;
        count: number;
    }[]>;
    sumContractValuesByMonthYear(): Promise<{
        month: number;
        year: number;
        total: number;
    }[]>;
    delete(id: string): Promise<void>;
}
