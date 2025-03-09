// src/contracts/domain/repositories/contract.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Contract, ContractStatus } from '../entities/contract.entity';

export interface IContractRepository extends IBaseRepository<Contract> {
  findByContractNumber(contractNumber: string): Promise<Contract | null>;
  findByCustomerId(customerId: string): Promise<Contract[]>;
  findByEmployeeId(employeeId: string): Promise<Contract[]>;
  findByEventId(eventId: string): Promise<Contract[]>;
  findByStatus(status: ContractStatus): Promise<Contract[]>;
  findLateContracts(): Promise<Contract[]>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    field: 'pickupDate' | 'returnDate',
  ): Promise<Contract[]>;
  updateStatus(id: string, status: ContractStatus): Promise<Contract>;
  calculateTotalAmount(id: string): Promise<number>;
  countContractsByMonthYear(): Promise<{ month: number; year: number; count: number }[]>;
  sumContractValuesByMonthYear(): Promise<{ month: number; year: number; total: number }[]>;
}
