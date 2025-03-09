import { Customer } from '../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CreateCustomerDto, UpdateCustomerDto, BodyMeasurementsDto } from '../dtos/customer.dto';
import { BaseService } from '../../../shared/application/services/base.service';
export declare class CustomerService extends BaseService<Customer> {
    private readonly customerRepository;
    constructor(customerRepository: ICustomerRepository);
    findAll(): Promise<Customer[]>;
    findByDocument(documentNumber: string): Promise<Customer>;
    findByEmail(email: string): Promise<Customer>;
    findByUserId(userId: string): Promise<Customer>;
    findTopCustomers(limit?: number): Promise<Customer[]>;
    findBirthdaysInMonth(month: number): Promise<Customer[]>;
    create(data: Partial<Customer> | CreateCustomerDto): Promise<Customer>;
    update(id: string, data: Partial<Customer> | UpdateCustomerDto): Promise<Customer>;
    updateLoyaltyPoints(id: string, points: number): Promise<Customer>;
    updateBodyMeasurements(id: string, bodyMeasurementsDto: BodyMeasurementsDto): Promise<Customer>;
    delete(id: string): Promise<void>;
    private convertToBodyMeasurements;
}
