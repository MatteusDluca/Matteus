import { PaymentMethod, PaymentStatus } from '../../domain/entities/payment.entity';
export declare class CreatePaymentDto {
    contractId: string;
    amount: number;
    method: PaymentMethod;
    status?: PaymentStatus;
    installments?: number;
    reference?: string;
    paidAt?: Date;
    dueDate?: Date;
}
export declare class UpdatePaymentDto {
    amount?: number;
    method?: PaymentMethod;
    status?: PaymentStatus;
    installments?: number;
    reference?: string;
    paidAt?: Date;
    dueDate?: Date;
}
export declare class PaymentDto {
    id: string;
    contractId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    installments: number;
    reference?: string;
    paidAt?: Date;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
