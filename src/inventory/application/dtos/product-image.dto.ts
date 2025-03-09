// src/inventory/application/dtos/product-image.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ description: 'URL da imagem' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    description: 'Indica se é a imagem principal',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @ApiProperty({ description: 'ID do produto relacionado' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}

export class UpdateProductImageDto {
  @ApiPropertyOptional({ description: 'URL da imagem' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Indica se é a imagem principal' })
  @IsOptional()
  @IsBoolean()
  isMain?: boolean;
}

export class ProductImageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  isMain: boolean;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  createdAt: Date;
}
