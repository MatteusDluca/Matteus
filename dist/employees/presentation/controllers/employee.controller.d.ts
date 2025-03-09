import { EmployeeService } from '../../application/services/employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../application/dtos/employee.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    findAll(): Promise<import("../../domain/entities/employee.entity").Employee[]>;
    findTopPerformers(minRate?: number): Promise<import("../../domain/entities/employee.entity").Employee[]>;
    findOne(id: string): Promise<import("../../domain/entities/employee.entity").Employee>;
    findByCpf(cpf: string): Promise<import("../../domain/entities/employee.entity").Employee>;
    findByUserId(userId: string): Promise<import("../../domain/entities/employee.entity").Employee>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<import("../../domain/entities/employee.entity").Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<import("../../domain/entities/employee.entity").Employee>;
    updatePerformance(id: string, rate: number): Promise<import("../../domain/entities/employee.entity").Employee>;
    remove(id: string): Promise<void>;
}
