import { ContractStatus } from '../../domain/entities/contract.entity';
import { ContractItemDto, CreateContractItemDto } from './contract-item.dto';
import { PaymentDto } from './payment.dto';
export declare class CreateContractDto {
    customerId: string;
    employeeId: string;
    eventId?: string;
    fittingDate?: Date;
    pickupDate: Date;
    returnDate: Date;
    status?: ContractStatus;
    depositAmount?: number;
    specialConditions?: string;
    observations?: string;
    items: CreateContractItemDto[];
}
export declare class UpdateContractDto {
    customerId?: string;
    employeeId?: string;
    eventId?: string;
    fittingDate?: Date;
    pickupDate?: Date;
    returnDate?: Date;
    status?: ContractStatus;
    depositAmount?: number;
    specialConditions?: string;
    observations?: string;
}
export declare class ContractResponseDto {
    id: string;
    customerId: string;
    employeeId: string;
    eventId?: string;
    contractNumber: string;
    fittingDate?: Date;
    pickupDate: Date;
    returnDate: Date;
    status: ContractStatus;
    totalAmount: number;
    depositAmount?: number;
    specialConditions?: string;
    observations?: string;
    items?: ContractItemDto[];
    payments?: PaymentDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class ContractStatsDto {
    month: number;
    year: number;
    count: number;
}
export declare class ContractRevenueDto {
    month: number;
    year: number;
    total: number;
}
