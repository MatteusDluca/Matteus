// src/contracts/infrastructure/repositories/contract-item.repository.ts
import { Injectable } from '@nestjs/common';
import { ContractItem } from '../../domain/entities/contract-item.entity';
import { IContractItemRepository } from '../../domain/repositories/contract-item.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContractItemRepository implements IContractItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToContractItem(item: any): ContractItem {
    return {
      ...item,
      // Garantir que todos os campos obrigatórios existam
      updatedAt: item.updatedAt || new Date(),
      // Converter Decimal para number
      unitPrice: item.unitPrice ? Number(item.unitPrice.toString()) : 0,
      subtotal: item.subtotal ? Number(item.subtotal.toString()) : 0,
    } as ContractItem;
  }

  async findAll(): Promise<ContractItem[]> {
    const items = await this.prisma.contractItem.findMany({
      include: {
        product: true,
      },
    });
    return items.map((item) => this.mapToContractItem(item));
  }

  async findById(id: string): Promise<ContractItem | null> {
    const item = await this.prisma.contractItem.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    return item ? this.mapToContractItem(item) : null;
  }

  async findByContractId(contractId: string): Promise<ContractItem[]> {
    const items = await this.prisma.contractItem.findMany({
      where: { contractId },
      include: {
        product: true,
      },
    });
    return items.map((item) => this.mapToContractItem(item));
  }

  async findByProductId(productId: string): Promise<ContractItem[]> {
    const items = await this.prisma.contractItem.findMany({
      where: { productId },
      include: {
        product: true,
      },
    });
    return items.map((item) => this.mapToContractItem(item));
  }

  async create(data: Partial<ContractItem>): Promise<ContractItem> {
    if (!data.contractId || !data.productId || !data.quantity) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    // Calcular o subtotal
    const unitPrice =
      data.unitPrice !== undefined
        ? new Prisma.Decimal(data.unitPrice as unknown as string)
        : undefined;

    const subtotal = data.quantity * (data.unitPrice || 0);
    const subtotalDecimal = new Prisma.Decimal(subtotal as unknown as string);

    const item = await this.prisma.contractItem.create({
      data: {
        contractId: data.contractId,
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: unitPrice as any,
        subtotal: subtotalDecimal as any,
      },
      include: {
        product: true,
      },
    });
    return this.mapToContractItem(item);
  }

  async createBulk(items: Partial<ContractItem>[]): Promise<ContractItem[]> {
    const createdItems: ContractItem[] = [];

    // O Prisma não tem createMany com relacionamentos, então fazemos um loop
    for (const item of items) {
      if (!item.contractId || !item.productId || !item.quantity) {
        throw new Error('Campos obrigatórios não podem ser undefined');
      }

      const unitPrice =
        item.unitPrice !== undefined
          ? new Prisma.Decimal(item.unitPrice as unknown as string)
          : undefined;

      const subtotal = item.quantity * (item.unitPrice || 0);
      const subtotalDecimal = new Prisma.Decimal(subtotal as unknown as string);

      const createdItem = await this.prisma.contractItem.create({
        data: {
          contractId: item.contractId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: unitPrice as any,
          subtotal: subtotalDecimal as any,
        },
        include: {
          product: true,
        },
      });

      createdItems.push(this.mapToContractItem(createdItem));
    }

    return createdItems;
  }

  async update(id: string, data: Partial<ContractItem>): Promise<ContractItem> {
    // Se a quantidade ou preço for atualizado, recalcular o subtotal
    const updateData: any = { ...data };

    if (data.quantity !== undefined || data.unitPrice !== undefined) {
      const currentItem = await this.prisma.contractItem.findUnique({
        where: { id },
      });

      if (!currentItem) {
        throw new Error('Item não encontrado');
      }

      const quantity = data.quantity !== undefined ? data.quantity : currentItem.quantity;
      const unitPrice =
        data.unitPrice !== undefined
          ? new Prisma.Decimal(data.unitPrice as unknown as string)
          : currentItem.unitPrice;

      // Converter unitPrice para número se necessário
      const unitPriceNum =
        typeof unitPrice === 'object' && 'toNumber' in unitPrice
          ? (unitPrice as any).toNumber()
          : Number(unitPrice);

      const subtotal = quantity * unitPriceNum;
      updateData.subtotal = new Prisma.Decimal(subtotal as unknown as string);

      if (data.unitPrice !== undefined) {
        updateData.unitPrice = new Prisma.Decimal(data.unitPrice as unknown as string);
      }
    }

    const item = await this.prisma.contractItem.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
      },
    });
    return this.mapToContractItem(item);
  }

  async updateQuantity(id: string, quantity: number): Promise<ContractItem> {
    // Obter o item atual para ter o preço unitário
    const currentItem = await this.prisma.contractItem.findUnique({
      where: { id },
    });

    if (!currentItem) {
      throw new Error('Item não encontrado');
    }

    // Converter unitPrice para número se necessário
    const unitPrice =
      typeof currentItem.unitPrice === 'object' && 'toNumber' in currentItem.unitPrice
        ? (currentItem.unitPrice as any).toNumber()
        : Number(currentItem.unitPrice);

    // Calcular o novo subtotal
    const subtotal = quantity * unitPrice;
    const subtotalDecimal = new Prisma.Decimal(subtotal as unknown as string);

    const item = await this.prisma.contractItem.update({
      where: { id },
      data: {
        quantity,
        subtotal: subtotalDecimal as any,
      },
      include: {
        product: true,
      },
    });
    return this.mapToContractItem(item);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.contractItem.delete({
      where: { id },
    });
  }

  async deleteByContractId(contractId: string): Promise<void> {
    await this.prisma.contractItem.deleteMany({
      where: { contractId },
    });
  }
}
