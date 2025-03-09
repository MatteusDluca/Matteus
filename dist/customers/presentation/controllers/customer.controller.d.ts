import { CustomerService } from '../../application/services/customer.service';
import { CreateCustomerDto, UpdateCustomerDto, UpdateLoyaltyPointsDto, BodyMeasurementsDto } from '../../application/dtos/customer.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    findAll(): Promise<import("../../domain/entities/customer.entity").Customer[]>;
    findTopCustomers(limit?: number): Promise<import("../../domain/entities/customer.entity").Customer[]>;
    findBirthdaysInMonth(month: number): Promise<import("../../domain/entities/customer.entity").Customer[]>;
    findOne(id: string): Promise<import("../../domain/entities/customer.entity").Customer>;
    findByDocument(documentNumber: string): Promise<import("../../domain/entities/customer.entity").Customer>;
    findByEmail(email: string): Promise<import("../../domain/entities/customer.entity").Customer>;
    findByUserId(userId: string): Promise<import("../../domain/entities/customer.entity").Customer>;
    create(createCustomerDto: CreateCustomerDto): Promise<import("../../domain/entities/customer.entity").Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<import("../../domain/entities/customer.entity").Customer>;
    updateLoyaltyPoints(id: string, updateLoyaltyPointsDto: UpdateLoyaltyPointsDto): Promise<import("../../domain/entities/customer.entity").Customer>;
    updateBodyMeasurements(id: string, bodyMeasurementsDto: BodyMeasurementsDto): Promise<import("../../domain/entities/customer.entity").Customer>;
    remove(id: string): Promise<void>;
}
