// src/inventory/presentation/controllers/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from '../../application/services/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../../application/dtos/product.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { ProductStatus } from '../../domain/entities/product.entity';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Produtos')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: [ProductResponseDto],
  })
  async findAll() {
    return this.productService.findAll();
  }

  @Get('available')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar produtos disponíveis para aluguel' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos disponíveis',
    type: [ProductResponseDto],
  })
  async findAvailable() {
    return this.productService.findAvailable();
  }

  @Get('most-rented')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar produtos mais alugados' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de produtos (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dos produtos mais alugados',
    type: [ProductResponseDto],
  })
  async getMostRented(@Query('limit') limit?: number) {
    return this.productService.getMostRented(limit);
  }

  @Get('search')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar produtos por termo' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Termo de busca (mínimo 3 caracteres)',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca',
    type: [ProductResponseDto],
  })
  async searchProducts(@Query('q') query: string) {
    return this.productService.searchProducts(query);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar produtos por status' })
  @ApiParam({
    name: 'status',
    enum: ProductStatus,
    description: 'Status do produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos filtrada por status',
    type: [ProductResponseDto],
  })
  async findByStatus(@Param('status', new ParseEnumPipe(ProductStatus)) status: ProductStatus) {
    return this.productService.findByStatus(status);
  }

  @Get('category/:categoryId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar produtos por categoria' })
  @ApiParam({ name: 'categoryId', description: 'ID da categoria' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos por categoria',
    type: [ProductResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.productService.findByCategoryId(categoryId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get('code/:code')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar produto por código' })
  @ApiParam({ name: 'code', description: 'Código do produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findByCode(@Param('code') code: string) {
    return this.productService.findByCode(code);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar status do produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiQuery({
    name: 'status',
    enum: ProductStatus,
    description: 'Novo status do produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async updateStatus(
    @Param('id') id: string,
    @Query('status', new ParseEnumPipe(ProductStatus)) status: ProductStatus,
  ) {
    return this.productService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Excluir produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Produto excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remove(@Param('id') id: string) {
    await this.productService.delete(id);
    return;
  }
}
