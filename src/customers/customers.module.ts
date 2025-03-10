// src/customers/customers.module.ts
import { Module } from '@nestjs/common';
import { CustomerController } from './presentation/controllers/customer.controller';
import { CustomerPDFController } from './presentation/controllers/customer-pdf.controller';
import { CustomerService } from './application/services/customer.service';
import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { CustomerPDFFactory } from './infrastructure/factories/customer-pdf.factory';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { PDFModule } from '../shared/infrastructure/pdf/pdf.module';

@Module({
  imports: [PrismaModule, PDFModule],
  controllers: [CustomerController, CustomerPDFController],
  providers: [
    CustomerService,
    CustomerPDFFactory,
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
  exports: [CustomerService],
})
export class CustomersModule {}
