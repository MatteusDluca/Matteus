// src/inventory/application/services/maintenance-log.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MaintenanceLog, MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
import { IMaintenanceLogRepository } from '../../domain/repositories/maintenance-log.repository.interface';
import {
  CreateMaintenanceLogDto,
  UpdateMaintenanceLogDto,
  CompleteMaintenanceLogDto,
} from '../dtos/maintenance-log.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductStatus } from '../../domain/entities/product.entity';

@Injectable()
export class MaintenanceLogService extends BaseService<MaintenanceLog> {
  constructor(
    @Inject('IMaintenanceLogRepository')
    private readonly maintenanceLogRepository: IMaintenanceLogRepository,
    @Inject('IProductRepository') // Adicione este decorador
    private readonly productRepository: IProductRepository,
  ) {
    super(maintenanceLogRepository);
  }

  async findAll(): Promise<MaintenanceLog[]> {
    return this.maintenanceLogRepository.findAll();
  }

  async findByProductId(productId: string): Promise<MaintenanceLog[]> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado`);
    }

    return this.maintenanceLogRepository.findByProductId(productId);
  }

  async findActiveByProductId(productId: string): Promise<MaintenanceLog[]> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado`);
    }

    return this.maintenanceLogRepository.findActiveByProductId(productId);
  }

  async findByStatus(status: MaintenanceStatus): Promise<MaintenanceLog[]> {
    return this.maintenanceLogRepository.findByStatus(status);
  }

  async create(createMaintenanceLogDto: CreateMaintenanceLogDto): Promise<MaintenanceLog> {
    // Verificar se o produto existe
    const product = await this.productRepository.findById(createMaintenanceLogDto.productId);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${product} não encontrado`);
    }

    // Se o status for SCHEDULED ou IN_PROGRESS, atualizar o status do produto para MAINTENANCE
    if (
      createMaintenanceLogDto.status === MaintenanceStatus.SCHEDULED ||
      createMaintenanceLogDto.status === MaintenanceStatus.IN_PROGRESS
    ) {
      await this.productRepository.updateStatus(product.id, ProductStatus.MAINTENANCE);
    }

    return this.maintenanceLogRepository.create(createMaintenanceLogDto);
  }

  async update(
    id: string,
    updateMaintenanceLogDto: UpdateMaintenanceLogDto,
  ): Promise<MaintenanceLog> {
    // Verificar se o log de manutenção existe
    const maintenanceLog = await this.findById(id);

    // Se estiver mudando para COMPLETED, verificar se endDate está definido
    if (
      updateMaintenanceLogDto.status === MaintenanceStatus.COMPLETED &&
      !updateMaintenanceLogDto.endDate &&
      !maintenanceLog.endDate
    ) {
      throw new BadRequestException(
        'Data de término deve ser informada para completar a manutenção',
      );
    }

    // Atualizar o log
    const updatedLog = await this.maintenanceLogRepository.update(id, updateMaintenanceLogDto);

    // Se o status for alterado para COMPLETED, atualizar o status do produto de volta para AVAILABLE
    if (updateMaintenanceLogDto.status === MaintenanceStatus.COMPLETED) {
      // Verificar se existem outros logs ativos para o produto
      const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(
        updatedLog.productId,
      );

      // Se não houver outros logs ativos, atualizar o status do produto
      if (activeLogs.length === 0) {
        await this.productRepository.updateStatus(updatedLog.productId, ProductStatus.AVAILABLE);
      }
    }

    return updatedLog;
  }

  async completeMaintenance(
    id: string,
    completeDto: CompleteMaintenanceLogDto,
  ): Promise<MaintenanceLog> {
    // Verificar se o log de manutenção existe
    const maintenanceLog = await this.findById(id);

    // Verificar se o log já está completo
    if (maintenanceLog.status === MaintenanceStatus.COMPLETED) {
      throw new BadRequestException('Essa manutenção já foi concluída');
    }

    // Completar a manutenção
    const updatedLog = await this.maintenanceLogRepository.completeMaintenanceLog(
      id,
      completeDto.endDate,
    );

    // Verificar se existem outros logs ativos para o produto
    const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(
      updatedLog.productId,
    );

    // Se não houver outros logs ativos, atualizar o status do produto
    if (activeLogs.length === 0) {
      await this.productRepository.updateStatus(updatedLog.productId, ProductStatus.AVAILABLE);
    }

    return updatedLog;
  }

  async delete(id: string): Promise<void> {
    // Verificar se o log de manutenção existe
    const maintenanceLog = await this.findById(id);

    await this.maintenanceLogRepository.delete(id);

    // Se foi um log ativo (SCHEDULED ou IN_PROGRESS), verificar se há outros logs ativos
    if (
      maintenanceLog.status === MaintenanceStatus.SCHEDULED ||
      maintenanceLog.status === MaintenanceStatus.IN_PROGRESS
    ) {
      const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(
        maintenanceLog.productId,
      );

      // Se não houver outros logs ativos, atualizar o status do produto
      if (activeLogs.length === 0) {
        await this.productRepository.updateStatus(
          maintenanceLog.productId,
          ProductStatus.AVAILABLE,
        );
      }
    }
  }
}
