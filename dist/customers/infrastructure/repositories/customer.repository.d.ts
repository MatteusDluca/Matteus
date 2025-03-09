import { Customer } from '../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class CustomerRepository implements ICustomerRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Customer[]>;
    findById(id: string): Promise<Customer | null>;
    findByDocument(documentNumber: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    findByUserId(userId: string): Promise<Customer | null>;
    findTopCustomers(limit: number): Promise<Customer[]>;
    findBirthdaysInMonth(month: number): Promise<Customer[]>;
    create(data: Partial<Customer>): Promise<Customer>;
    update(id: string, data: Partial<Customer>): Promise<Customer>;
    updateLoyaltyPoints(id: string, points: number): Promise<Customer>;
    delete(id: string): Promise<void>;
}
