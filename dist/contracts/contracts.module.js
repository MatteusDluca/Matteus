"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsModule = void 0;
const common_1 = require("@nestjs/common");
const contract_controller_1 = require("./presentation/controllers/contract.controller");
const contract_item_controller_1 = require("./presentation/controllers/contract-item.controller");
const payment_controller_1 = require("./presentation/controllers/payment.controller");
const notification_controller_1 = require("./presentation/controllers/notification.controller");
const contract_service_1 = require("./application/services/contract.service");
const contract_item_service_1 = require("./application/services/contract-item.service");
const payment_service_1 = require("./application/services/payment.service");
const notification_service_1 = require("./application/services/notification.service");
const contract_repository_1 = require("./infrastructure/repositories/contract.repository");
const contract_item_repository_1 = require("./infrastructure/repositories/contract-item.repository");
const payment_repository_1 = require("./infrastructure/repositories/payment.repository");
const notification_repository_1 = require("./infrastructure/repositories/notification.repository");
const prisma_module_1 = require("../shared/infrastructure/prisma/prisma.module");
const inventory_module_1 = require("../inventory/inventory.module");
const customers_module_1 = require("../customers/customers.module");
const product_repository_1 = require("../inventory/infrastructure/repositories/product.repository");
const customer_repository_1 = require("../customers/infrastructure/repositories/customer.repository");
let ContractsModule = class ContractsModule {
};
exports.ContractsModule = ContractsModule;
exports.ContractsModule = ContractsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, inventory_module_1.InventoryModule, customers_module_1.CustomersModule],
        controllers: [
            contract_controller_1.ContractController,
            contract_item_controller_1.ContractItemController,
            payment_controller_1.PaymentController,
            notification_controller_1.NotificationController,
        ],
        providers: [
            contract_service_1.ContractService,
            contract_item_service_1.ContractItemService,
            payment_service_1.PaymentService,
            notification_service_1.NotificationService,
            {
                provide: 'IContractRepository',
                useClass: contract_repository_1.ContractRepository,
            },
            {
                provide: 'IContractItemRepository',
                useClass: contract_item_repository_1.ContractItemRepository,
            },
            {
                provide: 'IPaymentRepository',
                useClass: payment_repository_1.PaymentRepository,
            },
            {
                provide: 'INotificationRepository',
                useClass: notification_repository_1.NotificationRepository,
            },
            {
                provide: 'IProductRepository',
                useClass: product_repository_1.ProductRepository,
            },
            {
                provide: 'ICustomerRepository',
                useClass: customer_repository_1.CustomerRepository,
            },
        ],
        exports: [contract_service_1.ContractService, contract_item_service_1.ContractItemService, payment_service_1.PaymentService, notification_service_1.NotificationService],
    })
], ContractsModule);
//# sourceMappingURL=contracts.module.js.map