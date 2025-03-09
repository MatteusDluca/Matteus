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
exports.ContractItemService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
const contract_entity_1 = require("../../domain/entities/contract.entity");
const product_entity_1 = require("../../../inventory/domain/entities/product.entity");
let ContractItemService = class ContractItemService extends base_service_1.BaseService {
    constructor(contractItemRepository, contractRepository, productRepository) {
        super(contractItemRepository);
        this.contractItemRepository = contractItemRepository;
        this.contractRepository = contractRepository;
        this.productRepository = productRepository;
    }
    async findAll() {
        return this.contractItemRepository.findAll();
    }
    async findByContractId(contractId) {
        const contractExists = await this.contractRepository.findById(contractId);
        if (!contractExists) {
            throw new common_1.NotFoundException(`Contrato com ID ${contractId} não encontrado`);
        }
        return this.contractItemRepository.findByContractId(contractId);
    }
    async findByProductId(productId) {
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new common_1.NotFoundException(`Produto com ID ${productId} não encontrado`);
        }
        return this.contractItemRepository.findByProductId(productId);
    }
    async create(createContractItemDto) {
        var _a, _b;
        if (!createContractItemDto.contractId) {
            throw new common_1.BadRequestException('ID do contrato é obrigatório');
        }
        const contract = await this.contractRepository.findById(createContractItemDto.contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contrato com ID ${createContractItemDto.contractId} não encontrado`);
        }
        if (contract.status !== contract_entity_1.ContractStatus.DRAFT &&
            contract.status !== contract_entity_1.ContractStatus.FITTING_SCHEDULED) {
            throw new common_1.BadRequestException('Não é possível adicionar itens a este contrato no estado atual');
        }
        const product = await this.productRepository.findById(createContractItemDto.productId);
        if (!product) {
            throw new common_1.NotFoundException(`Produto com ID ${createContractItemDto.productId} não encontrado`);
        }
        if (product.status !== product_entity_1.ProductStatus.AVAILABLE) {
            throw new common_1.BadRequestException(`Produto ${product.name} não está disponível para aluguel`);
        }
        if (product.quantity < createContractItemDto.quantity) {
            throw new common_1.BadRequestException(`Quantidade insuficiente do produto ${product.name}. Disponível: ${product.quantity}`);
        }
        const itemToCreate = {
            contractId: createContractItemDto.contractId,
            productId: createContractItemDto.productId,
            quantity: createContractItemDto.quantity,
            unitPrice: (_b = (_a = createContractItemDto.unitPrice) !== null && _a !== void 0 ? _a : product.rentalPrice) !== null && _b !== void 0 ? _b : 0,
        };
        const contractItem = await this.contractItemRepository.create(itemToCreate);
        await this.productRepository.update(product.id, {
            quantity: product.quantity - createContractItemDto.quantity,
        });
        const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
        await this.contractRepository.update(contract.id, { totalAmount });
        return contractItem;
    }
    async update(id, updateContractItemDto) {
        const item = await this.findById(id);
        const contract = await this.contractRepository.findById(item.contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contrato com ID ${item.contractId} não encontrado`);
        }
        if (contract.status !== contract_entity_1.ContractStatus.DRAFT &&
            contract.status !== contract_entity_1.ContractStatus.FITTING_SCHEDULED) {
            throw new common_1.BadRequestException('Não é possível atualizar itens deste contrato no estado atual');
        }
        if (updateContractItemDto.quantity && updateContractItemDto.quantity > item.quantity) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Produto com ID ${item.productId} não encontrado`);
            }
            const additionalQuantity = updateContractItemDto.quantity - item.quantity;
            if (product.quantity < additionalQuantity) {
                throw new common_1.BadRequestException(`Quantidade insuficiente do produto. Disponível: ${product.quantity}`);
            }
            await this.productRepository.update(product.id, {
                quantity: product.quantity - additionalQuantity,
            });
        }
        else if (updateContractItemDto.quantity && updateContractItemDto.quantity < item.quantity) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Produto com ID ${item.productId} não encontrado`);
            }
            const returnedQuantity = item.quantity - updateContractItemDto.quantity;
            await this.productRepository.update(product.id, {
                quantity: product.quantity + returnedQuantity,
            });
        }
        const updatedItem = await this.contractItemRepository.update(id, updateContractItemDto);
        const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
        await this.contractRepository.update(contract.id, { totalAmount });
        return updatedItem;
    }
    async delete(id) {
        const item = await this.findById(id);
        const contract = await this.contractRepository.findById(item.contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contrato com ID ${item.contractId} não encontrado`);
        }
        if (contract.status !== contract_entity_1.ContractStatus.DRAFT &&
            contract.status !== contract_entity_1.ContractStatus.FITTING_SCHEDULED) {
            throw new common_1.BadRequestException('Não é possível remover itens deste contrato no estado atual');
        }
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
            throw new common_1.NotFoundException(`Produto com ID ${item.productId} não encontrado`);
        }
        await this.productRepository.update(product.id, {
            quantity: product.quantity + item.quantity,
        });
        await this.contractItemRepository.delete(id);
        const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
        await this.contractRepository.update(contract.id, { totalAmount });
    }
};
exports.ContractItemService = ContractItemService;
exports.ContractItemService = ContractItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IContractItemRepository')),
    __param(1, (0, common_1.Inject)('IContractRepository')),
    __param(2, (0, common_1.Inject)('IProductRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ContractItemService);
//# sourceMappingURL=contract-item.service.js.map