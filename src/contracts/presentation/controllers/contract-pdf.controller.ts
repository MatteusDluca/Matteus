// src/contracts/presentation/controllers/contract-pdf.controller.ts
import { Controller, Get, Param, Res, Inject, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { ContractService } from '../../application/services/contract.service';
import { ContractPDFFactory } from '../../infrastructure/factories/contract-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';

@ApiTags('Contratos PDF')
@Controller('contracts/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractPDFController {
  constructor(
    private readonly contractService: ContractService,
    private readonly contractPdfFactory: ContractPDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar PDF do contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({
    status: 200,
    description: 'PDF do contrato gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async generateContractPDF(@Param('id') id: string, @Res() res: Response) {
    // Buscar contrato com todas as relações necessárias
    const contract = await this.contractService.findById(id);
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${id} não encontrado`);
    }

    // Preparar dados para o PDF
    const pdfData = this.contractPdfFactory.prepareContractData(contract);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('contract', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=contrato-${contract.contractNumber}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }

  @Get(':id/invoice')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar PDF do recibo de pagamento' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({
    status: 200,
    description: 'PDF do recibo gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async generateInvoicePDF(@Param('id') id: string, @Res() res: Response) {
    // Buscar contrato com todas as relações necessárias
    const contract = await this.contractService.findById(id);
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${id} não encontrado`);
    }

    // Preparar dados para o PDF
    const pdfData = this.contractPdfFactory.prepareInvoiceData(contract);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('invoice', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=recibo-${contract.contractNumber}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
