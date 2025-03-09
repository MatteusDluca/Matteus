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
exports.ContractService = void 0;
const common_1 = require("@nestjs/common");
const contract_entity_1 = require("../../domain/entities/contract.entity");
const base_service_1 = require("../../../shared/application/services/base.service");
const product_entity_1 = require("../../../inventory/domain/entities/product.entity");
const notification_service_1 = require("./notification.service");
const notification_entity_1 = require("../../domain/entities/notification.entity");
let ContractService = class ContractService extends base_service_1.BaseService {
    constructor(contractRepository, contractItemRepository, productRepository, customerRepository, notificationService) {
        super(contractRepository);
        this.contractRepository = contractRepository;
        this.contractItemRepository = contractItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.notificationService = notificationService;
    }
    async findAll() {
        return this.contractRepository.findAll();
    }
    async findByContractNumber(contractNumber) {
        const contract = await this.contractRepository.findByContractNumber(contractNumber);
        if (!contract) {
            throw new common_1.NotFoundException(`Contrato com número ${contractNumber} não encontrado`);
        }
        return contract;
    }
    async findByCustomerId(customerId) {
        const customerExists = await this.customerRepository.findById(customerId);
        if (!customerExists) {
            throw new common_1.NotFoundException(`Cliente com ID ${customerId} não encontrado`);
        }
        return this.contractRepository.findByCustomerId(customerId);
    }
    async findByEmployeeId(employeeId) {
        return this.contractRepository.findByEmployeeId(employeeId);
    }
    async findByEventId(eventId) {
        return this.contractRepository.findByEventId(eventId);
    }
    async findByStatus(status) {
        return this.contractRepository.findByStatus(status);
    }
    async findLateContracts() {
        return this.contractRepository.findLateContracts();
    }
    async findByDateRange(startDate, endDate, field) {
        if (startDate > endDate) {
            throw new common_1.BadRequestException('A data inicial deve ser anterior à data final');
        }
        return this.contractRepository.findByDateRange(startDate, endDate, field);
    }
    async create(data) {
        const createContractDto = data;
        const customer = await this.customerRepository.findById(createContractDto.customerId);
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente com ID ${createContractDto.customerId} não encontrado`);
        }
        const year = new Date().getFullYear();
        const sequence = Math.floor(10000 + Math.random() * 90000);
        const contractNumber = `ARC-${year}-${sequence}`;
        const totalAmount = createContractDto.items.reduce((total, item) => total + item.quantity * (item.unitPrice || 0), 0);
        const items = [...createContractDto.items];
        const contractData = {
            customerId: createContractDto.customerId,
            employeeId: createContractDto.employeeId,
            eventId: createContractDto.eventId,
            contractNumber,
            fittingDate: createContractDto.fittingDate,
            pickupDate: createContractDto.pickupDate,
            returnDate: createContractDto.returnDate,
            totalAmount,
            status: createContractDto.status || contract_entity_1.ContractStatus.DRAFT,
            depositAmount: createContractDto.depositAmount,
            specialConditions: createContractDto.specialConditions,
            observations: createContractDto.observations,
        };
        const contract = await this.contractRepository.create(contractData);
        await this.contractItemRepository.createBulk(createContractDto.items.map((item) => ({
            contractId: contract.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
        })));
        for (const item of createContractDto.items) {
            const product = await this.productRepository.findById(item.productId);
            if (product) {
                await this.productRepository.update(item.productId, {
                    quantity: product.quantity - item.quantity,
                });
            }
        }
        await this.notificationService.create({
            customerId: contract.customerId,
            type: notification_entity_1.NotificationType.RESERVATION_CONFIRMATION,
            title: 'Reserva Confirmada',
            message: `Sua reserva foi confirmada com sucesso! Número do contrato: ${contractNumber}`,
        });
        if (contract.fittingDate) {
            const fittingDate = new Date(contract.fittingDate);
            await this.notificationService.create({
                customerId: contract.customerId,
                type: notification_entity_1.NotificationType.FITTING_REMINDER,
                title: 'Lembrete de Prova',
                message: `Sua prova está agendada para ${fittingDate.toLocaleDateString()} às ${fittingDate.toLocaleTimeString()}`,
            });
        }
        return this.findById(contract.id);
    }
    async update(id, updateContractDto) {
        const contract = await this.findById(id);
        if (contract.status === contract_entity_1.ContractStatus.COMPLETED ||
            contract.status === contract_entity_1.ContractStatus.CANCELLED) {
            throw new common_1.BadRequestException('Não é possível atualizar contratos finalizados ou cancelados');
        }
        const now = new Date();
        if (updateContractDto.fittingDate && updateContractDto.fittingDate < now) {
            throw new common_1.BadRequestException('A data da prova deve ser futura');
        }
        if (updateContractDto.pickupDate && updateContractDto.pickupDate < now) {
            throw new common_1.BadRequestException('A data de retirada deve ser futura');
        }
        if (updateContractDto.returnDate && updateContractDto.pickupDate) {
            if (updateContractDto.returnDate < updateContractDto.pickupDate) {
                throw new common_1.BadRequestException('A data de devolução deve ser posterior à data de retirada');
            }
        }
        else if (updateContractDto.returnDate && !updateContractDto.pickupDate) {
            if (updateContractDto.returnDate < contract.pickupDate) {
                throw new common_1.BadRequestException('A data de devolução deve ser posterior à data de retirada');
            }
        }
        else if (!updateContractDto.returnDate && updateContractDto.pickupDate) {
            if (contract.returnDate < updateContractDto.pickupDate) {
                throw new common_1.BadRequestException('A data de devolução deve ser posterior à data de retirada');
            }
        }
        return this.contractRepository.update(id, updateContractDto);
    }
    async updateStatus(id, status) {
        const contract = await this.findById(id);
        this.validateStatusTransition(contract.status, status);
        const updatedContract = await this.contractRepository.updateStatus(id, status);
        await this.executeStatusActions(updatedContract, status);
        return updatedContract;
    }
    async calculateTotalAmount(id) {
        await this.findById(id);
        return this.contractRepository.calculateTotalAmount(id);
    }
    async getContractStats() {
        return this.contractRepository.countContractsByMonthYear();
    }
    async getRevenueStats() {
        return this.contractRepository.sumContractValuesByMonthYear();
    }
    async delete(id) {
        const contract = await this.findById(id);
        if (contract.status !== contract_entity_1.ContractStatus.DRAFT) {
            throw new common_1.BadRequestException('Somente contratos em rascunho podem ser excluídos');
        }
        const items = await this.contractItemRepository.findByContractId(id);
        for (const item of items) {
            const product = await this.productRepository.findById(item.productId);
            if (product) {
                await this.productRepository.update(item.productId, {
                    quantity: product.quantity + item.quantity,
                });
            }
        }
        return this.contractRepository.delete(id);
    }
    validateStatusTransition(currentStatus, newStatus) {
        const allowedTransitions = {
            [contract_entity_1.ContractStatus.DRAFT]: [
                contract_entity_1.ContractStatus.FITTING_SCHEDULED,
                contract_entity_1.ContractStatus.SIGNED,
                contract_entity_1.ContractStatus.CANCELLED,
            ],
            [contract_entity_1.ContractStatus.FITTING_SCHEDULED]: [
                contract_entity_1.ContractStatus.SIGNED,
                contract_entity_1.ContractStatus.DRAFT,
                contract_entity_1.ContractStatus.CANCELLED,
            ],
            [contract_entity_1.ContractStatus.SIGNED]: [contract_entity_1.ContractStatus.PAID, contract_entity_1.ContractStatus.CANCELLED],
            [contract_entity_1.ContractStatus.PAID]: [contract_entity_1.ContractStatus.PICKED_UP, contract_entity_1.ContractStatus.CANCELLED],
            [contract_entity_1.ContractStatus.PICKED_UP]: [contract_entity_1.ContractStatus.RETURNED, contract_entity_1.ContractStatus.LATE],
            [contract_entity_1.ContractStatus.LATE]: [contract_entity_1.ContractStatus.RETURNED],
            [contract_entity_1.ContractStatus.RETURNED]: [contract_entity_1.ContractStatus.COMPLETED],
            [contract_entity_1.ContractStatus.CANCELLED]: [],
            [contract_entity_1.ContractStatus.COMPLETED]: [],
        };
        if (!allowedTransitions[currentStatus].includes(newStatus)) {
            throw new common_1.BadRequestException(`Transição de status inválida: ${currentStatus} para ${newStatus}`);
        }
    }
    async executeStatusActions(contract, status) {
        switch (status) {
            case contract_entity_1.ContractStatus.RETURNED:
                const returnedItems = await this.contractItemRepository.findByContractId(contract.id);
                for (const item of returnedItems) {
                    const product = await this.productRepository.findById(item.productId);
                    if (product) {
                        await this.productRepository.update(item.productId, {
                            quantity: product.quantity + item.quantity,
                            status: product_entity_1.ProductStatus.AVAILABLE,
                        });
                    }
                }
                break;
            case contract_entity_1.ContractStatus.CANCELLED:
                if (contract.status !== contract_entity_1.ContractStatus.DRAFT &&
                    contract.status !== contract_entity_1.ContractStatus.FITTING_SCHEDULED) {
                    const cancelledItems = await this.contractItemRepository.findByContractId(contract.id);
                    for (const item of cancelledItems) {
                        const product = await this.productRepository.findById(item.productId);
                        if (product) {
                            await this.productRepository.update(item.productId, {
                                quantity: product.quantity + item.quantity,
                                status: product_entity_1.ProductStatus.AVAILABLE,
                            });
                        }
                    }
                }
                break;
        }
    }
};
exports.ContractService = ContractService;
exports.ContractService = ContractService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IContractRepository')),
    __param(1, (0, common_1.Inject)('IContractItemRepository')),
    __param(2, (0, common_1.Inject)('IProductRepository')),
    __param(3, (0, common_1.Inject)('ICustomerRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, notification_service_1.NotificationService])
], ContractService);
//# sourceMappingURL=contract.service.js.map