// src/customers/application/dtos/customer.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  IsDate,
  Length,
  Matches,
  IsObject,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType } from '../../domain/entities/customer.entity';

export class BodyMeasurementsDto {
  [key: string]: number | undefined;
  @ApiPropertyOptional({ description: 'Medida do busto em cm' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  bust?: number;

  @ApiPropertyOptional({ description: 'Medida da cintura em cm' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  waist?: number;

  @ApiPropertyOptional({ description: 'Medida do quadril em cm' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  hips?: number;

  @ApiPropertyOptional({ description: 'Altura em cm' })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  height?: number;

  @ApiPropertyOptional({ description: 'Largura dos ombros em cm' })
  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(100)
  shoulders?: number;

  @ApiPropertyOptional({ description: 'Medida interna da perna em cm' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(150)
  inseam?: number;

  @ApiPropertyOptional({ description: 'Comprimento da manga em cm' })
  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(100)
  sleeve?: number;

  @ApiPropertyOptional({ description: 'Circunferência do pescoço em cm' })
  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(100)
  neck?: number;
}

export class CreateCustomerDto {
  @ApiPropertyOptional({
    description: 'ID do usuário associado ao cliente (opcional)',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Nome completo do cliente' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'Tipo de documento', enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ description: 'Número do documento (CPF ou CNPJ)' })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({ description: 'Telefone do cliente' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{10,15})$/, {
    message: 'Telefone deve conter apenas números, entre 10 e 15 dígitos',
  })
  phone: string;

  @ApiProperty({ description: 'Email do cliente' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Instagram do cliente' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ description: 'Endereço do cliente' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Cidade do cliente' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado do cliente' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @ApiProperty({ description: 'CEP do cliente (apenas números)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode: string;

  @ApiPropertyOptional({ description: 'Medidas corporais do cliente' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BodyMeasurementsDto)
  bodyMeasurements?: BodyMeasurementsDto;

  @ApiPropertyOptional({ description: 'Preferências do cliente' })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiPropertyOptional({ description: 'Observações sobre o cliente' })
  @IsOptional()
  @IsString()
  observations?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'ID do usuário associado ao cliente' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Nome completo do cliente' })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  birthDate?: Date;

  @ApiPropertyOptional({ description: 'Telefone do cliente' })
  @IsOptional()
  @IsString()
  @Matches(/^(\d{10,15})$/, {
    message: 'Telefone deve conter apenas números, entre 10 e 15 dígitos',
  })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email do cliente' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Instagram do cliente' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ description: 'Endereço do cliente' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Cidade do cliente' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Estado do cliente' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiPropertyOptional({ description: 'CEP do cliente (apenas números)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Medidas corporais do cliente' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BodyMeasurementsDto)
  bodyMeasurements?: BodyMeasurementsDto;

  @ApiPropertyOptional({ description: 'Preferências do cliente' })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiPropertyOptional({ description: 'Observações sobre o cliente' })
  @IsOptional()
  @IsString()
  observations?: string;
}

export class UpdateLoyaltyPointsDto {
  @ApiProperty({
    description: 'Pontos de fidelidade a adicionar (positivo) ou remover (negativo)',
  })
  @IsInt()
  points: number;
}

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  userId?: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: DocumentType })
  documentType: DocumentType;

  @ApiProperty()
  documentNumber: string;

  @ApiPropertyOptional()
  birthDate?: Date;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  instagram?: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zipCode: string;

  @ApiPropertyOptional()
  bodyMeasurements?: BodyMeasurementsDto;

  @ApiProperty()
  loyaltyPoints: number;

  @ApiPropertyOptional()
  preferences?: string;

  @ApiPropertyOptional()
  observations?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
