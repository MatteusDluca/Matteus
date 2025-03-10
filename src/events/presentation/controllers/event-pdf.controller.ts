// src/events/presentation/controllers/event-pdf.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  Inject,
  UseGuards,
  NotFoundException,
  ParseDatePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { EventService } from '../../application/services/event.service';
import { LocationService } from '../../application/services/location.service';
import { EventPDFFactory } from '../../infrastructure/factories/event-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';

@ApiTags('Eventos e Locais PDF')
@Controller('events/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventPDFController {
  constructor(
    private readonly eventService: EventService,
    private readonly locationService: LocationService,
    private readonly eventPdfFactory: EventPDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get('event/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar PDF com detalhes do evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({
    status: 200,
    description: 'PDF do evento gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async generateEventPDF(@Param('id') id: string, @Res() res: Response) {
    // Buscar evento
    const event = await this.eventService.findById(id);
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    // Aqui idealmente buscaria os contratos associados ao evento
    // Para simplificar, enviamos um array vazio
    const contracts = [];

    // Preparar dados para o PDF
    const pdfData = this.eventPdfFactory.prepareEventData(event, contracts);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('event-detail', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=evento-${event.id}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }

  @Get('location/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar PDF com detalhes do local' })
  @ApiParam({ name: 'id', description: 'ID do local' })
  @ApiResponse({
    status: 200,
    description: 'PDF do local gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async generateLocationPDF(@Param('id') id: string, @Res() res: Response) {
    // Buscar local
    const location = await this.locationService.findById(id);
    if (!location) {
      throw new NotFoundException(`Local com ID ${id} não encontrado`);
    }

    // Buscar eventos associados a este local
    const events = await this.eventService.findByLocationId(id);

    // Filtrar para eventos futuros
    const now = new Date();
    const upcomingEvents = events.filter((event) => new Date(event.date) > now);

    // Preparar dados para o PDF
    const pdfData = this.eventPdfFactory.prepareLocationData(location, events, upcomingEvents);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('location-detail', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=local-${location.id}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }

  @Get('calendar')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar calendário de eventos em PDF' })
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
    description: 'Calendário de eventos gerado com sucesso',
  })
  async generateEventsCalendar(
    @Query('startDate') startDateStr: string,
    @Query('endDate') endDateStr: string,
    @Res() res: Response,
  ) {
    // Converter strings para datas
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Buscar eventos no intervalo de datas
    const events = await this.eventService.findByDateRange(startDate, endDate);

    // Preparar dados para o PDF
    const pdfData = this.eventPdfFactory.prepareEventsCalendarData(events, startDate, endDate);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('report', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=calendario-eventos.pdf',
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
