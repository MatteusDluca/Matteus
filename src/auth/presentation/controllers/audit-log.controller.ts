// src/auth/presentation/controllers/audit-log.controller.ts
import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuditLogService } from '../../application/services/audit-log.service';
import { AuditLogResponseDto } from '../../application/dtos/audit-log.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../domain/entities/user.entity';
import { ParseDatePipe } from '../pipes/parse-date.pipe';

@ApiTags('Logs de Auditoria')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os logs de auditoria' })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs retornada com sucesso',
    type: [AuditLogResponseDto],
  })
  async findAll() {
    return this.auditLogService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar logs de auditoria por usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs retornada com sucesso',
    type: [AuditLogResponseDto],
  })
  async findByUserId(@Param('userId') userId: string) {
    return this.auditLogService.findByUserId(userId);
  }

  @Get('resource/:resource')
  @ApiOperation({ summary: 'Listar logs de auditoria por recurso' })
  @ApiParam({ name: 'resource', description: 'Nome do recurso' })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs retornada com sucesso',
    type: [AuditLogResponseDto],
  })
  async findByResource(@Param('resource') resource: string) {
    return this.auditLogService.findByResource(resource);
  }

  @Get('action/:action')
  @ApiOperation({ summary: 'Listar logs de auditoria por ação' })
  @ApiParam({ name: 'action', description: 'Nome da ação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs retornada com sucesso',
    type: [AuditLogResponseDto],
  })
  async findByAction(@Param('action') action: string) {
    return this.auditLogService.findByAction(action);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Listar logs de auditoria por intervalo de datas' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'Data final (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs retornada com sucesso',
    type: [AuditLogResponseDto],
  })
  async findByDateRange(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.auditLogService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar log de auditoria por ID' })
  @ApiParam({ name: 'id', description: 'ID do log de auditoria' })
  @ApiResponse({
    status: 200,
    description: 'Log encontrado com sucesso',
    type: AuditLogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Log não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.auditLogService.findById(id);
  }
}
