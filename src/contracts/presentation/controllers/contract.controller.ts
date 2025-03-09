// src/contracts/presentation/controllers/contract.controller.ts
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
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ContractService } from '../../application/services/contract.service';
import {
  CreateContractDto,
  UpdateContractDto,
  ContractResponseDto,
  ContractStatsDto,
  ContractRevenueDto,
} from '../../application/dtos/contract.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { ContractStatus } from '../../domain/entities/contract.entity';
import { ParseDatePipe } from '../../../auth/presentation/pipes/parse-date.pipe';

@ApiTags('Contratos')
@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar todos os contratos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contratos retornada com sucesso',
    type: [ContractResponseDto],
  })
  async findAll() {
    return this.contractService.findAll();
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Obter estatísticas de contratos por mês e ano' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    type: [ContractStatsDto],
  })
  async getContractStats() {
    return this.contractService.getContractStats();
  }

  @Get('revenue')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Obter estatísticas de faturamento por mês e ano' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    type: [ContractRevenueDto],
  })
  async getRevenueStats() {
    return this.contractService.getRevenueStats();
  }

  @Get('by-number/:contractNumber')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar contrato por número' })
  @ApiParam({ name: 'contractNumber', description: 'Número do contrato' })
  @ApiResponse({
    status: 200,
    description: 'Contrato encontrado com sucesso',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findByContractNumber(@Param('contractNumber') contractNumber: string) {
    return this.contractService.findByContractNumber(contractNumber);
  }

  @Get('customer/:customerId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contratos do cliente',
    type: [ContractResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByCustomerId(@Param('customerId') customerId: string) {
    return this.contractService.findByCustomerId(customerId);
  }

  @Get('employee/:employeeId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar contratos de um funcionário' })
  @ApiParam({ name: 'employeeId', description: 'ID do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contratos do funcionário',
    type: [ContractResponseDto],
  })
  async findByEmployeeId(@Param('employeeId') employeeId: string) {
    return this.contractService.findByEmployeeId(employeeId);
  }

  @Get('event/:eventId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos de um evento' })
  @ApiParam({ name: 'eventId', description: 'ID do evento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contratos do evento',
    type: [ContractResponseDto],
  })
  async findByEventId(@Param('eventId') eventId: string) {
    return this.contractService.findByEventId(eventId);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos por status' })
  @ApiParam({
    name: 'status',
    enum: ContractStatus,
    description: 'Status do contrato',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contratos filtrada por status',
    type: [ContractResponseDto],
  })
  async findByStatus(@Param('status', new ParseEnumPipe(ContractStatus)) status: ContractStatus) {
    return this.contractService.findByStatus(status);
  }

  @Get('late')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos em atraso' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contratos em atraso',
    type: [ContractResponseDto],
  })
  async findLateContracts() {
    return this.contractService.findLateContracts();
  }

  @Get('date-range')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar contratos por intervalo de datas' })
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
  @ApiQuery({
    name: 'field',
    required: true,
    enum: ['pickupDate', 'returnDate'],
    description: 'Campo de data',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contratos no intervalo de datas',
    type: [ContractResponseDto],
  })
  async findByDateRange(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Query('field') field: 'pickupDate' | 'returnDate',
  ) {
    if (field !== 'pickupDate' && field !== 'returnDate') {
      throw new BadRequestException('O campo deve ser "pickupDate" ou "returnDate"');
    }

    return this.contractService.findByDateRange(startDate, endDate, field);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar contrato por ID' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({
    status: 200,
    description: 'Contrato encontrado com sucesso',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.contractService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Criar novo contrato' })
  @ApiResponse({
    status: 201,
    description: 'Contrato criado com sucesso',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Recurso não encontrado' })
  async create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({
    status: 200,
    description: 'Contrato atualizado com sucesso',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractService.update(id, updateContractDto);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar status do contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiQuery({
    name: 'status',
    enum: ContractStatus,
    description: 'Novo status do contrato',
  })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com sucesso',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async updateStatus(
    @Param('id') id: string,
    @Query('status', new ParseEnumPipe(ContractStatus)) status: ContractStatus,
  ) {
    return this.contractService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Excluir contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contrato excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contractService.delete(id);
  }
}
