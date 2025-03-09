// src/employees/application/services/employee.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Employee } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { BaseService } from '../../../shared/application/services/base.service';
// Adicionar nas primeiras linhas do arquivo (linha 1-2)
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';

@Injectable()
export class EmployeeService extends BaseService<Employee> {
  constructor(
    @Inject('IEmployeeRepository') private readonly employeeRepository: IEmployeeRepository,
  ) {
    super(employeeRepository);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.findAll();
  }

  async findByCpf(cpf: string): Promise<Employee> {
    const employee = await this.employeeRepository.findByCpf(cpf);
    if (!employee) {
      throw new NotFoundException(`Funcionário com CPF ${cpf} não encontrado`);
    }
    return employee;
  }

  async findByUserId(userId: string): Promise<Employee> {
    const employee = await this.employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException(`Funcionário com ID de usuário ${userId} não encontrado`);
    }
    return employee;
  }

  async findTopPerformers(minRate = 80): Promise<Employee[]> {
    return this.employeeRepository.findByPerformanceAbove(minRate);
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Verificar se já existe um funcionário com o mesmo CPF
    const existingEmployee = await this.employeeRepository.findByCpf(createEmployeeDto.cpf);
    if (existingEmployee) {
      throw new BadRequestException(`Já existe um funcionário com o CPF ${createEmployeeDto.cpf}`);
    }

    // Verificar se já existe um funcionário com o mesmo userId
    const existingEmployeeUser = await this.employeeRepository.findByUserId(
      createEmployeeDto.userId,
    );
    if (existingEmployeeUser) {
      throw new BadRequestException(`Já existe um funcionário associado ao usuário informado`);
    }

    return this.employeeRepository.create(createEmployeeDto);
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    // Verificar se o funcionário existe
    await this.findById(id);

    return this.employeeRepository.update(id, updateEmployeeDto);
  }

  async updatePerformance(id: string, rate: number): Promise<Employee> {
    if (rate < 0 || rate > 100) {
      throw new BadRequestException('A taxa de desempenho deve estar entre 0 e 100');
    }

    return this.update(id, { performanceRate: rate });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.employeeRepository.delete(id);
  }
}
