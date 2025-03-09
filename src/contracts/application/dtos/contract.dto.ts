// src/contracts/application/dtos/contract.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  IsNumber,
  IsUUID,
  IsISO8601,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus } from '../../domain/entities/contract.entity';
import { ContractItemDto, CreateContractItemDto } from './contract-item.dto';
import { PaymentDto } from './payment.dto';

export class CreateContractDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'ID do funcionário' })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiPropertyOptional({ description: 'ID do evento (opcional)' })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Data da prova',
    example: '2023-01-01T14:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  fittingDate?: Date;

  @ApiProperty({
    description: 'Data de retirada',
    example: '2023-01-05T10:00:00Z',
  })
  @IsISO8601()
  @Type(() => Date)
  pickupDate: Date;

  @ApiProperty({
    description: 'Data de devolução',
    example: '2023-01-10T10:00:00Z',
  })
  @IsISO8601()
  @Type(() => Date)
  returnDate: Date;

  @ApiPropertyOptional({
    description: 'Status do contrato',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @ApiPropertyOptional({ description: 'Valor do depósito/caução' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiPropertyOptional({ description: 'Condições especiais' })
  @IsOptional()
  @IsString()
  specialConditions?: string;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiProperty({
    description: 'Itens do contrato',
    type: [CreateContractItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContractItemDto)
  items: CreateContractItemDto[];
}

export class UpdateContractDto {
  @ApiPropertyOptional({ description: 'ID do cliente' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ description: 'ID do funcionário' })
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'ID do evento' })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Data da prova',
    example: '2023-01-01T14:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  fittingDate?: Date;

  @ApiPropertyOptional({
    description: 'Data de retirada',
    example: '2023-01-05T10:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  pickupDate?: Date;

  @ApiPropertyOptional({
    description: 'Data de devolução',
    example: '2023-01-10T10:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  returnDate?: Date;

  @ApiPropertyOptional({
    description: 'Status do contrato',
    enum: ContractStatus,
  })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @ApiPropertyOptional({ description: 'Valor do depósito/caução' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiPropertyOptional({ description: 'Condições especiais' })
  @IsOptional()
  @IsString()
  specialConditions?: string;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observations?: string;
}

export class ContractResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  employeeId: string;

  @ApiPropertyOptional()
  eventId?: string;

  @ApiProperty()
  contractNumber: string;

  @ApiPropertyOptional()
  fittingDate?: Date;

  @ApiProperty()
  pickupDate: Date;

  @ApiProperty()
  returnDate: Date;

  @ApiProperty({ enum: ContractStatus })
  status: ContractStatus;

  @ApiProperty()
  totalAmount: number;

  @ApiPropertyOptional()
  depositAmount?: number;

  @ApiPropertyOptional()
  specialConditions?: string;

  @ApiPropertyOptional()
  observations?: string;

  @ApiPropertyOptional({ type: [ContractItemDto] })
  items?: ContractItemDto[];

  @ApiPropertyOptional({ type: [PaymentDto] })
  payments?: PaymentDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ContractStatsDto {
  @ApiProperty({ description: 'Mês (1-12)' })
  month: number;

  @ApiProperty({ description: 'Ano' })
  year: number;

  @ApiProperty({ description: 'Total de contratos' })
  count: number;
}

export class ContractRevenueDto {
  @ApiProperty({ description: 'Mês (1-12)' })
  month: number;

  @ApiProperty({ description: 'Ano' })
  year: number;

  @ApiProperty({ description: 'Valor total dos contratos' })
  total: number;
}
