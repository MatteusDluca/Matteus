// src/customers/presentation/controllers/customer-pdf.controller.ts
import { Controller, Get, Param, Res, Inject, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { CustomerService } from '../../application/services/customer.service';
import { CustomerPDFFactory } from '../../infrastructure/factories/customer-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';

@ApiTags('Clientes PDF')
@Controller('customers/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerPDFController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerPdfFactory: CustomerPDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get('profile/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar perfil do cliente em PDF' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do cliente gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async generateCustomerProfile(@Param('id') id: string, @Res() res: Response) {
    // Buscar cliente
    const customer = await this.customerService.findById(id);
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Aqui idealmente buscaria o histórico de contratos do cliente
    // Isso exigiria injetar o serviço de contratos ou fazer uma consulta
    // Para simplificar, enviamos um array vazio
    const contracts = [];

    // Preparar dados para o PDF
    const pdfData = this.customerPdfFactory.prepareProfileData(customer, contracts);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('customer-profile', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=cliente-${customer.documentNumber}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
