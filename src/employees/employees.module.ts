// src/employees/employees.module.ts
import { Module } from '@nestjs/common';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { EmployeeService } from './application/services/employee.service';
import { EmployeeRepository } from './infrastructure/repositories/employee.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { PDFModule } from '../shared/infrastructure/pdf/pdf.module';

@Module({
  imports: [PrismaModule, PDFModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
  ],
  exports: [EmployeeService],
})
export class EmployeesModule {}
