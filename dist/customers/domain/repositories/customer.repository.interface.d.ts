import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Customer } from '../entities/customer.entity';
export interface ICustomerRepository extends IBaseRepository<Customer> {
    findByDocument(documentNumber: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    findByUserId(userId: string): Promise<Customer | null>;
    findTopCustomers(limit: number): Promise<Customer[]>;
    findBirthdaysInMonth(month: number): Promise<Customer[]>;
    updateLoyaltyPoints(id: string, points: number): Promise<Customer>;
}
