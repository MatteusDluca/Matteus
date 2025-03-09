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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const base_service_1 = require("../../../shared/application/services/base.service");
const contract_entity_1 = require("../../domain/entities/contract.entity");
const notification_service_1 = require("./notification.service");
const notification_entity_1 = require("../../domain/entities/notification.entity");
let PaymentService = class PaymentService extends base_service_1.BaseService {
    constructor(paymentRepository, contractRepository, notificationService) {
        super(paymentRepository);
        this.paymentRepository = paymentRepository;
        this.contractRepository = contractRepository;
        this.notificationService = notificationService;
    }
    async findAll() {
        return this.paymentRepository.findAll();
    }
    async findByContractId(contractId) {
        const contractExists = await this.contractRepository.findById(contractId);
        if (!contractExists) {
            throw new common_1.NotFoundException(`Contrato com ID ${contractId} não encontrado`);
        }
        return this.paymentRepository.findByContractId(contractId);
    }
    async findByStatus(status) {
        return this.paymentRepository.findByStatus(status);
    }
    async create(data) {
        const createPaymentDto = data;
        const contract = await this.contractRepository.findById(createPaymentDto.contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contrato com ID ${createPaymentDto.contractId} não encontrado`);
        }
        if (contract.status !== contract_entity_1.ContractStatus.SIGNED &&
            contract.status !== contract_entity_1.ContractStatus.PAID &&
            contract.status !== contract_entity_1.ContractStatus.PICKED_UP) {
            throw new common_1.BadRequestException('O contrato deve estar assinado ou pago para registrar pagamentos');
        }
        const paidAmount = await this.paymentRepository.sumPaymentsByContractId(contract.id);
        const pendingAmount = contract.totalAmount - paidAmount;
        if (createPaymentDto.amount > pendingAmount) {
            throw new common_1.BadRequestException(`Valor excede o saldo pendente. Valor pendente: ${pendingAmount.toFixed(2)}`);
        }
        const paymentData = Object.assign({}, createPaymentDto);
        const payment = await this.paymentRepository.create(paymentData);
        if (payment.status === payment_entity_1.PaymentStatus.PAID) {
            await this.notificationService.create({
                customerId: contract.customerId,
                type: notification_entity_1.NotificationType.PAYMENT_CONFIRMATION,
                title: 'Pagamento Confirmado',
                message: `Seu pagamento de R$ ${payment.amount.toFixed(2)} foi confirmado!`,
            });
            await this.checkContractFullyPaid(contract.id);
        }
        return payment;
    }
    async update(id, data) {
        const updatePaymentDto = data;
        const payment = await this.findById(id);
        const contract = await this.contractRepository.findById(payment.contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contrato com ID ${payment.contractId} não encontrado`);
        }
        if (updatePaymentDto.amount &&
            Number(updatePaymentDto.amount) !== Number(payment.amount.toString())) {
            const paidAmount = await this.paymentRepository.sumPaymentsByContractId(payment.contractId);
            const paidAmountWithoutThis = payment.status === payment_entity_1.PaymentStatus.PAID
                ? paidAmount - Number(payment.amount.toString())
                : paidAmount;
            const pendingAmount = contract.totalAmount - paidAmountWithoutThis;
            if (updatePaymentDto.amount > pendingAmount) {
                throw new common_1.BadRequestException(`Valor excede o saldo pendente. Valor pendente: ${pendingAmount.toFixed(2)}`);
            }
        }
        const becomingPaid = payment.status !== payment_entity_1.PaymentStatus.PAID && updatePaymentDto.status === payment_entity_1.PaymentStatus.PAID;
        const paymentData = Object.assign({}, updatePaymentDto);
        const updatedPayment = await this.paymentRepository.update(id, paymentData);
        if (becomingPaid) {
            await this.notificationService.create({
                customerId: contract.customerId,
                type: notification_entity_1.NotificationType.PAYMENT_CONFIRMATION,
                title: 'Pagamento Confirmado',
                message: `Seu pagamento de R$ ${updatedPayment.amount.toFixed(2)} foi confirmado!`,
            });
            await this.checkContractFullyPaid(updatedPayment.contractId);
        }
        return updatedPayment;
    }
    async markAsPaid(id) {
        const payment = await this.findById(id);
        if (payment.status === payment_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Este pagamento já está marcado como pago');
        }
        const contract = await this.contractRepository.findById(payment.contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contrato com ID ${payment.contractId} não encontrado`);
        }
        const updatedPayment = await this.paymentRepository.markAsPaid(id);
        await this.notificationService.create({
            customerId: contract.customerId,
            type: notification_entity_1.NotificationType.PAYMENT_CONFIRMATION,
            title: 'Pagamento Confirmado',
            message: `Seu pagamento de R$ ${updatedPayment.amount.toFixed(2)} foi confirmado!`,
        });
        await this.checkContractFullyPaid(updatedPayment.contractId);
        return updatedPayment;
    }
    async delete(id) {
        const payment = await this.findById(id);
        if (payment.status === payment_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Não é possível excluir um pagamento já confirmado');
        }
        await this.paymentRepository.delete(id);
    }
    async checkContractFullyPaid(contractId) {
        const contract = await this.contractRepository.findById(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contrato com ID ${contractId} não encontrado`);
        }
        const paidAmount = await this.paymentRepository.sumPaymentsByContractId(contractId);
        if (paidAmount >= contract.totalAmount) {
            if (contract.status === contract_entity_1.ContractStatus.SIGNED) {
                await this.contractRepository.updateStatus(contractId, contract_entity_1.ContractStatus.PAID);
            }
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IPaymentRepository')),
    __param(1, (0, common_1.Inject)('IContractRepository')),
    __param(2, (0, common_1.Inject)(notification_service_1.NotificationService)),
    __metadata("design:paramtypes", [Object, Object, notification_service_1.NotificationService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map