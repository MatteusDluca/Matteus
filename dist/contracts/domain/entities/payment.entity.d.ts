import { BaseEntity } from '../../../shared/domain/entities/base.entity';
export declare enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    CASH = "CASH",
    BANK_TRANSFER = "BANK_TRANSFER",
    PIX = "PIX"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare class Payment extends BaseEntity {
    contractId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    installments: number;
    reference?: string;
    paidAt?: Date;
    dueDate?: Date;
}
