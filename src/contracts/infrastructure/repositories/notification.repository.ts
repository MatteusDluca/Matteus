// src/contracts/infrastructure/repositories/notification.repository.ts
import { Injectable } from '@nestjs/common';
import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      orderBy: { sentAt: 'desc' },
    });
    return notifications as unknown as Notification[];
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    return notification as unknown as Notification | null;
  }

  async findByCustomerId(customerId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { customerId },
      orderBy: { sentAt: 'desc' },
    });
    return notifications as unknown as Notification[];
  }

  async findUnreadByCustomerId(customerId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        customerId,
        isRead: false,
      },
      orderBy: { sentAt: 'desc' },
    });
    return notifications as unknown as Notification[];
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { type },
      orderBy: { sentAt: 'desc' },
    });
    return notifications as unknown as Notification[];
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    if (!data.customerId || !data.type || !data.title || !data.message) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    const notification = await this.prisma.notification.create({
      data: {
        customerId: data.customerId,
        type: data.type,
        title: data.title,
        message: data.message,
        isRead: data.isRead ?? false,
        sentAt: data.sentAt ?? new Date(),
        readAt: data.readAt ?? null,
      },
    });
    return notification as unknown as Notification;
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification> {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: data as any,
    });
    return notification as unknown as Notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return notification as unknown as Notification;
  }

  async markAllAsRead(customerId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        customerId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async countUnreadByCustomerId(customerId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        customerId,
        isRead: false,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }
}
