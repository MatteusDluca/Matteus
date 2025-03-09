// src/employees/domain/repositories/employee.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Employee } from '../entities/employee.entity';

export interface IEmployeeRepository extends IBaseRepository<Employee> {
  findByCpf(cpf: string): Promise<Employee | null>;
  findByUserId(userId: string): Promise<Employee | null>;
  findByPerformanceAbove(rate: number): Promise<Employee[]>;
}
