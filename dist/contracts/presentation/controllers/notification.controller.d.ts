import { NotificationService } from '../../application/services/notification.service';
import { CreateNotificationDto, UpdateNotificationDto } from '../../application/dtos/notification.dto';
import { NotificationType } from '../../domain/entities/notification.entity';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(): Promise<import("../../domain/entities/notification.entity").Notification[]>;
    findByCustomerId(customerId: string): Promise<import("../../domain/entities/notification.entity").Notification[]>;
    findUnreadByCustomerId(customerId: string): Promise<import("../../domain/entities/notification.entity").Notification[]>;
    countUnreadByCustomerId(customerId: string): Promise<{
        count: number;
    }>;
    findByType(type: NotificationType): Promise<import("../../domain/entities/notification.entity").Notification[]>;
    findOne(id: string): Promise<import("../../domain/entities/notification.entity").Notification>;
    create(createNotificationDto: CreateNotificationDto): Promise<import("../../domain/entities/notification.entity").Notification>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<import("../../domain/entities/notification.entity").Notification>;
    markAsRead(id: string): Promise<import("../../domain/entities/notification.entity").Notification>;
    markAllAsRead(customerId: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<void>;
}
