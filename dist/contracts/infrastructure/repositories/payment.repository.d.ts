import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class PaymentRepository implements IPaymentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapToPayment;
    findAll(): Promise<Payment[]>;
    findById(id: string): Promise<Payment | null>;
    findByContractId(contractId: string): Promise<Payment[]>;
    findByStatus(status: PaymentStatus): Promise<Payment[]>;
    create(data: Partial<Payment>): Promise<Payment>;
    update(id: string, data: Partial<Payment>): Promise<Payment>;
    updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
    markAsPaid(id: string): Promise<Payment>;
    sumPaymentsByContractId(contractId: string): Promise<number>;
    delete(id: string): Promise<void>;
}
