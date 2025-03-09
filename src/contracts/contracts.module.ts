import { Module } from '@nestjs/common';
import { ContractController } from './presentation/controllers/contract.controller';
import { ContractItemController } from './presentation/controllers/contract-item.controller';
import { PaymentController } from './presentation/controllers/payment.controller';
import { NotificationController } from './presentation/controllers/notification.controller';
import { ContractService } from './application/services/contract.service';
import { ContractItemService } from './application/services/contract-item.service';
import { PaymentService } from './application/services/payment.service';
import { NotificationService } from './application/services/notification.service';
import { ContractRepository } from './infrastructure/repositories/contract.repository';
import { ContractItemRepository } from './infrastructure/repositories/contract-item.repository';
import { PaymentRepository } from './infrastructure/repositories/payment.repository';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomersModule } from '../customers/customers.module';
import { ProductRepository } from 'src/inventory/infrastructure/repositories/product.repository';
import { CustomerRepository } from 'src/customers/infrastructure/repositories/customer.repository';

@Module({
  imports: [PrismaModule, InventoryModule, CustomersModule],
  controllers: [
    ContractController,
    ContractItemController,
    PaymentController,
    NotificationController,
  ],
  providers: [
    ContractService,
    ContractItemService,
    PaymentService,
    NotificationService,
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
