// src/contracts/domain/entities/payment.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Decimal } from '@prisma/client/runtime/library';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PIX = 'PIX',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export class Payment extends BaseEntity {
  contractId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  installments: number;
  reference?: string;
  paidAt?: Date;
  dueDate?: Date;
}
