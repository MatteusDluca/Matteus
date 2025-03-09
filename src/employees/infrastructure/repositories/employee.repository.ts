// src/employees/infrastructure/repositories/employee.repository.ts
import { Injectable } from '@nestjs/common';
import { Employee } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      orderBy: { name: 'asc' },
    });
    return employees as unknown as Employee[];
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });
    return employee as unknown as Employee | null;
  }

  async findByCpf(cpf: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { cpf },
    });
    return employee as unknown as Employee | null;
  }

  async findByUserId(userId: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });
    return employee as unknown as Employee | null;
  }

  async findByPerformanceAbove(rate: number): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      where: {
        performanceRate: {
          gte: rate,
        },
      },
      orderBy: {
        performanceRate: 'desc',
      },
    });
    return employees as unknown as Employee[];
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    if (
      !data.userId ||
      !data.name ||
      !data.cpf ||
      !data.phone ||
      !data.address ||
      !data.city ||
      !data.state ||
      !data.zipCode ||
      !data.position ||
      !data.salary ||
      !data.hireDate ||
      !data.workingHours
    ) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    const salary = new Prisma.Decimal(data.salary as unknown as string);
    const performanceRate =
      data.performanceRate !== undefined
        ? new Prisma.Decimal(data.performanceRate as unknown as string)
        : null;

    const employee = await this.prisma.employee.create({
      data: {
        userId: data.userId,
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        position: data.position,
        salary: salary as any,
        hireDate: data.hireDate,
        workingHours: data.workingHours,
        performanceRate: performanceRate as any,
      },
    });
    return employee as unknown as Employee;
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    const updateData: any = { ...data };

    if (data.salary !== undefined) {
      updateData.salary = new Prisma.Decimal(data.salary as unknown as string);
    }

    if (data.performanceRate !== undefined) {
      updateData.performanceRate = new Prisma.Decimal(data.performanceRate as unknown as string);
    }

    const employee = await this.prisma.employee.update({
      where: { id },
      data: updateData,
    });
    return employee as unknown as Employee;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.employee.delete({
      where: { id },
    });
  }
}
