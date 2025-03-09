// src/inventory/application/dtos/maintenance-log.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  IsDate,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';

export class CreateMaintenanceLogDto {
  @ApiProperty({ description: 'ID do produto em manutenção' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Descrição do serviço de manutenção' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Custo da manutenção' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiProperty({
    description: 'Data de início da manutenção',
    example: '2023-01-01',
  })
  @IsISO8601()
  @Type(() => Date)
  startDate: Date;

  @ApiPropertyOptional({
    description: 'Data prevista de término',
    example: '2023-01-15',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'Status da manutenção',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;
}

export class UpdateMaintenanceLogDto {
  @ApiPropertyOptional({ description: 'Descrição do serviço de manutenção' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Custo da manutenção' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({
    description: 'Data de início da manutenção',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Data prevista de término',
    example: '2023-01-15',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Status da manutenção',
    enum: MaintenanceStatus,
  })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;
}

export class CompleteMaintenanceLogDto {
  @ApiProperty({
    description: 'Data efetiva de término da manutenção',
    example: '2023-01-10',
  })
  @IsISO8601()
  @Type(() => Date)
  endDate: Date;
}

export class MaintenanceLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  cost?: number;

  @ApiProperty()
  startDate: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty({ enum: MaintenanceStatus })
  status: MaintenanceStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
