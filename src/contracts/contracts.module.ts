// src/contracts/contracts.module.ts
import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employees/employees.module';
import { CustomersModule } from '../customers/customers.module';
import { InventoryModule } from '../inventory/inventory.module';
import { EventsModule } from '../events/events.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { PDFModule } from '../shared/infrastructure/pdf/pdf.module';
import { ContractController } from './presentation/controllers/contract.controller';
import { ContractItemController } from './presentation/controllers/contract-item.controller';
import { PaymentController } from './presentation/controllers/payment.controller';
import { NotificationController } from './presentation/controllers/notification.controller';
import { ContractPDFController } from './presentation/controllers/contract-pdf.controller';
import { ContractService } from './application/services/contract.service';
import { ContractItemService } from './application/services/contract-item.service';
import { PaymentService } from './application/services/payment.service';
import { NotificationService } from './application/services/notification.service';
import { ContractRepository } from './infrastructure/repositories/contract.repository';
import { ContractItemRepository } from './infrastructure/repositories/contract-item.repository';
import { PaymentRepository } from './infrastructure/repositories/payment.repository';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';
import { ContractPDFFactory } from './infrastructure/factories/contract-pdf.factory';
import { ProductRepository } from 'src/inventory/infrastructure/repositories/product.repository';
import { CustomerRepository } from 'src/customers/infrastructure/repositories/customer.repository';

@Module({
  imports: [PrismaModule, InventoryModule, CustomersModule, PDFModule],
  controllers: [
    ContractController,
    ContractItemController,
    PaymentController,
    NotificationController,
    ContractPDFController,
  ],
  providers: [
    ContractService,
    ContractItemService,
    PaymentService,
    NotificationService,
    ContractPDFFactory,
    {
      provide: 'IContractRepository',
      useClass: ContractRepository,
    },
    {
      provide: 'IContractItemRepository',
      useClass: ContractItemRepository,
    },
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
  exports: [ContractService, ContractItemService, PaymentService, NotificationService],
})
export class ContractsModule {}
