import { Employee } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class EmployeeRepository implements IEmployeeRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Employee[]>;
    findById(id: string): Promise<Employee | null>;
    findByCpf(cpf: string): Promise<Employee | null>;
    findByUserId(userId: string): Promise<Employee | null>;
    findByPerformanceAbove(rate: number): Promise<Employee[]>;
    create(data: Partial<Employee>): Promise<Employee>;
    update(id: string, data: Partial<Employee>): Promise<Employee>;
    delete(id: string): Promise<void>;
}
