"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const customer_controller_1 = require("./presentation/controllers/customer.controller");
const customer_pdf_controller_1 = require("./presentation/controllers/customer-pdf.controller");
const customer_service_1 = require("./application/services/customer.service");
const customer_repository_1 = require("./infrastructure/repositories/customer.repository");
const customer_pdf_factory_1 = require("./infrastructure/factories/customer-pdf.factory");
const prisma_module_1 = require("../shared/infrastructure/prisma/prisma.module");
const pdf_module_1 = require("../shared/infrastructure/pdf/pdf.module");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, pdf_module_1.PDFModule],
        controllers: [customer_controller_1.CustomerController, customer_pdf_controller_1.CustomerPDFController],
        providers: [
            customer_service_1.CustomerService,
            customer_pdf_factory_1.CustomerPDFFactory,
            {
                provide: 'ICustomerRepository',
                useClass: customer_repository_1.CustomerRepository,
            },
        ],
        exports: [customer_service_1.CustomerService],
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map