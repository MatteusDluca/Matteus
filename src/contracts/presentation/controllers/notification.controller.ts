// src/contracts/presentation/controllers/notification.controller.ts
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
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationService } from '../../application/services/notification.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationDto,
} from '../../application/dtos/notification.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { NotificationType } from '../../domain/entities/notification.entity';

@ApiTags('Notificações')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar todas as notificações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações retornada com sucesso',
    type: [NotificationDto],
  })
  async findAll() {
    return this.notificationService.findAll();
  }

  @Get('customer/:customerId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar notificações de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações do cliente',
    type: [NotificationDto],
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByCustomerId(@Param('customerId') customerId: string) {
    return this.notificationService.findByCustomerId(customerId);
  }

  @Get('customer/:customerId/unread')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar notificações não lidas de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações não lidas do cliente',
    type: [NotificationDto],
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findUnreadByCustomerId(@Param('customerId') customerId: string) {
    return this.notificationService.findUnreadByCustomerId(customerId);
  }

  @Get('customer/:customerId/count-unread')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Contar notificações não lidas de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Contagem de notificações não lidas',
    schema: {
      properties: {
        count: {
          type: 'number',
          description: 'Número de notificações não lidas',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async countUnreadByCustomerId(@Param('customerId') customerId: string) {
    const count = await this.notificationService.countUnreadByCustomerId(customerId);
    return { count };
  }

  @Get('type/:type')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar notificações por tipo' })
  @ApiParam({
    name: 'type',
    enum: NotificationType,
    description: 'Tipo da notificação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações filtrada por tipo',
    type: [NotificationDto],
  })
  async findByType(@Param('type', new ParseEnumPipe(NotificationType)) type: NotificationType) {
    return this.notificationService.findByType(type);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar notificação por ID' })
  @ApiParam({ name: 'id', description: 'ID da notificação' })
  @ApiResponse({
    status: 200,
    description: 'Notificação encontrada com sucesso',
    type: NotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.notificationService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Criar nova notificação' })
  @ApiResponse({
    status: 201,
    description: 'Notificação criada com sucesso',
    type: NotificationDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar notificação' })
  @ApiParam({ name: 'id', description: 'ID da notificação' })
  @ApiResponse({
    status: 200,
    description: 'Notificação atualizada com sucesso',
    type: NotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  async update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Put(':id/mark-as-read')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiParam({ name: 'id', description: 'ID da notificação' })
  @ApiResponse({
    status: 200,
    description: 'Notificação marcada como lida com sucesso',
    type: NotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Put('customer/:customerId/mark-all-as-read')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Marcar todas as notificações do cliente como lidas',
  })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Notificações marcadas como lidas com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async markAllAsRead(@Param('customerId') customerId: string) {
    await this.notificationService.markAllAsRead(customerId);
    return { message: 'Todas as notificações foram marcadas como lidas' };
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Excluir notificação' })
  @ApiParam({ name: 'id', description: 'ID da notificação' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Notificação excluída com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.notificationService.delete(id);
  }
}
