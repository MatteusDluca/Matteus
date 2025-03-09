// src/contracts/application/services/notification.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { CreateNotificationDto, UpdateNotificationDto } from '../dtos/notification.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {
    super(notificationRepository);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.findAll();
  }

  async findByCustomerId(customerId: string): Promise<Notification[]> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(`Cliente com ID ${customerId} não encontrado`);
    }

    return this.notificationRepository.findByCustomerId(customerId);
  }

  async findUnreadByCustomerId(customerId: string): Promise<Notification[]> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(`Cliente com ID ${customerId} não encontrado`);
    }

    return this.notificationRepository.findUnreadByCustomerId(customerId);
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return this.notificationRepository.findByType(type);
  }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(createNotificationDto.customerId);
    if (!customerExists) {
      throw new NotFoundException(
        `Cliente com ID ${createNotificationDto.customerId} não encontrado`,
      );
    }

    // Definir data de envio se não fornecida
    if (!createNotificationDto.sentAt) {
      createNotificationDto.sentAt = new Date();
    }

    return this.notificationRepository.create(createNotificationDto);
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    // Verificar se a notificação existe
    await this.findById(id);

    return this.notificationRepository.update(id, updateNotificationDto);
  }

  async markAsRead(id: string): Promise<Notification> {
    // Verificar se a notificação existe
    const notification = await this.findById(id);

    // Verificar se já está lida
    if (notification.isRead) {
      return notification;
    }

    return this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(customerId: string): Promise<void> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(`Cliente com ID ${customerId} não encontrado`);
    }

    return this.notificationRepository.markAllAsRead(customerId);
  }

  async countUnreadByCustomerId(customerId: string): Promise<number> {
    // Verificar se o cliente existe
    const customerExists = await this.customerRepository.findById(customerId);
    if (!customerExists) {
      throw new NotFoundException(`Cliente com ID ${customerId} não encontrado`);
    }

    return this.notificationRepository.countUnreadByCustomerId(customerId);
  }

  async delete(id: string): Promise<void> {
    // Verificar se a notificação existe
    await this.findById(id);

    return this.notificationRepository.delete(id);
  }
}
