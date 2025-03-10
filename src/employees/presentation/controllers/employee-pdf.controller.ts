// src/employees/presentation/controllers/employee-pdf.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  Inject,
  UseGuards,
  NotFoundException,
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
import { EmployeeService } from '../../application/services/employee.service';
import { EmployeePDFFactory } from '../../infrastructure/factories/employee-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';

@ApiTags('Funcionários PDF')
@Controller('employees/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeePDFController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly employeePdfFactory: EmployeePDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get('profile/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Gerar perfil do funcionário em PDF' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do funcionário gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async generateEmployeeProfile(@Param('id') id: string, @Res() res: Response) {
    // Buscar funcionário
    const employee = await this.employeeService.findById(id);
    if (!employee) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado`);
    }

    // Aqui idealmente buscaria o histórico de contratos e dados de desempenho
    // Para simplificar, enviamos arrays vazios
    const contracts = [];
    const performanceData = [];

    // Preparar dados para o PDF
    const pdfData = this.employeePdfFactory.prepareProfileData(
      employee,
      contracts,
      performanceData,
    );

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('employee-profile', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=funcionario-${employee.cpf}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }

  @Get('report')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Gerar relatório de desempenho dos funcionários' })
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
    description: 'Relatório de funcionários gerado com sucesso',
  })
  async generateEmployeeReport(
    @Query('startDate') startDateStr: string,
    @Query('endDate') endDateStr: string,
    @Res() res: Response,
  ) {
    // Converter strings para datas
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Buscar todos os funcionários
    const employees = await this.employeeService.findAll();

    // Aqui idealmente buscaria dados de desempenho para o período
    // Para simplificar, criamos dados fictícios
    const performanceData = employees.map((employee) => ({
      employeeId: employee.id,
      contractCount: Math.floor(Math.random() * 20),
      totalValue: Math.random() * 10000,
      performanceRate: Math.random() * 100,
    }));

    // Preparar dados para o PDF
    const pdfData = this.employeePdfFactory.prepareReportData(
      employees,
      startDate,
      endDate,
      performanceData,
    );

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('report', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=relatorio-funcionarios.pdf',
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
