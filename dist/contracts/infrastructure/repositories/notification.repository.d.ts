import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class NotificationRepository implements INotificationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Notification[]>;
    findById(id: string): Promise<Notification | null>;
    findByCustomerId(customerId: string): Promise<Notification[]>;
    findUnreadByCustomerId(customerId: string): Promise<Notification[]>;
    findByType(type: NotificationType): Promise<Notification[]>;
    create(data: Partial<Notification>): Promise<Notification>;
    update(id: string, data: Partial<Notification>): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(customerId: string): Promise<void>;
    countUnreadByCustomerId(customerId: string): Promise<number>;
    delete(id: string): Promise<void>;
}
