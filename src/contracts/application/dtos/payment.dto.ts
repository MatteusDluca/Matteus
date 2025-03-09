// src/contracts/application/dtos/payment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsInt,
  IsUUID,
  Min,
  Max,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '../../domain/entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID do contrato' })
  @IsUUID()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({ description: 'Valor do pagamento' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Método de pagamento', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Status do pagamento',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Número de parcelas', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number;

  @ApiPropertyOptional({
    description: 'Referência externa (número do comprovante, etc.)',
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({
    description: 'Data de pagamento',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  paidAt?: Date;

  @ApiPropertyOptional({
    description: 'Data de vencimento',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  dueDate?: Date;
}

export class UpdatePaymentDto {
  @ApiPropertyOptional({ description: 'Valor do pagamento' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Método de pagamento',
    enum: PaymentMethod,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Status do pagamento',
    enum: PaymentStatus,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Número de parcelas' })
  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number;

  @ApiPropertyOptional({
    description: 'Referência externa (número do comprovante, etc.)',
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({
    description: 'Data de pagamento',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  paidAt?: Date;

  @ApiPropertyOptional({
    description: 'Data de vencimento',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  dueDate?: Date;
}

export class PaymentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contractId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  installments: number;

  @ApiPropertyOptional()
  reference?: string;

  @ApiPropertyOptional()
  paidAt?: Date;

  @ApiPropertyOptional()
  dueDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
