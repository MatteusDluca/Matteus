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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
let EmployeeRepository = class EmployeeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const employees = await this.prisma.employee.findMany({
            orderBy: { name: 'asc' },
        });
        return employees;
    }
    async findById(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
        });
        return employee;
    }
    async findByCpf(cpf) {
        const employee = await this.prisma.employee.findUnique({
            where: { cpf },
        });
        return employee;
    }
    async findByUserId(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
        });
        return employee;
    }
    async findByPerformanceAbove(rate) {
        const employees = await this.prisma.employee.findMany({
            where: {
                performanceRate: {
                    gte: rate,
                },
            },
            orderBy: {
                performanceRate: 'desc',
            },
        });
        return employees;
    }
    async create(data) {
        if (!data.userId ||
            !data.name ||
            !data.cpf ||
            !data.phone ||
            !data.address ||
            !data.city ||
            !data.state ||
            !data.zipCode ||
            !data.position ||
            !data.salary ||
            !data.hireDate ||
            !data.workingHours) {
            throw new Error('Campos obrigatórios não podem ser undefined');
        }
        const salary = new client_1.Prisma.Decimal(data.salary);
        const performanceRate = data.performanceRate !== undefined
            ? new client_1.Prisma.Decimal(data.performanceRate)
            : null;
        const employee = await this.prisma.employee.create({
            data: {
                userId: data.userId,
                name: data.name,
                cpf: data.cpf,
                phone: data.phone,
                address: data.address,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                position: data.position,
                salary: salary,
                hireDate: data.hireDate,
                workingHours: data.workingHours,
                performanceRate: performanceRate,
            },
        });
        return employee;
    }
    async update(id, data) {
        const updateData = Object.assign({}, data);
        if (data.salary !== undefined) {
            updateData.salary = new client_1.Prisma.Decimal(data.salary);
        }
        if (data.performanceRate !== undefined) {
            updateData.performanceRate = new client_1.Prisma.Decimal(data.performanceRate);
        }
        const employee = await this.prisma.employee.update({
            where: { id },
            data: updateData,
        });
        return employee;
    }
    async delete(id) {
        await this.prisma.employee.delete({
            where: { id },
        });
    }
};
exports.EmployeeRepository = EmployeeRepository;
exports.EmployeeRepository = EmployeeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeRepository);
//# sourceMappingURL=employee.repository.js.map