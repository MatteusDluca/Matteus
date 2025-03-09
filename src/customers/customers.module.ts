// src/customers/customers.module.ts
import { Module } from '@nestjs/common';
import { CustomerController } from './presentation/controllers/customer.controller';
import { CustomerService } from './application/services/customer.service';
import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
  exports: [CustomerService],
})
export class CustomersModule {}
