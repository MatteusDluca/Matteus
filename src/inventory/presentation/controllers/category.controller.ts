// src/inventory/presentation/controllers/category.controller.ts
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
import { CategoryService } from '../../application/services/category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryDto,
  CategoryWithProductCountDto,
} from '../../application/dtos/category.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Categorias')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    type: [CategoryDto],
  })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get('with-product-count')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar categorias com contagem de produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias com contagem',
    type: [CategoryWithProductCountDto],
  })
  async getWithProductCount() {
    return this.categoryService.getWithProductCount();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    type: CategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Get('name/:name')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar categoria por nome' })
  @ApiParam({ name: 'name', description: 'Nome da categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    type: CategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findByName(@Param('name') name: string) {
    return this.categoryService.findByName(name);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Criar nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: CategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: CategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Excluir categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Categoria excluída com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async remove(@Param('id') id: string) {
    await this.categoryService.delete(id);
    return;
  }
}
