// src/inventory/presentation/controllers/maintenance-log.controller.ts
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
  ParseEnumPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MaintenanceLogService } from '../../application/services/maintenance-log.service';
import {
  CreateMaintenanceLogDto,
  UpdateMaintenanceLogDto,
  MaintenanceLogResponseDto,
  CompleteMaintenanceLogDto,
} from '../../application/dtos/maintenance-log.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { MaintenanceStatus } from '../../domain/entities/maintenance-log.entity';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Registros de Manutenção')
@Controller('maintenance-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaintenanceLogController {
  constructor(private readonly maintenanceLogService: MaintenanceLogService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar todos os registros de manutenção' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de manutenção',
    type: [MaintenanceLogResponseDto],
  })
  async findAll() {
    return this.maintenanceLogService.findAll();
  }

  @Get('product/:productId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar registros de manutenção de um produto' })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de manutenção do produto',
    type: [MaintenanceLogResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findByProductId(@Param('productId') productId: string) {
    return this.maintenanceLogService.findByProductId(productId);
  }

  @Get('product/:productId/active')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Listar registros de manutenção ativos de um produto',
  })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de manutenção ativos do produto',
    type: [MaintenanceLogResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findActiveByProductId(@Param('productId') productId: string) {
    return this.maintenanceLogService.findActiveByProductId(productId);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar registros de manutenção por status' })
  @ApiParam({
    name: 'status',
    enum: MaintenanceStatus,
    description: 'Status da manutenção',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de manutenção filtrada por status',
    type: [MaintenanceLogResponseDto],
  })
  async findByStatus(
    @Param('status', new ParseEnumPipe(MaintenanceStatus))
    status: MaintenanceStatus,
  ) {
    return this.maintenanceLogService.findByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar registro de manutenção por ID' })
  @ApiParam({ name: 'id', description: 'ID do registro de manutenção' })
  @ApiResponse({
    status: 200,
    description: 'Registro de manutenção encontrado com sucesso',
    type: MaintenanceLogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de manutenção não encontrado',
  })
  async findOne(@Param('id') id: string) {
    return this.maintenanceLogService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Criar novo registro de manutenção' })
  @ApiResponse({
    status: 201,
    description: 'Registro de manutenção criado com sucesso',
    type: MaintenanceLogResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async create(@Body() createMaintenanceLogDto: CreateMaintenanceLogDto) {
    return this.maintenanceLogService.create(createMaintenanceLogDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar registro de manutenção' })
  @ApiParam({ name: 'id', description: 'ID do registro de manutenção' })
  @ApiResponse({
    status: 200,
    description: 'Registro de manutenção atualizado com sucesso',
    type: MaintenanceLogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de manutenção não encontrado',
  })
  async update(@Param('id') id: string, @Body() updateMaintenanceLogDto: UpdateMaintenanceLogDto) {
    return this.maintenanceLogService.update(id, updateMaintenanceLogDto);
  }

  @Put(':id/complete')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Completar registro de manutenção' })
  @ApiParam({ name: 'id', description: 'ID do registro de manutenção' })
  @ApiResponse({
    status: 200,
    description: 'Registro de manutenção completado com sucesso',
    type: MaintenanceLogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de manutenção não encontrado',
  })
  async completeMaintenance(
    @Param('id') id: string,
    @Body() completeMaintenanceLogDto: CompleteMaintenanceLogDto,
  ) {
    return this.maintenanceLogService.completeMaintenance(id, completeMaintenanceLogDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Excluir registro de manutenção' })
  @ApiParam({ name: 'id', description: 'ID do registro de manutenção' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Registro de manutenção excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de manutenção não encontrado',
  })
  async remove(@Param('id') id: string) {
    await this.maintenanceLogService.delete(id);
    return;
  }
}
