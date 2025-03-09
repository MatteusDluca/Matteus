// src/employees/application/dtos/employee.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsOptional,
  Length,
  Matches,
  Min,
  Max,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'ID do usuário associado ao funcionário' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Nome completo do funcionário' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'CPF do funcionário (apenas números)' })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @Matches(/^\d{11}$/, {
    message: 'CPF deve conter apenas 11 dígitos numéricos',
  })
  cpf: string;

  @ApiProperty({ description: 'Telefone do funcionário' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{10,15})$/, {
    message: 'Telefone deve conter apenas números, entre 10 e 15 dígitos',
  })
  phone: string;

  @ApiProperty({ description: 'Endereço do funcionário' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Cidade do funcionário' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado do funcionário' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @ApiProperty({ description: 'CEP do funcionário (apenas números)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode: string;

  @ApiProperty({ description: 'Cargo do funcionário' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ description: 'Salário do funcionário' })
  @IsNumber()
  @Min(0)
  salary: number;

  @ApiProperty({ description: 'Data de contratação', example: '2023-01-01' })
  @IsISO8601()
  @Type(() => Date)
  hireDate: Date;

  @ApiProperty({
    description: 'Horário de trabalho do funcionário',
    example: '08:00-18:00',
  })
  @IsString()
  @IsNotEmpty()
  workingHours: string;

  @ApiPropertyOptional({ description: 'Taxa de desempenho (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  performanceRate?: number;
}

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ description: 'Nome completo do funcionário' })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiPropertyOptional({ description: 'Telefone do funcionário' })
  @IsOptional()
  @IsString()
  @Matches(/^(\d{10,15})$/, {
    message: 'Telefone deve conter apenas números, entre 10 e 15 dígitos',
  })
  phone?: string;

  @ApiPropertyOptional({ description: 'Endereço do funcionário' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Cidade do funcionário' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Estado do funcionário' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiPropertyOptional({ description: 'CEP do funcionário (apenas números)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Cargo do funcionário' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ description: 'Salário do funcionário' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @ApiPropertyOptional({
    description: 'Data de contratação',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  hireDate?: Date;

  @ApiPropertyOptional({
    description: 'Horário de trabalho do funcionário',
    example: '08:00-18:00',
  })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional({ description: 'Taxa de desempenho (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  performanceRate?: number;
}

export class EmployeeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  hireDate: Date;

  @ApiProperty()
  workingHours: string;

  @ApiPropertyOptional()
  performanceRate?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
