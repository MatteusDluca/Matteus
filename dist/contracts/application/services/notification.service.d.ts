import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { CreateNotificationDto, UpdateNotificationDto } from '../dtos/notification.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface';
export declare class NotificationService extends BaseService<Notification> {
    private readonly notificationRepository;
    private readonly customerRepository;
    constructor(notificationRepository: INotificationRepository, customerRepository: ICustomerRepository);
    findAll(): Promise<Notification[]>;
    findByCustomerId(customerId: string): Promise<Notification[]>;
    findUnreadByCustomerId(customerId: string): Promise<Notification[]>;
    findByType(type: NotificationType): Promise<Notification[]>;
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(customerId: string): Promise<void>;
    countUnreadByCustomerId(customerId: string): Promise<number>;
    delete(id: string): Promise<void>;
}
