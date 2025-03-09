# InventoryEventsGenerator.ps1
# Script para gerar os módulos de Inventário e Eventos/Locais

Write-Host "Iniciando geração dos módulos de Inventário e Eventos/Locais..." -ForegroundColor Cyan

# Garantir que estamos no diretório raiz do projeto
if (-not (Test-Path -Path "src")) {
    Write-Host "Diretório 'src' não encontrado. Por favor, execute este script a partir do diretório raiz do projeto." -ForegroundColor Red
    exit 1
}

#################################################
# MÓDULO DE INVENTÁRIO (INVENTORY)
#################################################

Write-Host "Criando módulo de Inventário..." -ForegroundColor Yellow

# Product Domain Entities
$productEntityContent = @"
// src/inventory/domain/entities/product.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { MaintenanceLog } from './maintenance-log.entity';

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING',
  DISCARDED = 'DISCARDED',
}

export class Product extends BaseEntity {
  name: string;
  code: string;
  color: string;
  size: string;
  rentalPrice: number;
  replacementCost?: number;
  quantity: number;
  status: ProductStatus;
  location?: string;
  description?: string;
  maintenanceInfo?: string;
  
  // Relacionamentos
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  maintenanceLogs?: MaintenanceLog[];
}
"@
New-Item -Path "src/inventory/domain/entities" -ItemType Directory -Force
Set-Content -Path "src/inventory/domain/entities/product.entity.ts" -Value $productEntityContent

$categoryEntityContent = @"
// src/inventory/domain/entities/category.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Product } from './product.entity';

export class Category extends BaseEntity {
  name: string;
  description?: string;
  
  // Relacionamentos
  products?: Product[];
}
"@
Set-Content -Path "src/inventory/domain/entities/category.entity.ts" -Value $categoryEntityContent

$productImageEntityContent = @"
// src/inventory/domain/entities/product-image.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export class ProductImage extends BaseEntity {
  url: string;
  isMain: boolean;
  productId: string;
}
"@
Set-Content -Path "src/inventory/domain/entities/product-image.entity.ts" -Value $productImageEntityContent

$maintenanceLogEntityContent = @"
// src/inventory/domain/entities/maintenance-log.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class MaintenanceLog extends BaseEntity {
  productId: string;
  description: string;
  cost?: number;
  startDate: Date;
  endDate?: Date;
  status: MaintenanceStatus;
}
"@
Set-Content -Path "src/inventory/domain/entities/maintenance-log.entity.ts" -Value $maintenanceLogEntityContent

# Product Repository Interfaces
$productRepositoryInterfaceContent = @"
// src/inventory/domain/repositories/product.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Product, ProductStatus } from '../entities/product.entity';

export interface IProductRepository extends IBaseRepository<Product> {
  findByCode(code: string): Promise<Product | null>;
  findByStatus(status: ProductStatus): Promise<Product[]>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findAvailable(): Promise<Product[]>;
  updateStatus(id: string, status: ProductStatus): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
  getMostRented(limit: number): Promise<Product[]>;
}
"@
New-Item -Path "src/inventory/domain/repositories" -ItemType Directory -Force
Set-Content -Path "src/inventory/domain/repositories/product.repository.interface.ts" -Value $productRepositoryInterfaceContent

$categoryRepositoryInterfaceContent = @"
// src/inventory/domain/repositories/category.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository extends IBaseRepository<Category> {
  findByName(name: string): Promise<Category | null>;
  getWithProductCount(): Promise<{ id: string; name: string; productCount: number }[]>;
}
"@
Set-Content -Path "src/inventory/domain/repositories/category.repository.interface.ts" -Value $categoryRepositoryInterfaceContent

$productImageRepositoryInterfaceContent = @"
// src/inventory/domain/repositories/product-image.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { ProductImage } from '../entities/product-image.entity';

export interface IProductImageRepository extends IBaseRepository<ProductImage> {
  findByProductId(productId: string): Promise<ProductImage[]>;
  findMainImage(productId: string): Promise<ProductImage | null>;
  setMainImage(id: string): Promise<ProductImage>;
}
"@
Set-Content -Path "src/inventory/domain/repositories/product-image.repository.interface.ts" -Value $productImageRepositoryInterfaceContent

$maintenanceLogRepositoryInterfaceContent = @"
// src/inventory/domain/repositories/maintenance-log.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { MaintenanceLog, MaintenanceStatus } from '../entities/maintenance-log.entity';

export interface IMaintenanceLogRepository extends IBaseRepository<MaintenanceLog> {
  findByProductId(productId: string): Promise<MaintenanceLog[]>;
  findActiveByProductId(productId: string): Promise<MaintenanceLog[]>;
  findByStatus(status: MaintenanceStatus): Promise<MaintenanceLog[]>;
  completeMaintenanceLog(id: string, endDate: Date): Promise<MaintenanceLog>;
}
"@
Set-Content -Path "src/inventory/domain/repositories/maintenance-log.repository.interface.ts" -Value $maintenanceLogRepositoryInterfaceContent

# Product Repository Implementations
$productRepositoryContent = @"
// src/inventory/infrastructure/repositories/product.repository.ts
import { Injectable } from '@nestjs/common';
import { Product, ProductStatus } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        maintenanceLogs: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
      },
    });
  }

  async findByCode(code: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { code },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async findByStatus(status: ProductStatus): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { status },
      include: {
        category: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findAvailable(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { 
        status: ProductStatus.AVAILABLE,
        quantity: { gt: 0 },
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: Partial<Product>): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: data.name,
        code: data.code,
        color: data.color,
        size: data.size,
        rentalPrice: data.rentalPrice as any,
        replacementCost: data.replacementCost as any,
        quantity: data.quantity,
        status: data.status,
        location: data.location,
        description: data.description,
        maintenanceInfo: data.maintenanceInfo,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: data as any,
      include: {
        category: true,
        images: true,
      },
    });
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { status },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { color: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async getMostRented(limit: number): Promise<Product[]> {
    // Isso seria implementado com um raw SQL ou uma consulta mais complexa
    // para obter produtos mais alugados com base em dados de contratos
    // Esta é uma implementação simulada
    return this.prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true,
      },
    });
  }
}
"@
New-Item -Path "src/inventory/infrastructure/repositories" -ItemType Directory -Force
Set-Content -Path "src/inventory/infrastructure/repositories/product.repository.ts" -Value $productRepositoryContent

