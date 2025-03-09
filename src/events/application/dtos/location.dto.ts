// src/events/application/dtos/location.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Length, Matches } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ description: 'Nome do local' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Endereço do local' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Cidade do local' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado do local' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @ApiProperty({ description: 'CEP do local (apenas números)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode: string;

  @ApiPropertyOptional({ description: 'Capacidade máxima de pessoas' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Tipo de local (salão, clube, hotel, etc.)',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do local' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateLocationDto {
  @ApiPropertyOptional({ description: 'Nome do local' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Endereço do local' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Cidade do local' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Estado do local' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiPropertyOptional({ description: 'CEP do local (apenas números)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Capacidade máxima de pessoas' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Tipo de local (salão, clube, hotel, etc.)',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do local' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class LocationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zipCode: string;

  @ApiPropertyOptional()
  capacity?: number;

  @ApiPropertyOptional()
  type?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class LocationWithEventCountDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'Número de eventos realizados no local' })
  eventCount: number;
}
