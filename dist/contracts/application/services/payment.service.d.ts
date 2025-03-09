import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { CreatePaymentDto, UpdatePaymentDto } from '../dtos/payment.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { NotificationService } from './notification.service';
export declare class PaymentService extends BaseService<Payment> {
    private readonly paymentRepository;
    private readonly contractRepository;
    private readonly notificationService;
    constructor(paymentRepository: IPaymentRepository, contractRepository: IContractRepository, notificationService: NotificationService);
    findAll(): Promise<Payment[]>;
    findByContractId(contractId: string): Promise<Payment[]>;
    findByStatus(status: PaymentStatus): Promise<Payment[]>;
    create(data: Partial<Payment> | CreatePaymentDto): Promise<Payment>;
    update(id: string, data: Partial<Payment> | UpdatePaymentDto): Promise<Payment>;
    markAsPaid(id: string): Promise<Payment>;
    delete(id: string): Promise<void>;
    private checkContractFullyPaid;
}
