"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const product_controller_1 = require("./presentation/controllers/product.controller");
const category_controller_1 = require("./presentation/controllers/category.controller");
const product_image_controller_1 = require("./presentation/controllers/product-image.controller");
const maintenance_log_controller_1 = require("./presentation/controllers/maintenance-log.controller");
const product_service_1 = require("./application/services/product.service");
const category_service_1 = require("./application/services/category.service");
const product_image_service_1 = require("./application/services/product-image.service");
const maintenance_log_service_1 = require("./application/services/maintenance-log.service");
const product_repository_1 = require("./infrastructure/repositories/product.repository");
const category_repository_1 = require("./infrastructure/repositories/category.repository");
const product_image_repository_1 = require("./infrastructure/repositories/product-image.repository");
const maintenance_log_repository_1 = require("./infrastructure/repositories/maintenance-log.repository");
const prisma_module_1 = require("../shared/infrastructure/prisma/prisma.module");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [
            product_controller_1.ProductController,
            category_controller_1.CategoryController,
            product_image_controller_1.ProductImageController,
            maintenance_log_controller_1.MaintenanceLogController,
        ],
        providers: [
            product_service_1.ProductService,
            category_service_1.CategoryService,
            product_image_service_1.ProductImageService,
            maintenance_log_service_1.MaintenanceLogService,
            {
                provide: 'IProductRepository',
                useClass: product_repository_1.ProductRepository,
            },
            {
                provide: 'ICategoryRepository',
                useClass: category_repository_1.CategoryRepository,
            },
            {
                provide: 'IProductImageRepository',
                useClass: product_image_repository_1.ProductImageRepository,
            },
            {
                provide: 'IMaintenanceLogRepository',
                useClass: maintenance_log_repository_1.MaintenanceLogRepository,
            },
        ],
        exports: [
            product_service_1.ProductService,
            category_service_1.CategoryService,
            product_image_service_1.ProductImageService,
            maintenance_log_service_1.MaintenanceLogService,
            'IProductRepository',
            'ICategoryRepository',
            'IProductImageRepository',
            'IMaintenanceLogRepository',
        ],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map