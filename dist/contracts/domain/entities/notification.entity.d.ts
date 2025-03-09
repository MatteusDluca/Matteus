import { BaseEntity } from '../../../shared/domain/entities/base.entity';
export declare enum NotificationType {
    FITTING_REMINDER = "FITTING_REMINDER",
    RESERVATION_CONFIRMATION = "RESERVATION_CONFIRMATION",
    RETURN_ALERT = "RETURN_ALERT",
    BIRTHDAY = "BIRTHDAY",
    PAYMENT_CONFIRMATION = "PAYMENT_CONFIRMATION",
    GENERAL = "GENERAL"
}
export declare class Notification extends BaseEntity {
    customerId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    sentAt: Date;
    readAt?: Date;
}
