// src/contracts/application/services/contract-item.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ContractItem } from '../../domain/entities/contract-item.entity';
import { IContractItemRepository } from '../../domain/repositories/contract-item.repository.interface';
import { IContractRepository } from '../../domain/repositories/contract.repository.interface';
import { IProductRepository } from '../../../inventory/domain/repositories/product.repository.interface';
import { CreateContractItemDto, UpdateContractItemDto } from '../dtos/contract-item.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ContractStatus } from '../../domain/entities/contract.entity';
import { ProductStatus } from '../../../inventory/domain/entities/product.entity';

@Injectable()
export class ContractItemService extends BaseService<ContractItem> {
  constructor(
    @Inject('IContractItemRepository')
    private readonly contractItemRepository: IContractItemRepository,
    @Inject('IContractRepository')
    private readonly contractRepository: IContractRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {
    super(contractItemRepository);
  }

  async findAll(): Promise<ContractItem[]> {
    return this.contractItemRepository.findAll();
  }

  async findByContractId(contractId: string): Promise<ContractItem[]> {
    // Verificar se o contrato existe
    const contractExists = await this.contractRepository.findById(contractId);
    if (!contractExists) {
      throw new NotFoundException(`Contrato com ID ${contractId} não encontrado`);
    }

    return this.contractItemRepository.findByContractId(contractId);
  }

  async findByProductId(productId: string): Promise<ContractItem[]> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado`);
    }

    return this.contractItemRepository.findByProductId(productId);
  }

  async create(createContractItemDto: CreateContractItemDto): Promise<ContractItem> {
    // Verificação explícita da existência do ID do contrato
    if (!createContractItemDto.contractId) {
      throw new BadRequestException('ID do contrato é obrigatório');
    }

    // Agora o TypeScript sabe que contractId não é undefined
    const contract = await this.contractRepository.findById(createContractItemDto.contractId);
    if (!contract) {
      throw new NotFoundException(
        `Contrato com ID ${createContractItemDto.contractId} não encontrado`,
      );
    }

    // Check if the contract is in a state that allows adding items
    if (
      contract.status !== ContractStatus.DRAFT &&
      contract.status !== ContractStatus.FITTING_SCHEDULED
    ) {
      throw new BadRequestException(
        'Não é possível adicionar itens a este contrato no estado atual',
      );
    }

    // Verify the product exists
    const product = await this.productRepository.findById(createContractItemDto.productId);
    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${createContractItemDto.productId} não encontrado`,
      );
    }

    // Check if the product is available
    if (product.status !== ProductStatus.AVAILABLE) {
      throw new BadRequestException(`Produto ${product.name} não está disponível para aluguel`);
    }

    // Check if there's enough quantity
    if (product.quantity < createContractItemDto.quantity) {
      throw new BadRequestException(
        `Quantidade insuficiente do produto ${product.name}. Disponível: ${product.quantity}`,
      );
    }

    // Create a new data object with default rental price if needed
    // This prevents TypeScript errors by ensuring unitPrice is always defined
    const itemToCreate = {
      contractId: createContractItemDto.contractId,
      productId: createContractItemDto.productId,
      quantity: createContractItemDto.quantity,
      unitPrice: createContractItemDto.unitPrice ?? product.rentalPrice ?? 0,
    };

    // Create the item
    const contractItem = await this.contractItemRepository.create(itemToCreate);

    // Update product inventory
    await this.productRepository.update(product.id, {
      quantity: product.quantity - createContractItemDto.quantity,
    });

    // Recalculate contract total amount
    const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
    await this.contractRepository.update(contract.id, { totalAmount });

    return contractItem;
  }

  async update(id: string, updateContractItemDto: UpdateContractItemDto): Promise<ContractItem> {
    // Verificar se o item existe
    const item = await this.findById(id);

    // Verificar se o contrato existe e está em um estado que permite atualizar itens
    const contract = await this.contractRepository.findById(item.contractId);
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${item.contractId} não encontrado`);
    }

    // Agora é seguro verificar o status
    if (
      contract.status !== ContractStatus.DRAFT &&
      contract.status !== ContractStatus.FITTING_SCHEDULED
    ) {
      throw new BadRequestException(
        'Não é possível atualizar itens deste contrato no estado atual',
      );
    }

    // Verificar se está aumentando a quantidade
    if (updateContractItemDto.quantity && updateContractItemDto.quantity > item.quantity) {
      // Verificar se há estoque suficiente
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Produto com ID ${item.productId} não encontrado`);
      }

      const additionalQuantity = updateContractItemDto.quantity - item.quantity;

      if (product.quantity < additionalQuantity) {
        throw new BadRequestException(
          `Quantidade insuficiente do produto. Disponível: ${product.quantity}`,
        );
      }

      // Atualizar o estoque do produto (reduzir)
      await this.productRepository.update(product.id, {
        quantity: product.quantity - additionalQuantity,
      });
    } else if (updateContractItemDto.quantity && updateContractItemDto.quantity < item.quantity) {
      // Está diminuindo a quantidade, devolver ao estoque
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Produto com ID ${item.productId} não encontrado`);
      }
      const returnedQuantity = item.quantity - updateContractItemDto.quantity;

      // Atualizar o estoque do produto (aumentar)
      await this.productRepository.update(product.id, {
        quantity: product.quantity + returnedQuantity,
      });
    }

    // Atualizar o item
    const updatedItem = await this.contractItemRepository.update(id, updateContractItemDto);

    // Recalcular o valor total do contrato
    const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
    await this.contractRepository.update(contract.id, { totalAmount });

    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    // Verificar se o item existe
    const item = await this.findById(id);

    // Verificar se o contrato existe e está em um estado que permite remover itens
    const contract = await this.contractRepository.findById(item.contractId);
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${item.contractId} não encontrado`);
    }

    if (
      contract.status !== ContractStatus.DRAFT &&
      contract.status !== ContractStatus.FITTING_SCHEDULED
    ) {
      throw new BadRequestException('Não é possível remover itens deste contrato no estado atual');
    }

    // Devolver a quantidade ao estoque
    const product = await this.productRepository.findById(item.productId);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${item.productId} não encontrado`);
    }

    await this.productRepository.update(product.id, {
      quantity: product.quantity + item.quantity,
    });

    // Excluir o item
    await this.contractItemRepository.delete(id);

    // Recalcular o valor total do contrato
    const totalAmount = await this.contractRepository.calculateTotalAmount(contract.id);
    await this.contractRepository.update(contract.id, { totalAmount });
  }
}
