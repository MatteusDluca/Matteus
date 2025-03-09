// src/events/presentation/controllers/event.controller.ts
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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EventService } from '../../application/services/event.service';
import {
  CreateEventDto,
  UpdateEventDto,
  EventResponseDto,
  MonthlyEventCountDto,
} from '../../application/dtos/event.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Eventos')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar todos os eventos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos retornada com sucesso',
    type: [EventResponseDto],
  })
  async findAll() {
    return this.eventService.findAll();
  }

  @Get('upcoming')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar próximos eventos' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de eventos (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dos próximos eventos',
    type: [EventResponseDto],
  })
  async findUpcomingEvents(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.eventService.findUpcomingEvents(limit);
  }

  @Get('date-range')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar eventos por intervalo de datas' })
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
    description: 'Lista de eventos no intervalo de datas',
    type: [EventResponseDto],
  })
  async findByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.eventService.findByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('location/:locationId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar eventos por local' })
  @ApiParam({ name: 'locationId', description: 'ID do local' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos do local',
    type: [EventResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async findByLocationId(@Param('locationId') locationId: string) {
    return this.eventService.findByLocationId(locationId);
  }

  @Get('category/:category')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar eventos por categoria' })
  @ApiParam({ name: 'category', description: 'Categoria do evento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos da categoria',
    type: [EventResponseDto],
  })
  async findByCategory(@Param('category') category: string) {
    return this.eventService.findByCategory(category);
  }

  @Get('monthly-count')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Obter contagem de eventos por mês' })
  @ApiResponse({
    status: 200,
    description: 'Contagem de eventos por mês',
    type: [MonthlyEventCountDto],
  })
  async countEventsByMonth() {
    return this.eventService.countEventsByMonth();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar evento por ID' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({
    status: 200,
    description: 'Evento encontrado com sucesso',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Criar novo evento' })
  @ApiResponse({
    status: 201,
    description: 'Evento criado com sucesso',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({
    status: 200,
    description: 'Evento atualizado com sucesso',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Excluir evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Evento excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async remove(@Param('id') id: string) {
    await this.eventService.delete(id);
    return;
  }
}
