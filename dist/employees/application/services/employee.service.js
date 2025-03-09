"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
const common_2 = require("@nestjs/common");
let EmployeeService = class EmployeeService extends base_service_1.BaseService {
    constructor(employeeRepository) {
        super(employeeRepository);
        this.employeeRepository = employeeRepository;
    }
    async findAll() {
        return this.employeeRepository.findAll();
    }
    async findByCpf(cpf) {
        const employee = await this.employeeRepository.findByCpf(cpf);
        if (!employee) {
            throw new common_2.NotFoundException(`Funcionário com CPF ${cpf} não encontrado`);
        }
        return employee;
    }
    async findByUserId(userId) {
        const employee = await this.employeeRepository.findByUserId(userId);
        if (!employee) {
            throw new common_2.NotFoundException(`Funcionário com ID de usuário ${userId} não encontrado`);
        }
        return employee;
    }
    async findTopPerformers(minRate = 80) {
        return this.employeeRepository.findByPerformanceAbove(minRate);
    }
    async create(createEmployeeDto) {
        const existingEmployee = await this.employeeRepository.findByCpf(createEmployeeDto.cpf);
        if (existingEmployee) {
            throw new common_2.BadRequestException(`Já existe um funcionário com o CPF ${createEmployeeDto.cpf}`);
        }
        const existingEmployeeUser = await this.employeeRepository.findByUserId(createEmployeeDto.userId);
        if (existingEmployeeUser) {
            throw new common_2.BadRequestException(`Já existe um funcionário associado ao usuário informado`);
        }
        return this.employeeRepository.create(createEmployeeDto);
    }
    async update(id, updateEmployeeDto) {
        await this.findById(id);
        return this.employeeRepository.update(id, updateEmployeeDto);
    }
    async updatePerformance(id, rate) {
        if (rate < 0 || rate > 100) {
            throw new common_2.BadRequestException('A taxa de desempenho deve estar entre 0 e 100');
        }
        return this.update(id, { performanceRate: rate });
    }
    async delete(id) {
        await this.findById(id);
        return this.employeeRepository.delete(id);
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IEmployeeRepository')),
    __metadata("design:paramtypes", [Object])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map