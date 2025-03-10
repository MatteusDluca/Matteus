"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesModule = void 0;
const common_1 = require("@nestjs/common");
const employee_controller_1 = require("./presentation/controllers/employee.controller");
const employee_service_1 = require("./application/services/employee.service");
const employee_repository_1 = require("./infrastructure/repositories/employee.repository");
const prisma_module_1 = require("../shared/infrastructure/prisma/prisma.module");
const pdf_module_1 = require("../shared/infrastructure/pdf/pdf.module");
let EmployeesModule = class EmployeesModule {
};
exports.EmployeesModule = EmployeesModule;
exports.EmployeesModule = EmployeesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, pdf_module_1.PDFModule],
        controllers: [employee_controller_1.EmployeeController],
        providers: [
            employee_service_1.EmployeeService,
            {
                provide: 'IEmployeeRepository',
                useClass: employee_repository_1.EmployeeRepository,
            },
        ],
        exports: [employee_service_1.EmployeeService],
    })
], EmployeesModule);
//# sourceMappingURL=employees.module.js.map