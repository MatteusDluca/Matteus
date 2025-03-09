// src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { ProductController } from './presentation/controllers/product.controller';
import { CategoryController } from './presentation/controllers/category.controller';
import { ProductImageController } from './presentation/controllers/product-image.controller';
import { MaintenanceLogController } from './presentation/controllers/maintenance-log.controller';
import { ProductService } from './application/services/product.service';
import { CategoryService } from './application/services/category.service';
import { ProductImageService } from './application/services/product-image.service';
import { MaintenanceLogService } from './application/services/maintenance-log.service';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { ProductImageRepository } from './infrastructure/repositories/product-image.repository';
import { MaintenanceLogRepository } from './infrastructure/repositories/maintenance-log.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    ProductController,
    CategoryController,
    ProductImageController,
    MaintenanceLogController,
  ],
  providers: [
    ProductService,
    CategoryService,
    ProductImageService,
    MaintenanceLogService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    {
      provide: 'IProductImageRepository',
      useClass: ProductImageRepository,
    },
    {
      provide: 'IMaintenanceLogRepository',
      useClass: MaintenanceLogRepository,
    },
  ],
  exports: [
    ProductService,
    CategoryService,
    ProductImageService,
    MaintenanceLogService,
    'IProductRepository',
    'ICategoryRepository',
    'IProductImageRepository',
    'IMaintenanceLogRepository',
  ],
})
export class InventoryModule {}