$categoryRepositoryContent = @"
// src/inventory/infrastructure/repositories/category.repository.ts
import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  async getWithProductCount(): Promise<{ id: string; name: string; productCount: number }[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
    }));
  }

  async create(data: Partial<Category>): Promise<Category> {
    return this.prisma.category.create({
      data: data as any,
    });
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
"@
Set-Content -Path "src/inventory/infrastructure/repositories/category.repository.ts" -Value $categoryRepositoryContent

$productImageRepositoryContent = @"
// src/inventory/infrastructure/repositories/product-image.repository.ts
import { Injectable } from '@nestjs/common';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { IProductImageRepository } from '../../domain/repositories/product-image.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ProductImageRepository implements IProductImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductImage[]> {
    return this.prisma.productImage.findMany();
  }

  async findById(id: string): Promise<ProductImage | null> {
    return this.prisma.productImage.findUnique({
      where: { id },
    });
  }

  async findByProductId(productId: string): Promise<ProductImage[]> {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { isMain: 'desc' },
    });
  }

  async findMainImage(productId: string): Promise<ProductImage | null> {
    return this.prisma.productImage.findFirst({
      where: {
        productId,
        isMain: true,
      },
    });
  }

  async create(data: Partial<ProductImage>): Promise<ProductImage> {
    // Se for a primeira imagem, marcar como principal
    const imagesCount = await this.prisma.productImage.count({
      where: { productId: data.productId },
    });

    return this.prisma.productImage.create({
      data: {
        url: data.url,
        isMain: data.isMain ?? imagesCount === 0,
        productId: data.productId,
      },
    });
  }

  async update(id: string, data: Partial<ProductImage>): Promise<ProductImage> {
    return this.prisma.productImage.update({
      where: { id },
      data: data as any,
    });
  }

  async setMainImage(id: string): Promise<ProductImage> {
    // Primeiro, obter a imagem para saber o productId
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new Error('Imagem não encontrada');
    }

    // Remover flag de principal de todas as imagens do produto
    await this.prisma.productImage.updateMany({
      where: { productId: image.productId },
      data: { isMain: false },
    });

    // Definir esta como principal
    return this.prisma.productImage.update({
      where: { id },
      data: { isMain: true },
    });
  }

  async delete(id: string): Promise<void> {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });

    await this.prisma.productImage.delete({
      where: { id },
    });

    // Se a imagem excluída era a principal, definir outra como principal
    if (image.isMain) {
      const nextImage = await this.prisma.productImage.findFirst({
        where: { productId: image.productId },
      });

      if (nextImage) {
        await this.prisma.productImage.update({
          where: { id: nextImage.id },
          data: { isMain: true },
        });
      }
    }
  }
}
"@
Set-Content -Path "src/inventory/infrastructure/repositories/product-image.repository.ts" -Value $productImageRepositoryContent

