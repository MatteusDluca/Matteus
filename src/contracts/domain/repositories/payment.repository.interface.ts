// src/contracts/domain/repositories/payment.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Payment, PaymentStatus } from '../entities/payment.entity';

export interface IPaymentRepository extends IBaseRepository<Payment> {
  findByContractId(contractId: string): Promise<Payment[]>;
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
  sumPaymentsByContractId(contractId: string): Promise<number>;
  markAsPaid(id: string): Promise<Payment>;
}
