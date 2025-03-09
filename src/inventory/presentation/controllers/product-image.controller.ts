// src/inventory/presentation/controllers/product-image.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductImageService } from '../../application/services/product-image.service';
import {
  CreateProductImageDto,
  UpdateProductImageDto,
  ProductImageResponseDto,
} from '../../application/dtos/product-image.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Imagens de Produtos')
@Controller('product-images')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Get('product/:productId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar imagens de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de imagens do produto',
    type: [ProductImageResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findByProductId(@Param('productId') productId: string) {
    return this.productImageService.findByProductId(productId);
  }

  @Get('product/:productId/main')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Obter imagem principal de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Imagem principal do produto',
    type: ProductImageResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado ou sem imagem principal',
  })
  async findMainImage(@Param('productId') productId: string) {
    return this.productImageService.findMainImage(productId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar imagem por ID' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  @ApiResponse({
    status: 200,
    description: 'Imagem encontrada com sucesso',
    type: ProductImageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.productImageService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Adicionar nova imagem a um produto' })
  @ApiResponse({
    status: 201,
    description: 'Imagem adicionada com sucesso',
    type: ProductImageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async create(@Body() createProductImageDto: CreateProductImageDto) {
    return this.productImageService.create(createProductImageDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar imagem' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  @ApiResponse({
    status: 200,
    description: 'Imagem atualizada com sucesso',
    type: ProductImageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async update(@Param('id') id: string, @Body() updateProductImageDto: UpdateProductImageDto) {
    return this.productImageService.update(id, updateProductImageDto);
  }

  @Put(':id/set-main')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Definir imagem como principal' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  @ApiResponse({
    status: 200,
    description: 'Imagem definida como principal',
    type: ProductImageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async setMainImage(@Param('id') id: string) {
    return this.productImageService.setMainImage(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Excluir imagem' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Imagem excluída com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async remove(@Param('id') id: string) {
    await this.productImageService.delete(id);
    return;
  }
}
