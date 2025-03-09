import { NotificationType } from '../../domain/entities/notification.entity';
export declare class CreateNotificationDto {
    customerId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead?: boolean;
    sentAt?: Date;
}
export declare class UpdateNotificationDto {
    type?: NotificationType;
    title?: string;
    message?: string;
    isRead?: boolean;
}
export declare class NotificationDto {
    id: string;
    customerId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    sentAt: Date;
    readAt?: Date;
}
