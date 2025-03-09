import { Employee } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { BaseService } from '../../../shared/application/services/base.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';
export declare class EmployeeService extends BaseService<Employee> {
    private readonly employeeRepository;
    constructor(employeeRepository: IEmployeeRepository);
    findAll(): Promise<Employee[]>;
    findByCpf(cpf: string): Promise<Employee>;
    findByUserId(userId: string): Promise<Employee>;
    findTopPerformers(minRate?: number): Promise<Employee[]>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    updatePerformance(id: string, rate: number): Promise<Employee>;
    delete(id: string): Promise<void>;
}
