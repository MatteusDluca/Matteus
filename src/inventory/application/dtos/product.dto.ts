// src/inventory/application/dtos/product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../../domain/entities/product.entity';
import { CategoryDto } from './category.dto';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Código único do produto' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Cor do produto' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ description: 'Tamanho do produto' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ description: 'Preço de aluguel' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  rentalPrice: number;

  @ApiPropertyOptional({ description: 'Custo de reposição (em caso de dano)' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  replacementCost?: number;

  @ApiProperty({ description: 'Quantidade disponível em estoque' })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Status do produto',
    enum: ProductStatus,
    default: ProductStatus.AVAILABLE,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiPropertyOptional({ description: 'Localização do produto no estoque' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Informações sobre manutenção do produto',
  })
  @IsOptional()
  @IsString()
  maintenanceInfo?: string;

  @ApiProperty({ description: 'ID da categoria do produto' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Nome do produto' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Cor do produto' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Tamanho do produto' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ description: 'Preço de aluguel' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  rentalPrice?: number;

  @ApiPropertyOptional({ description: 'Custo de reposição (em caso de dano)' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  replacementCost?: number;

  @ApiPropertyOptional({ description: 'Quantidade disponível em estoque' })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Status do produto',
    enum: ProductStatus,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Localização do produto no estoque' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Informações sobre manutenção do produto',
  })
  @IsOptional()
  @IsString()
  maintenanceInfo?: string;

  @ApiPropertyOptional({ description: 'ID da categoria do produto' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class ProductImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  isMain: boolean;
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  rentalPrice: number;

  @ApiPropertyOptional()
  replacementCost?: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ enum: ProductStatus })
  status: ProductStatus;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  maintenanceInfo?: string;

  @ApiProperty()
  categoryId: string;

  @ApiPropertyOptional({ type: () => CategoryDto })
  category?: CategoryDto;

  @ApiPropertyOptional({ type: [ProductImageDto] })
  images?: ProductImageDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
