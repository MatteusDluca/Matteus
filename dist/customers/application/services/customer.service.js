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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
let CustomerService = class CustomerService extends base_service_1.BaseService {
    constructor(customerRepository) {
        super(customerRepository);
        this.customerRepository = customerRepository;
    }
    async findAll() {
        return this.customerRepository.findAll();
    }
    async findByDocument(documentNumber) {
        const customer = await this.customerRepository.findByDocument(documentNumber);
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente com documento ${documentNumber} não encontrado`);
        }
        return customer;
    }
    async findByEmail(email) {
        const customer = await this.customerRepository.findByEmail(email);
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente com email ${email} não encontrado`);
        }
        return customer;
    }
    async findByUserId(userId) {
        const customer = await this.customerRepository.findByUserId(userId);
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente com ID de usuário ${userId} não encontrado`);
        }
        return customer;
    }
    async findTopCustomers(limit = 10) {
        return this.customerRepository.findTopCustomers(limit);
    }
    async findBirthdaysInMonth(month) {
        if (month < 1 || month > 12) {
            throw new common_1.BadRequestException('Mês deve estar entre 1 e 12');
        }
        return this.customerRepository.findBirthdaysInMonth(month);
    }
    async create(data) {
        const createCustomerDto = data;
        const existingCustomer = await this.customerRepository.findByDocument(createCustomerDto.documentNumber);
        if (existingCustomer) {
            throw new common_1.BadRequestException(`Já existe um cliente com o documento ${createCustomerDto.documentNumber}`);
        }
        if (createCustomerDto.userId) {
            const existingCustomerUser = await this.customerRepository.findByUserId(createCustomerDto.userId);
            if (existingCustomerUser) {
                throw new common_1.BadRequestException(`Já existe um cliente associado ao usuário informado`);
            }
        }
        let bodyMeasurements;
        if (createCustomerDto.bodyMeasurements) {
            bodyMeasurements = this.convertToBodyMeasurements(createCustomerDto.bodyMeasurements);
        }
        return this.customerRepository.create(Object.assign(Object.assign({}, createCustomerDto), { bodyMeasurements, loyaltyPoints: 0 }));
    }
    async update(id, data) {
        await this.findById(id);
        const updateCustomerDto = data;
        let bodyMeasurements;
        if (updateCustomerDto.bodyMeasurements) {
            bodyMeasurements = this.convertToBodyMeasurements(updateCustomerDto.bodyMeasurements);
            const updatedData = Object.assign(Object.assign({}, updateCustomerDto), { bodyMeasurements });
            return this.customerRepository.update(id, updatedData);
        }
        return this.customerRepository.update(id, updateCustomerDto);
    }
    async updateLoyaltyPoints(id, points) {
        await this.findById(id);
        return this.customerRepository.updateLoyaltyPoints(id, points);
    }
    async updateBodyMeasurements(id, bodyMeasurementsDto) {
        const customer = await this.findById(id);
        const bodyMeasurements = this.convertToBodyMeasurements(bodyMeasurementsDto);
        const currentMeasurements = customer.bodyMeasurements || {};
        const updatedMeasurements = Object.assign(Object.assign({}, currentMeasurements), bodyMeasurements);
        return this.customerRepository.update(id, { bodyMeasurements: updatedMeasurements });
    }
    async delete(id) {
        await this.findById(id);
        return this.customerRepository.delete(id);
    }
    convertToBodyMeasurements(dto) {
        const result = {};
        for (const key in dto) {
            if (Object.prototype.hasOwnProperty.call(dto, key)) {
                result[key] = dto[key];
            }
        }
        return result;
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ICustomerRepository')),
    __metadata("design:paramtypes", [Object])
], CustomerService);
//# sourceMappingURL=customer.service.js.map