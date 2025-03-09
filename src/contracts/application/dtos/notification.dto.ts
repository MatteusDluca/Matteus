// src/contracts/application/dtos/notification.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsDate,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../../domain/entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Tipo da notificação', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Título da notificação' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Mensagem da notificação' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'Notificação marcada como lida',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({
    description: 'Data de envio',
    example: '2023-01-01T10:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  sentAt?: Date;
}

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Tipo da notificação',
    enum: NotificationType,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({ description: 'Título da notificação' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Mensagem da notificação' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'Notificação marcada como lida' })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class NotificationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  sentAt: Date;

  @ApiPropertyOptional()
  readAt?: Date;
}
