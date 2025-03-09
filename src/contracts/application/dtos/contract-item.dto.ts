// src/contracts/application/dtos/contract-item.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt, IsUUID, Min } from 'class-validator';

export class CreateContractItemDto {
  @ApiPropertyOptional({
    description: 'ID do contrato (pode ser omitido se estiver criando junto com o contrato)',
  })
  @IsOptional()
  @IsUUID()
  contractId?: string;

  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantidade' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Preço unitário (se omitido, será usado o preço de aluguel do produto)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class UpdateContractItemDto {
  @ApiPropertyOptional({ description: 'Quantidade' })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Preço unitário' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class ContractItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contractId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  createdAt: Date;
}