$maintenanceLogRepositoryContent = @"
// src/inventory/infrastructure/repositories/maintenance-log.repository.ts
import { Injectable } from '@nestjs/common';
import { MaintenanceLog, MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
import { IMaintenanceLogRepository } from '../../domain/repositories/maintenance-log.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class MaintenanceLogRepository implements IMaintenanceLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MaintenanceLog[]> {
    return this.prisma.maintenanceLog.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async findById(id: string): Promise<MaintenanceLog | null> {
    return this.prisma.maintenanceLog.findUnique({
      where: { id },
    });
  }

  async findByProductId(productId: string): Promise<MaintenanceLog[]> {
    return this.prisma.maintenanceLog.findMany({
      where: { productId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findActiveByProductId(productId: string): Promise<MaintenanceLog[]> {
    return this.prisma.maintenanceLog.findMany({
      where: {
        productId,
        status: {
          in: [MaintenanceStatus.SCHEDULED, MaintenanceStatus.IN_PROGRESS],
        },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async findByStatus(status: MaintenanceStatus): Promise<MaintenanceLog[]> {
    return this.prisma.maintenanceLog.findMany({
      where: { status },
      orderBy: { startDate: 'asc' },
    });
  }

  async create(data: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
    return this.prisma.maintenanceLog.create({
      data: {
        productId: data.productId,
        description: data.description,
        cost: data.cost as any,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      },
    });
  }

  async update(id: string, data: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
    return this.prisma.maintenanceLog.update({
      where: { id },
      data: data as any,
    });
  }

  async completeMaintenanceLog(id: string, endDate: Date): Promise<MaintenanceLog> {
    return this.prisma.maintenanceLog.update({
      where: { id },
      data: {
        endDate,
        status: MaintenanceStatus.COMPLETED,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.maintenanceLog.delete({
      where: { id },
    });
  }
}
"@
Set-Content -Path "src/inventory/infrastructure/repositories/maintenance-log.repository.ts" -Value $maintenanceLogRepositoryContent

# Product DTOs
$productDtosContent = @"
// src/inventory/application/dtos/product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, 
  IsInt, Min, IsArray, ValidateNested, IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../../domain/entities/product.entity';

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

  @ApiProperty({ description: 'Status do produto', enum: ProductStatus, default: ProductStatus.AVAILABLE })
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

  @ApiPropertyOptional({ description: 'Informações sobre manutenção do produto' })
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

  @ApiPropertyOptional({ description: 'Status do produto', enum: ProductStatus })
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

  @ApiPropertyOptional({ description: 'Informações sobre manutenção do produto' })
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
"@
New-Item -Path "src/inventory/application/dtos" -ItemType Directory -Force
Set-Content -Path "src/inventory/application/dtos/product.dto.ts" -Value $productDtosContent

$categoryDtosContent = @"
// src/inventory/application/dtos/category.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CategoryWithProductCountDto extends CategoryDto {
  @ApiProperty({ description: 'Número de produtos na categoria' })
  productCount: number;
}

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nome da categoria' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Descrição da categoria' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Nome da categoria' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição da categoria' })
  @IsOptional()
  @IsString()
  description?: string;
}
"@
Set-Content -Path "src/inventory/application/dtos/category.dto.ts" -Value $categoryDtosContent

$productImageDtosContent = @"
// src/inventory/application/dtos/product-image.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ description: 'URL da imagem' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ description: 'Indica se é a imagem principal', default: false })
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
"@
Set-Content -Path "src/inventory/application/dtos/product-image.dto.ts" -Value $productImageDtosContent

$maintenanceLogDtosContent = @"
// src/inventory/application/dtos/maintenance-log.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, 
  Min, IsDate, IsISO8601 
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';

export class CreateMaintenanceLogDto {
  @ApiProperty({ description: 'ID do produto em manutenção' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Descrição do serviço de manutenção' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Custo da manutenção' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiProperty({ description: 'Data de início da manutenção', example: '2023-01-01' })
  @IsISO8601()
  @Type(() => Date)
  startDate: Date;

  @ApiPropertyOptional({ description: 'Data prevista de término', example: '2023-01-15' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: 'Status da manutenção', enum: MaintenanceStatus, default: MaintenanceStatus.SCHEDULED })
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;
}

export class UpdateMaintenanceLogDto {
  @ApiPropertyOptional({ description: 'Descrição do serviço de manutenção' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Custo da manutenção' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({ description: 'Data de início da manutenção', example: '2023-01-01' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Data prevista de término', example: '2023-01-15' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Status da manutenção', enum: MaintenanceStatus })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;
}

export class CompleteMaintenanceLogDto {
  @ApiProperty({ description: 'Data efetiva de término da manutenção', example: '2023-01-10' })
  @IsISO8601()
  @Type(() => Date)
  endDate: Date;
}

export class MaintenanceLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  cost?: number;

  @ApiProperty()
  startDate: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty({ enum: MaintenanceStatus })
  status: MaintenanceStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
"@
Set-Content -Path "src/inventory/application/dtos/maintenance-log.dto.ts" -Value $maintenanceLogDtosContent

# Product Services
$productServiceContent = @"
// src/inventory/application/services/product.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductStatus } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {
    super(productRepository);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findByCode(code: string): Promise<Product> {
    const product = await this.productRepository.findByCode(code);
    if (!product) {
      throw new NotFoundException(\`Produto com código \${code} não encontrado\`);
    }
    return product;
  }

  async findByStatus(status: ProductStatus): Promise<Product[]> {
    return this.productRepository.findByStatus(status);
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    // Verificar se a categoria existe
    const categoryExists = await this.categoryRepository.findById(categoryId);
    if (!categoryExists) {
      throw new NotFoundException(\`Categoria com ID \${categoryId} não encontrada\`);
    }

    return this.productRepository.findByCategoryId(categoryId);
  }

  async findAvailable(): Promise<Product[]> {
    return this.productRepository.findAvailable();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar se já existe um produto com o mesmo código
    const existingProduct = await this.productRepository.findByCode(createProductDto.code);
    if (existingProduct) {
      throw new BadRequestException(\`Já existe um produto com o código \${createProductDto.code}\`);
    }

    // Verificar se a categoria existe
    const categoryExists = await this.categoryRepository.findById(createProductDto.categoryId);
    if (!categoryExists) {
      throw new NotFoundException(\`Categoria com ID \${createProductDto.categoryId} não encontrada\`);
    }

    return this.productRepository.create(createProductDto);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Verificar se o produto existe
    await this.findById(id);

    // Se estiver atualizando o categoryId, verificar se a categoria existe
    if (updateProductDto.categoryId) {
      const categoryExists = await this.categoryRepository.findById(updateProductDto.categoryId);
      if (!categoryExists) {
        throw new NotFoundException(\`Categoria com ID \${updateProductDto.categoryId} não encontrada\`);
      }
    }

    return this.productRepository.update(id, updateProductDto);
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    // Verificar se o produto existe
    await this.findById(id);

    return this.productRepository.updateStatus(id, status);
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim().length < 3) {
      throw new BadRequestException('O termo de busca deve ter pelo menos 3 caracteres');
    }

    return this.productRepository.searchProducts(query.trim());
  }

  async getMostRented(limit: number = 10): Promise<Product[]> {
    return this.productRepository.getMostRented(limit);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.productRepository.delete(id);
  }
}
"@
New-Item -Path "src/inventory/application/services" -ItemType Directory -Force
Set-Content -Path "src/inventory/application/services/product.service.ts" -Value $productServiceContent

$categoryServiceContent = @"
// src/inventory/application/services/category.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(private readonly categoryRepository: ICategoryRepository) {
    super(categoryRepository);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findByName(name);
    if (!category) {
      throw new NotFoundException(\`Categoria com nome \${name} não encontrada\`);
    }
    return category;
  }

  async getWithProductCount() {
    return this.categoryRepository.getWithProductCount();
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar se já existe uma categoria com o mesmo nome
    const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
    if (existingCategory) {
      throw new BadRequestException(\`Já existe uma categoria com o nome \${createCategoryDto.name}\`);
    }

    return this.categoryRepository.create(createCategoryDto);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // Verificar se a categoria existe
    await this.findById(id);

    // Se estiver atualizando o nome, verificar se já existe outra categoria com esse nome
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findByName(updateCategoryDto.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException(\`Já existe uma categoria com o nome \${updateCategoryDto.name}\`);
      }
    }

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async delete(id: string): Promise<void> {
    // Verificar se a categoria existe
    await this.findById(id);

    // Aqui poderia verificar se a categoria tem produtos associados
    // e impedir a exclusão ou implementar uma estratégia de exclusão

    return this.categoryRepository.delete(id);
  }
}
"@
Set-Content -Path "src/inventory/application/services/category.service.ts" -Value $categoryServiceContent

$productImageServiceContent = @"
// src/inventory/application/services/product-image.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { IProductImageRepository } from '../../domain/repositories/product-image.repository.interface';
import { CreateProductImageDto, UpdateProductImageDto } from '../dtos/product-image.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';

@Injectable()
export class ProductImageService extends BaseService<ProductImage> {
  constructor(
    private readonly productImageRepository: IProductImageRepository,
    private readonly productRepository: IProductRepository,
  ) {
    super(productImageRepository);
  }

  async findAll(): Promise<ProductImage[]> {
    return this.productImageRepository.findAll();
  }

  async findByProductId(productId: string): Promise<ProductImage[]> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(\`Produto com ID \${productId} não encontrado\`);
    }

    return this.productImageRepository.findByProductId(productId);
  }

  async findMainImage(productId: string): Promise<ProductImage | null> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(\`Produto com ID \${productId} não encontrado\`);
    }

    return this.productImageRepository.findMainImage(productId);
  }

  async create(createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(createProductImageDto.productId);
    if (!productExists) {
      throw new NotFoundException(\`Produto com ID \${createProductImageDto.productId} não encontrado\`);
    }

    return this.productImageRepository.create(createProductImageDto);
  }

  async update(id: string, updateProductImageDto: UpdateProductImageDto): Promise<ProductImage> {
    // Verificar se a imagem existe
    await this.findById(id);

    return this.productImageRepository.update(id, updateProductImageDto);
  }

  async setMainImage(id: string): Promise<ProductImage> {
    // Verificar se a imagem existe
    await this.findById(id);

    return this.productImageRepository.setMainImage(id);
  }

  async delete(id: string): Promise<void> {
    // Verificar se a imagem existe
    await this.findById(id);

    return this.productImageRepository.delete(id);
  }
}
"@
Set-Content -Path "src/inventory/application/services/product-image.service.ts" -Value $productImageServiceContent

$maintenanceLogServiceContent = @"
// src/inventory/application/services/maintenance-log.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MaintenanceLog, MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
import { IMaintenanceLogRepository } from '../../domain/repositories/maintenance-log.repository.interface';
import { CreateMaintenanceLogDto, UpdateMaintenanceLogDto, CompleteMaintenanceLogDto } from '../dtos/maintenance-log.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductStatus } from '../../domain/entities/product.entity';

@Injectable()
export class MaintenanceLogService extends BaseService<MaintenanceLog> {
  constructor(
    private readonly maintenanceLogRepository: IMaintenanceLogRepository,
    private readonly productRepository: IProductRepository,
  ) {
    super(maintenanceLogRepository);
  }

  async findAll(): Promise<MaintenanceLog[]> {
    return this.maintenanceLogRepository.findAll();
  }

  async findByProductId(productId: string): Promise<MaintenanceLog[]> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(\`Produto com ID \${productId} não encontrado\`);
    }

    return this.maintenanceLogRepository.findByProductId(productId);
  }

  async findActiveByProductId(productId: string): Promise<MaintenanceLog[]> {
    // Verificar se o produto existe
    const productExists = await this.productRepository.findById(productId);
    if (!productExists) {
      throw new NotFoundException(\`Produto com ID \${productId} não encontrado\`);
    }

    return this.maintenanceLogRepository.findActiveByProductId(productId);
  }

  async findByStatus(status: MaintenanceStatus): Promise<MaintenanceLog[]> {
    return this.maintenanceLogRepository.findByStatus(status);
  }

  async create(createMaintenanceLogDto: CreateMaintenanceLogDto): Promise<MaintenanceLog> {
    // Verificar se o produto existe
    const product = await this.productRepository.findById(createMaintenanceLogDto.productId);
    if (!product) {
      throw new NotFoundException(\`Produto com ID \${createMaintenanceLogDto.productId} não encontrado\`);
    }

    // Se o status for SCHEDULED ou IN_PROGRESS, atualizar o status do produto para MAINTENANCE
    if (
      createMaintenanceLogDto.status === MaintenanceStatus.SCHEDULED ||
      createMaintenanceLogDto.status === MaintenanceStatus.IN_PROGRESS
    ) {
      await this.productRepository.updateStatus(product.id, ProductStatus.MAINTENANCE);
    }

    return this.maintenanceLogRepository.create(createMaintenanceLogDto);
  }

  async update(id: string, updateMaintenanceLogDto: UpdateMaintenanceLogDto): Promise<MaintenanceLog> {
    // Verificar se o log de manutenção existe
    const maintenanceLog = await this.findById(id);

    // Se estiver mudando para COMPLETED, verificar se endDate está definido
    if (
      updateMaintenanceLogDto.status === MaintenanceStatus.COMPLETED &&
      !updateMaintenanceLogDto.endDate &&
      !maintenanceLog.endDate
    ) {
      throw new BadRequestException('Data de término deve ser informada para completar a manutenção');
    }

    // Atualizar o log
    const updatedLog = await this.maintenanceLogRepository.update(id, updateMaintenanceLogDto);

    // Se o status for alterado para COMPLETED, atualizar o status do produto de volta para AVAILABLE
    if (updateMaintenanceLogDto.status === MaintenanceStatus.COMPLETED) {
      // Verificar se existem outros logs ativos para o produto
      const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(updatedLog.productId);
      
      // Se não houver outros logs ativos, atualizar o status do produto
      if (activeLogs.length === 0) {
        await this.productRepository.updateStatus(updatedLog.productId, ProductStatus.AVAILABLE);
      }
    }

    return updatedLog;
  }

  async completeMaintenance(id: string, completeDto: CompleteMaintenanceLogDto): Promise<MaintenanceLog> {
    // Verificar se o log de manutenção existe
    const maintenanceLog = await this.findById(id);

    // Verificar se o log já está completo
    if (maintenanceLog.status === MaintenanceStatus.COMPLETED) {
      throw new BadRequestException('Essa manutenção já foi concluída');
    }

    // Completar a manutenção
    const updatedLog = await this.maintenanceLogRepository.completeMaintenanceLog(id, completeDto.endDate);

    // Verificar se existem outros logs ativos para o produto
    const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(updatedLog.productId);
    
    // Se não houver outros logs ativos, atualizar o status do produto
    if (activeLogs.length === 0) {
      await this.productRepository.updateStatus(updatedLog.productId, ProductStatus.AVAILABLE);
    }

    return updatedLog;
  }

  async delete(id: string): Promise<void> {
    // Verificar se o log de manutenção existe
    const maintenanceLog = await this.findById(id);

    await this.maintenanceLogRepository.delete(id);

    // Se foi um log ativo (SCHEDULED ou IN_PROGRESS), verificar se há outros logs ativos
    if (
      maintenanceLog.status === MaintenanceStatus.SCHEDULED ||
      maintenanceLog.status === MaintenanceStatus.IN_PROGRESS
    ) {
      const activeLogs = await this.maintenanceLogRepository.findActiveByProductId(maintenanceLog.productId);
      
      // Se não houver outros logs ativos, atualizar o status do produto
      if (activeLogs.length === 0) {
        await this.productRepository.updateStatus(maintenanceLog.productId, ProductStatus.AVAILABLE);
      }
    }
  }
}
"@
Set-Content -Path "src/inventory/application/services/maintenance-log.service.ts" -Value $maintenanceLogServiceContent

# Product Controllers
$productControllerContent = @"
// src/inventory/presentation/controllers/product.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, HttpStatus, ParseEnumPipe 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery 
} from '@nestjs/swagger';
import { ProductService } from '../../application/services/product.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../../application/dtos/product.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { ProductStatus } from '../../domain/entities/product.entity';

@ApiTags('Produtos')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso', type: [ProductResponseDto] })
  async findAll() {
    return this.productService.findAll();
  }

  @Get('available')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar produtos disponíveis para aluguel' })
  @ApiResponse({ status: 200, description: 'Lista de produtos disponíveis', type: [ProductResponseDto] })
  async findAvailable() {
    return this.productService.findAvailable();
  }

  @Get('most-rented')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Listar produtos mais alugados' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de produtos (default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista dos produtos mais alugados', type: [ProductResponseDto] })
  async getMostRented(@Query('limit') limit?: number) {
    return this.productService.getMostRented(limit ? parseInt(limit) : undefined);
  }

  @Get('search')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar produtos por termo' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Termo de busca (mínimo 3 caracteres)' })
  @ApiResponse({ status: 200, description: 'Resultados da busca', type: [ProductResponseDto] })
  async searchProducts(@Query('q') query: string) {
    return this.productService.searchProducts(query);
  }

  @Get('status/:status')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar produtos por status' })
  @ApiParam({ name: 'status', enum: ProductStatus, description: 'Status do produto' })
  @ApiResponse({ status: 200, description: 'Lista de produtos filtrada por status', type: [ProductResponseDto] })
  async findByStatus(
    @Param('status', new ParseEnumPipe(ProductStatus)) status: ProductStatus
  ) {
    return this.productService.findByStatus(status);
  }

  @Get('category/:categoryId')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar produtos por categoria' })
  @ApiParam({ name: 'categoryId', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Lista de produtos por categoria', type: [ProductResponseDto] })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.productService.findByCategoryId(categoryId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get('code/:code')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar produto por código' })
  @ApiParam({ name: 'code', description: 'Código do produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findByCode(@Param('code') code: string) {
    return this.productService.findByCode(code);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Put(':id/status')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Atualizar status do produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiQuery({ name: 'status', enum: ProductStatus, description: 'Novo status do produto' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async updateStatus(
    @Param('id') id: string,
    @Query('status', new ParseEnumPipe(ProductStatus)) status: ProductStatus
  ) {
    return this.productService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Produto excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remove(@Param('id') id: string) {
    await this.productService.delete(id);
    return;
  }
}
"@
New-Item -Path "src/inventory/presentation/controllers" -ItemType Directory -Force
Set-Content -Path "src/inventory/presentation/controllers/product.controller.ts" -Value $productControllerContent

$categoryControllerContent = @"
// src/inventory/presentation/controllers/category.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { CategoryService } from '../../application/services/category.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryDto, CategoryWithProductCountDto } from '../../application/dtos/category.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@ApiTags('Categorias')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso', type: [CategoryDto] })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get('with-product-count')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Listar categorias com contagem de produtos' })
  @ApiResponse({ status: 200, description: 'Lista de categorias com contagem', type: [CategoryWithProductCountDto] })
  async getWithProductCount() {
    return this.categoryService.getWithProductCount();
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada com sucesso', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Get('name/:name')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar categoria por nome' })
  @ApiParam({ name: 'name', description: 'Nome da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada com sucesso', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findByName(@Param('name') name: string) {
    return this.categoryService.findByName(name);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Criar nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso', type: CategoryDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Categoria excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async remove(@Param('id') id: string) {
    await this.categoryService.delete(id);
    return;
  }
}
"@
Set-Content -Path "src/inventory/presentation/controllers/category.controller.ts" -Value $categoryControllerContent

$productImageControllerContent = @"
// src/inventory/presentation/controllers/product-image.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { ProductImageService } from '../../application/services/product-image.service';
import { 
  CreateProductImageDto, UpdateProductImageDto, ProductImageResponseDto 
} from '../../application/dtos/product-image.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@ApiTags('Imagens de Produtos')
@Controller('product-images')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Get('product/:productId')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar imagens de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Lista de imagens do produto', type: [ProductImageResponseDto] })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findByProductId(@Param('productId') productId: string) {
    return this.productImageService.findByProductId(productId);
  }

  @Get('product/:productId/main')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Obter imagem principal de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Imagem principal do produto', type: ProductImageResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado ou sem imagem principal' })
  async findMainImage(@Param('productId') productId: string) {
    return this.productImageService.findMainImage(productId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar imagem por ID' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  @ApiResponse({ status: 200, description: 'Imagem encontrada com sucesso', type: ProductImageResponseDto })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.productImageService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Adicionar nova imagem a um produto' })
  @ApiResponse({ status: 201, description: 'Imagem adicionada com sucesso', type: ProductImageResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async create(@Body() createProductImageDto: CreateProductImageDto) {
    return this.productImageService.create(createProductImageDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Atualizar imagem' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  @ApiResponse({ status: 200, description: 'Imagem atualizada com sucesso', type: ProductImageResponseDto })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async update(@Param('id') id: string, @Body() updateProductImageDto: UpdateProductImageDto) {
    return this.productImageService.update(id, updateProductImageDto);
  }

  @Put(':id/set-main')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Definir imagem como principal' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  @ApiResponse({ status: 200, description: 'Imagem definida como principal', type: ProductImageResponseDto })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async setMainImage(@Param('id') id: string) {
    return this.productImageService.setMainImage(id);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Excluir imagem' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Imagem excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async remove(@Param('id') id: string) {
    await this.productImageService.delete(id);
    return;
  }
}
"@
Set-Content -Path "src/inventory/presentation/controllers/product-image.controller.ts" -Value $productImageControllerContent

$maintenanceLogControllerContent = @"
// src/inventory/presentation/controllers/maintenance-log.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, ParseEnumPipe, HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery 
} from '@nestjs/swagger';
import { MaintenanceLogService } from '../../application/services/maintenance-log.service';
import { 
  CreateMaintenanceLogDto, UpdateMaintenanceLogDto, MaintenanceLogResponseDto, CompleteMaintenanceLogDto
} from '../../application/dtos/maintenance-log.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';

@ApiTags('Registros de Manutenção')
@Controller('maintenance-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaintenanceLogController {
  constructor(private readonly maintenanceLogService: MaintenanceLogService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Listar todos os registros de manutenção' })
  @ApiResponse({ status: 200, description: 'Lista de registros de manutenção', type: [MaintenanceLogResponseDto] })
  async findAll() {
    return this.maintenanceLogService.findAll();
  }

  @Get('product/:productId')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar registros de manutenção de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Lista de registros de manutenção do produto', type: [MaintenanceLogResponseDto] })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findByProductId(@Param('productId') productId: string) {
    return this.maintenanceLogService.findByProductId(productId);
  }

  @Get('product/:productId/active')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar registros de manutenção ativos de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Lista de registros de manutenção ativos do produto', type: [MaintenanceLogResponseDto] })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findActiveByProductId(@Param('productId') productId: string) {
    return this.maintenanceLogService.findActiveByProductId(productId);
  }

  @Get('status/:status')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Listar registros de manutenção por status' })
  @ApiParam({ name: 'status', enum: MaintenanceStatus, description: 'Status da manutenção' })
  @ApiResponse({ status: 200, description: 'Lista de registros de manutenção filtrada por status', type: [MaintenanceLogResponseDto] })
  async findByStatus(
    @Param('status', new ParseEnumPipe(MaintenanceStatus)) status: MaintenanceStatus
  ) {
    return this.maintenanceLogService.findByStatus(status);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar registro de manutenção por ID' })
  @ApiParam({ name: 'id', description: 'ID do registro de manutenção' })
  @ApiResponse({ status: 200, description: 'Registro de manutenção encontrado com sucesso', type: MaintenanceLogResponseDto })
  @ApiResponse({ status: 404, description: 'Registro de manutenção não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.maintenanceLogService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Criar novo registro de manutenção' })
  @ApiResponse({ status: 201, description: 'Registro de manutenção criado com sucesso', type: MaintenanceLogResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async create(@Body() createMaintenanceLogDto: CreateMaintenanceLogDto) {
    return this.maintenanceLogService.create(createMaintenanceLogDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Atualizar registro de manutenção' })
  @ApiParam({ name: 'id', description: 'ID do registro de manutenção' })
  @ApiResponse({ status: 200, description: 'Registro de manutenção atualizado com sucesso', type: MaintenanceLogResponseDto })
  @ApiResponse({ status: 404, description: 'Registro de manutenção não encontrado' })
  async update(@Param('id') id: string, @Body() updateMaintenanceLogDto: UpdateMaintenanceLogDto) {
    return this.maintenanceLogService.update(id, updateMaintenanceLogDto);
  }

  @Put(':id/complete')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Completar registro de manutenção' })
  @ApiParam({ name: 'id', description: 'ID do registro de manutenção' })
  @ApiResponse({ status: 200, description: 'Registro de manutenção completado com sucesso', type: MaintenanceLogResponseDto })
  @ApiResponse({ status: 404, description: 'Registro de manutenção não encontrado' })
  async completeMaintenance(
    @Param('id') id: string,
    @Body() completeMaintenanceLogDto: CompleteMaintenanceLogDto
  ) {
    return this.maintenanceLogService.completeMaintenance(id, completeMaintenanceLogDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Excluir registro de manutenção' })
  @ApiParam({ name: 'id', description: 'ID do registro de manutenção' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Registro de manutenção excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Registro de manutenção não encontrado' })
  async remove(@Param('id') id: string) {
    await this.maintenanceLogService.delete(id);
    return;
  }
}
"@
Set-Content -Path "src/inventory/presentation/controllers/maintenance-log.controller.ts" -Value $maintenanceLogControllerContent

# Inventory Module
$inventoryModuleContent = @"
// src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { ProductController } from './presentation/controllers/product.controller';
import { CategoryController } from './presentation/controllers/category.controller';
import { ProductImageController } from './presentation/controllers/product-image.controller';
import { MaintenanceLogController } from './presentation/controllers/maintenance-log.controller';
import { ProductService } from './application/services/product.service';
import { CategoryService } from './application/services/category.service';
import { ProductImageService } from './application/services/product-image.service';
import { MaintenanceLogService } from './application/services/maintenance-log.service';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { ProductImageRepository } from './infrastructure/repositories/product-image.repository';
import { MaintenanceLogRepository } from './infrastructure/repositories/maintenance-log.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    ProductController,
    CategoryController,
    ProductImageController,
    MaintenanceLogController,
  ],
  providers: [
    ProductService,
    CategoryService,
    ProductImageService,
    MaintenanceLogService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    {
      provide: 'IProductImageRepository',
      useClass: ProductImageRepository,
    },
    {
      provide: 'IMaintenanceLogRepository',
      useClass: MaintenanceLogRepository,
    },
  ],
  exports: [
    ProductService,
    CategoryService,
    ProductImageService,
    MaintenanceLogService,
  ],
})
export class InventoryModule {}
"@
Set-Content -Path "src/inventory/inventory.module.ts" -Value $inventoryModuleContent

#################################################
# MÓDULO DE EVENTOS/LOCAIS (EVENTS)
#################################################

Write-Host "Criando módulo de Eventos/Locais..." -ForegroundColor Yellow

# Event and Location Domain Entities
$eventEntityContent = @"
// src/events/domain/entities/event.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Location } from './location.entity';

export class Event extends BaseEntity {
  name: string;
  date: Date;
  category: string;
  locationId: string;
  capacity?: number;
  organizer?: string;
  description?: string;
  
  // Relacionamentos
  location?: Location;
}
"@
New-Item -Path "src/events/domain/entities" -ItemType Directory -Force
Set-Content -Path "src/events/domain/entities/event.entity.ts" -Value $eventEntityContent

$locationEntityContent = @"
// src/events/domain/entities/location.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Event } from './event.entity';

export class Location extends BaseEntity {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity?: number;
  type?: string;
  description?: string;
  
  // Relacionamentos
  events?: Event[];
}
"@
Set-Content -Path "src/events/domain/entities/location.entity.ts" -Value $locationEntityContent

# Event and Location Repository Interfaces
$eventRepositoryInterfaceContent = @"
// src/events/domain/repositories/event.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Event } from '../entities/event.entity';

export interface IEventRepository extends IBaseRepository<Event> {
  findByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
  findByLocationId(locationId: string): Promise<Event[]>;
  findUpcomingEvents(limit: number): Promise<Event[]>;
  findByCategory(category: string): Promise<Event[]>;
  countEventsByMonth(): Promise<{ month: number; count: number }[]>;
}
"@
New-Item -Path "src/events/domain/repositories" -ItemType Directory -Force
Set-Content -Path "src/events/domain/repositories/event.repository.interface.ts" -Value $eventRepositoryInterfaceContent

$locationRepositoryInterfaceContent = @"
// src/events/domain/repositories/location.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Location } from '../entities/location.entity';

export interface ILocationRepository extends IBaseRepository<Location> {
  findByCity(city: string): Promise<Location[]>;
  findByName(name: string): Promise<Location | null>;
  findMostUsedLocations(limit: number): Promise<{ id: string; name: string; eventCount: number }[]>;
}
"@
Set-Content -Path "src/events/domain/repositories/location.repository.interface.ts" -Value $locationRepositoryInterfaceContent

# Event and Location Repository Implementations
$eventRepositoryContent = @"
// src/events/infrastructure/repositories/event.repository.ts
import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: string): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async findByLocationId(locationId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { locationId },
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async findUpcomingEvents(limit: number): Promise<Event[]> {
    const today = new Date();
    return this.prisma.event.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
      take: limit,
    });
  }

  async findByCategory(category: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { 
        category: { 
          equals: category, 
          mode: 'insensitive' 
        } 
      },
      include: {
        location: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async countEventsByMonth(): Promise<{ month: number; count: number }[]> {
    const currentYear = new Date().getFullYear();
    const counts = await this.prisma.$queryRaw\`
      SELECT 
        EXTRACT(MONTH FROM "date") as month,
        COUNT(*) as count
      FROM "Event"
      WHERE EXTRACT(YEAR FROM "date") = \${currentYear}
      GROUP BY EXTRACT(MONTH FROM "date")
      ORDER BY month
    \`;
    
    return counts as { month: number; count: number }[];
  }

  async create(data: Partial<Event>): Promise<Event> {
    return this.prisma.event.create({
      data: data as any,
      include: {
        location: true,
      },
    });
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    return this.prisma.event.update({
      where: { id },
      data: data as any,
      include: {
        location: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id },
    });
  }
}
"@
New-Item -Path "src/events/infrastructure/repositories" -ItemType Directory -Force
Set-Content -Path "src/events/infrastructure/repositories/event.repository.ts" -Value $eventRepositoryContent

# Continuação do arquivo location.repository.ts
$locationRepositoryContentContinued = @"
  async findByName(name: string): Promise<Location | null> {
    return this.prisma.location.findFirst({
      where: { 
        name: { 
          equals: name, 
          mode: 'insensitive' 
        } 
      },
    });
  }

  async findMostUsedLocations(limit: number): Promise<{ id: string; name: string; eventCount: number }[]> {
    const locations = await this.prisma.location.findMany({
      include: {
        _count: {
          select: { events: true },
        },
      },
      orderBy: {
        events: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return locations.map(location => ({
      id: location.id,
      name: location.name,
      eventCount: location._count.events,
    }));
  }

  async create(data: Partial<Location>): Promise<Location> {
    return this.prisma.location.create({
      data: data as any,
    });
  }

  async update(id: string, data: Partial<Location>): Promise<Location> {
    return this.prisma.location.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.location.delete({
      where: { id },
    });
  }
}
"@
Add-Content -Path "src/events/infrastructure/repositories/location.repository.ts" -Value $locationRepositoryContentContinued

# Event and Location DTOs
$eventDtosContent = @"
// src/events/application/dtos/event.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsDate, IsInt, IsOptional, 
  Min, Max, IsISO8601
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class CreateEventDto {
  @ApiProperty({ description: 'Nome do evento' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Data do evento', example: '2023-01-01T20:00:00Z' })
  @IsISO8601()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Categoria do evento (casamento, formatura, etc.)' })
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

  @ApiPropertyOptional({ description: 'Data do evento', example: '2023-01-01T20:00:00Z' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional({ description: 'Categoria do evento (casamento, formatura, etc.)' })
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
"@
New-Item -Path "src/events/application/dtos" -ItemType Directory -Force
Set-Content -Path "src/events/application/dtos/event.dto.ts" -Value $eventDtosContent

$locationDtosContent = @"
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

  @ApiPropertyOptional({ description: 'Tipo de local (salão, clube, hotel, etc.)' })
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

  @ApiPropertyOptional({ description: 'Tipo de local (salão, clube, hotel, etc.)' })
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
"@
Set-Content -Path "src/events/application/dtos/location.dto.ts" -Value $locationDtosContent

# Event and Location Services
$eventServiceContent = @"
// src/events/application/services/event.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { ILocationRepository } from '../../domain/repositories/location.repository.interface';

@Injectable()
export class EventService extends BaseService<Event> {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly locationRepository: ILocationRepository,
  ) {
    super(eventRepository);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    if (startDate > endDate) {
      throw new BadRequestException('A data inicial deve ser anterior à data final');
    }
    
    return this.eventRepository.findByDateRange(startDate, endDate);
  }

  async findByLocationId(locationId: string): Promise<Event[]> {
    // Verificar se o local existe
    const locationExists = await this.locationRepository.findById(locationId);
    if (!locationExists) {
      throw new NotFoundException(\`Local com ID \${locationId} não encontrado\`);
    }

    return this.eventRepository.findByLocationId(locationId);
  }

  async findUpcomingEvents(limit: number = 10): Promise<Event[]> {
    return this.eventRepository.findUpcomingEvents(limit);
  }

  async findByCategory(category: string): Promise<Event[]> {
    return this.eventRepository.findByCategory(category);
  }

  async countEventsByMonth() {
    return this.eventRepository.countEventsByMonth();
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Verificar se o local existe
    const locationExists = await this.locationRepository.findById(createEventDto.locationId);
    if (!locationExists) {
      throw new NotFoundException(\`Local com ID \${createEventDto.locationId} não encontrado\`);
    }

    // Verificar se a data do evento é futura
    const eventDate = new Date(createEventDto.date);
    const today = new Date();
    
    if (eventDate < today) {
      throw new BadRequestException('A data do evento deve ser futura');
    }

    return this.eventRepository.create(createEventDto);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    // Verificar se o evento existe
    await this.findById(id);

    // Se estiver atualizando o locationId, verificar se o local existe
    if (updateEventDto.locationId) {
      const locationExists = await this.locationRepository.findById(updateEventDto.locationId);
      if (!locationExists) {
        throw new NotFoundException(\`Local com ID \${updateEventDto.locationId} não encontrado\`);
      }
    }

    // Se estiver atualizando a data, verificar se é futura
    if (updateEventDto.date) {
      const eventDate = new Date(updateEventDto.date);
      const today = new Date();
      
      if (eventDate < today) {
        throw new BadRequestException('A data do evento deve ser futura');
      }
    }

    return this.eventRepository.update(id, updateEventDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.eventRepository.delete(id);
  }
}
"@
New-Item -Path "src/events/application/services" -ItemType Directory -Force
Set-Content -Path "src/events/application/services/event.service.ts" -Value $eventServiceContent

$locationServiceContent = @"
// src/events/application/services/location.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Location } from '../../domain/entities/location.entity';
import { ILocationRepository } from '../../domain/repositories/location.repository.interface';
import { CreateLocationDto, UpdateLocationDto } from '../dtos/location.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
export class LocationService extends BaseService<Location> {
  constructor(private readonly locationRepository: ILocationRepository) {
    super(locationRepository);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.findAll();
  }

  async findByCity(city: string): Promise<Location[]> {
    return this.locationRepository.findByCity(city);
  }

  async findByName(name: string): Promise<Location> {
    const location = await this.locationRepository.findByName(name);
    if (!location) {
      throw new NotFoundException(\`Local com nome \${name} não encontrado\`);
    }
    return location;
  }

  async findMostUsedLocations(limit: number = 10) {
    return this.locationRepository.findMostUsedLocations(limit);
  }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    // Verificar se já existe um local com o mesmo nome
    const existingLocation = await this.locationRepository.findByName(createLocationDto.name);
    if (existingLocation) {
      throw new BadRequestException(\`Já existe um local com o nome \${createLocationDto.name}\`);
    }

    return this.locationRepository.create(createLocationDto);
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    // Verificar se o local existe
    await this.findById(id);

    // Se estiver atualizando o nome, verificar se já existe outro local com esse nome
    if (updateLocationDto.name) {
      const existingLocation = await this.locationRepository.findByName(updateLocationDto.name);
      if (existingLocation && existingLocation.id !== id) {
        throw new BadRequestException(\`Já existe um local com o nome \${updateLocationDto.name}\`);
      }
    }

    return this.locationRepository.update(id, updateLocationDto);
  }

  async delete(id: string): Promise<void> {
    // Verificar se o local existe
    await this.findById(id);

    // Aqui poderia verificar se o local tem eventos associados
    // e impedir a exclusão ou implementar uma estratégia de exclusão

    return this.locationRepository.delete(id);
  }
}
"@
Set-Content -Path "src/events/application/services/location.service.ts" -Value $locationServiceContent

# Event and Location Controllers
$eventControllerContent = @"
// src/events/presentation/controllers/event.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery 
} from '@nestjs/swagger';
import { EventService } from '../../application/services/event.service';
import { 
  CreateEventDto, UpdateEventDto, EventResponseDto, MonthlyEventCountDto 
} from '../../application/dtos/event.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@ApiTags('Eventos')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar todos os eventos' })
  @ApiResponse({ status: 200, description: 'Lista de eventos retornada com sucesso', type: [EventResponseDto] })
  async findAll() {
    return this.eventService.findAll();
  }

  @Get('upcoming')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar próximos eventos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de eventos (default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista dos próximos eventos', type: [EventResponseDto] })
  async findUpcomingEvents(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.eventService.findUpcomingEvents(limit);
  }

  @Get('date-range')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar eventos por intervalo de datas' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'Data final (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lista de eventos no intervalo de datas', type: [EventResponseDto] })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.eventService.findByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('location/:locationId')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar eventos por local' })
  @ApiParam({ name: 'locationId', description: 'ID do local' })
  @ApiResponse({ status: 200, description: 'Lista de eventos do local', type: [EventResponseDto] })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async findByLocationId(@Param('locationId') locationId: string) {
    return this.eventService.findByLocationId(locationId);
  }

  @Get('category/:category')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar eventos por categoria' })
  @ApiParam({ name: 'category', description: 'Categoria do evento' })
  @ApiResponse({ status: 200, description: 'Lista de eventos da categoria', type: [EventResponseDto] })
  async findByCategory(@Param('category') category: string) {
    return this.eventService.findByCategory(category);
  }

  @Get('monthly-count')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Obter contagem de eventos por mês' })
  @ApiResponse({ status: 200, description: 'Contagem de eventos por mês', type: [MonthlyEventCountDto] })
  async countEventsByMonth() {
    return this.eventService.countEventsByMonth();
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Evento encontrado com sucesso', type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Criar novo evento' })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso', type: EventResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Atualizar evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso', type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Excluir evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Evento excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async remove(@Param('id') id: string) {
    await this.eventService.delete(id);
    return;
  }
}
"@
New-Item -Path "src/events/presentation/controllers" -ItemType Directory -Force
Set-Content -Path "src/events/presentation/controllers/event.controller.ts" -Value $eventControllerContent

$locationControllerContent = @"
// src/events/presentation/controllers/location.controller.ts
import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, 
  ApiBearerAuth, ApiQuery 
} from '@nestjs/swagger';
import { LocationService } from '../../application/services/location.service';
import { 
  CreateLocationDto, UpdateLocationDto, LocationDto, LocationWithEventCountDto 
} from '../../application/dtos/location.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@ApiTags('Locais de Eventos')
@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar todos os locais' })
  @ApiResponse({ status: 200, description: 'Lista de locais retornada com sucesso', type: [LocationDto] })
  async findAll() {
    return this.locationService.findAll();
  }

  @Get('most-used')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Listar locais mais utilizados' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de locais (default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista dos locais mais utilizados', type: [LocationWithEventCountDto] })
  async findMostUsedLocations(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.locationService.findMostUsedLocations(limit);
  }

  @Get('city/:city')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar locais por cidade' })
  @ApiParam({ name: 'city', description: 'Nome da cidade' })
  @ApiResponse({ status: 200, description: 'Lista de locais da cidade', type: [LocationDto] })
  async findByCity(@Param('city') city: string) {
    return this.locationService.findByCity(city);
  }

  @Get('name/:name')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar local por nome' })
  @ApiParam({ name: 'name', description: 'Nome do local' })
  @ApiResponse({ status: 200, description: 'Local encontrado com sucesso', type: LocationDto })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async findByName(@Param('name') name: string) {
    return this.locationService.findByName(name);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar local por ID' })
  @ApiParam({ name: 'id', description: 'ID do local' })
  @ApiResponse({ status: 200, description: 'Local encontrado com sucesso', type: LocationDto })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.locationService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Criar novo local' })
  @ApiResponse({ status: 201, description: 'Local criado com sucesso', type: LocationDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Atualizar local' })
  @ApiParam({ name: 'id', description: 'ID do local' })
  @ApiResponse({ status: 200, description: 'Local atualizado com sucesso', type: LocationDto })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir local' })
  @ApiParam({ name: 'id', description: 'ID do local' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Local excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async remove(@Param('id') id: string) {
    await this.locationService.delete(id);
    return;
  }
}
"@
Set-Content -Path "src/events/presentation/controllers/location.controller.ts" -Value $locationControllerContent

# Events Module
$eventsModuleContent = @"
// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventController } from './presentation/controllers/event.controller';
import { LocationController } from './presentation/controllers/location.controller';
import { EventService } from './application/services/event.service';
import { LocationService } from './application/services/location.service';
import { EventRepository } from './infrastructure/repositories/event.repository';
import { LocationRepository } from './infrastructure/repositories/location.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    EventController,
    LocationController,
  ],
  providers: [
    EventService,
    LocationService,
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
    {
      provide: 'ILocationRepository',
      useClass: LocationRepository,
    },
  ],
  exports: [
    EventService,
    LocationService,
  ],
})
export class EventsModule {}
"@
Set-Content -Path "src/events/events.module.ts" -Value $eventsModuleContent

# Update app.module.ts to include new modules
$updatedAppModuleContent = @"
// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';
import { CustomersModule } from './customers/customers.module';
import { InventoryModule } from './inventory/inventory.module';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { LoggerMiddleware } from './shared/presentation/middlewares/logger.middleware';

@Module({
  imports: [
    // Configuração do ambiente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Módulos da aplicação
    PrismaModule,
    EmployeesModule,
    CustomersModule,
    InventoryModule,
    EventsModule,
    // Outros módulos serão adicionados posteriormente
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
"@
Set-Content -Path "src/app.module.ts" -Value $updatedAppModuleContent

# Mensagem final
Write-Host @"

=====================================
Geração dos módulos de Inventário e Eventos/Locais concluída!
=====================================

Arquivos gerados:

1. Módulo de Inventário:
   - Entidades: Product, Category, ProductImage, MaintenanceLog
   - Repositórios com métodos específicos para cada entidade
   - DTOs completos com validação
   - Serviços com regras de negócio implementadas
   - Controllers com rotas REST e documentação Swagger
   - Módulo configurado para injeção de dependências

2. Módulo de Eventos/Locais:
   - Entidades: Event, Location
   - Repositórios com métodos específicos
   - DTOs completos com validação
   - Serviços com regras de negócio
   - Controllers com rotas REST e documentação Swagger
   - Módulo configurado para injeção de dependências

3. Atualização do app.module.ts para incluir os novos módulos

Próximos passos:
1. Executar 'npm run start:dev' para iniciar o servidor
2. Acessar a documentação Swagger em http://localhost:3000/api/docs
3. Implementar os módulos de Autenticação e Contratos

"@ -ForegroundColor Green
