// src/contracts/domain/repositories/notification.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Notification, NotificationType } from '../entities/notification.entity';

export interface INotificationRepository extends IBaseRepository<Notification> {
  findByCustomerId(customerId: string): Promise<Notification[]>;
  findUnreadByCustomerId(customerId: string): Promise<Notification[]>;
  findByType(type: NotificationType): Promise<Notification[]>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(customerId: string): Promise<void>;
  countUnreadByCustomerId(customerId: string): Promise<number>;
}
