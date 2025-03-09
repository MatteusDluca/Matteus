// src/contracts/presentation/controllers/contract-item.controller.ts
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
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContractItemService } from '../../application/services/contract-item.service';
import {
  CreateContractItemDto,
  UpdateContractItemDto,
  ContractItemDto,
} from '../../application/dtos/contract-item.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Itens de Contrato')
@Controller('contract-items')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractItemController {
  constructor(private readonly contractItemService: ContractItemService) {}

  @Get('contract/:contractId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar itens de um contrato' })
  @ApiParam({ name: 'contractId', description: 'ID do contrato' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens do contrato',
    type: [ContractItemDto],
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findByContractId(@Param('contractId') contractId: string) {
    return this.contractItemService.findByContractId(contractId);
  }

  @Get('product/:productId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar aluguéis de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de aluguéis do produto',
    type: [ContractItemDto],
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findByProductId(@Param('productId') productId: string) {
    return this.contractItemService.findByProductId(productId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar item por ID' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({
    status: 200,
    description: 'Item encontrado com sucesso',
    type: ContractItemDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.contractItemService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Adicionar item ao contrato' })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado com sucesso',
    type: ContractItemDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Recurso não encontrado' })
  async create(@Body() createContractItemDto: CreateContractItemDto) {
    return this.contractItemService.create(createContractItemDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar item do contrato' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({
    status: 200,
    description: 'Item atualizado com sucesso',
    type: ContractItemDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async update(@Param('id') id: string, @Body() updateContractItemDto: UpdateContractItemDto) {
    return this.contractItemService.update(id, updateContractItemDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Remover item do contrato' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Item removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contractItemService.delete(id);
  }
}
