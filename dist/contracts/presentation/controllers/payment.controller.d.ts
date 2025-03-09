import { PaymentService } from '../../application/services/payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from '../../application/dtos/payment.dto';
import { PaymentStatus } from '../../domain/entities/payment.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    findAll(): Promise<import("../../domain/entities/payment.entity").Payment[]>;
    findByContractId(contractId: string): Promise<import("../../domain/entities/payment.entity").Payment[]>;
    findByStatus(status: PaymentStatus): Promise<import("../../domain/entities/payment.entity").Payment[]>;
    findOne(id: string): Promise<import("../../domain/entities/payment.entity").Payment>;
    create(createPaymentDto: CreatePaymentDto): Promise<import("../../domain/entities/payment.entity").Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<import("../../domain/entities/payment.entity").Payment>;
    markAsPaid(id: string): Promise<import("../../domain/entities/payment.entity").Payment>;
    remove(id: string): Promise<void>;
}
