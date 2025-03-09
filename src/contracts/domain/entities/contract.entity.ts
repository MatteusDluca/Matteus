// src/contracts/domain/entities/contract.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Customer } from '../../../customers/domain/entities/customer.entity';
import { Employee } from '../../../employees/domain/entities/employee.entity';
import { Event } from '../../../events/domain/entities/event.entity';
import { ContractItem } from './contract-item.entity';
import { Payment } from './payment.entity';

export enum ContractStatus {
  DRAFT = 'DRAFT',
  FITTING_SCHEDULED = 'FITTING_SCHEDULED',
  SIGNED = 'SIGNED',
  PAID = 'PAID',
  PICKED_UP = 'PICKED_UP',
  RETURNED = 'RETURNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  LATE = 'LATE',
}

export class Contract extends BaseEntity {
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

  // Relacionamentos
  customer?: Customer;
  employee?: Employee;
  event?: Event;
  items?: ContractItem[];
  payments?: Payment[];
}
