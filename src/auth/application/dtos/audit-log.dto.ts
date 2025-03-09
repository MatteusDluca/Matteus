// src/auth/application/dtos/audit-log.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Ação realizada' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ description: 'Recurso acessado' })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiPropertyOptional({ description: 'Detalhes adicionais' })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({ description: 'Endereço IP do cliente' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User-Agent do cliente' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class AuditLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  resource: string;

  @ApiPropertyOptional()
  details?: string;

  @ApiPropertyOptional()
  ipAddress?: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiProperty()
  createdAt: Date;
}
