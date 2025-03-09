// src/events/application/dtos/event.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsInt,
  IsOptional,
  Min,
  Max,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class CreateEventDto {
  @ApiProperty({ description: 'Nome do evento' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Data do evento',
    example: '2023-01-01T20:00:00Z',
  })
  @IsISO8601()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Categoria do evento (casamento, formatura, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'ID do local do evento' })
  @IsString()
  @IsNotEmpty()
  locationId: string;

  @ApiPropertyOptional({ description: 'Capacidade de pessoas do evento' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Organizador do evento' })
  @IsOptional()
  @IsString()
  organizer?: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do evento' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateEventDto {
  @ApiPropertyOptional({ description: 'Nome do evento' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Data do evento',
    example: '2023-01-01T20:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional({
    description: 'Categoria do evento (casamento, formatura, etc.)',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'ID do local do evento' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({ description: 'Capacidade de pessoas do evento' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Organizador do evento' })
  @IsOptional()
  @IsString()
  organizer?: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do evento' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class EventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  category: string;

  @ApiProperty()
  locationId: string;

  @ApiPropertyOptional()
  capacity?: number;

  @ApiPropertyOptional()
  organizer?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ type: () => LocationDto })
  location?: LocationDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class MonthlyEventCountDto {
  @ApiProperty({ description: 'Mês (1-12)' })
  month: number;

  @ApiProperty({ description: 'Total de eventos no mês' })
  count: number;
}
