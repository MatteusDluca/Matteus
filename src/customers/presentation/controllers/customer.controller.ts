// src/customers/presentation/controllers/customer.controller.ts
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
  ParseIntPipe,
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
import { CustomerService } from '../../application/services/customer.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerResponseDto,
  UpdateLoyaltyPointsDto,
  BodyMeasurementsDto,
} from '../../application/dtos/customer.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Clientes')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso',
    type: [CustomerResponseDto],
  })
  async findAll() {
    return this.customerService.findAll();
  }

  @Get('top')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar os clientes mais fiéis' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de clientes (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dos melhores clientes',
    type: [CustomerResponseDto],
  })
  async findTopCustomers(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.customerService.findTopCustomers(limit);
  }

  @Get('birthdays')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar aniversariantes do mês' })
  @ApiQuery({
    name: 'month',
    required: true,
    type: Number,
    description: 'Mês (1-12)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de aniversariantes do mês',
    type: [CustomerResponseDto],
  })
  async findBirthdaysInMonth(@Query('month', ParseIntPipe) month: number) {
    return this.customerService.findBirthdaysInMonth(month);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.customerService.findById(id);
  }

  @Get('document/:documentNumber')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar cliente por número de documento' })
  @ApiParam({ name: 'documentNumber', description: 'CPF ou CNPJ do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByDocument(@Param('documentNumber') documentNumber: string) {
    return this.customerService.findByDocument(documentNumber);
  }

  @Get('email/:email')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar cliente por email' })
  @ApiParam({ name: 'email', description: 'Email do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByEmail(@Param('email') email: string) {
    return this.customerService.findByEmail(email);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar cliente por ID de usuário' })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário associado ao cliente',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByUserId(@Param('userId') userId: string) {
    return this.customerService.findByUserId(userId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Put(':id/loyalty-points')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar pontos de fidelidade do cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Pontos de fidelidade atualizados com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async updateLoyaltyPoints(
    @Param('id') id: string,
    @Body() updateLoyaltyPointsDto: UpdateLoyaltyPointsDto,
  ) {
    return this.customerService.updateLoyaltyPoints(id, updateLoyaltyPointsDto.points);
  }

  @Put(':id/measurements')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Atualizar medidas corporais do cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Medidas corporais atualizadas com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async updateBodyMeasurements(
    @Param('id') id: string,
    @Body() bodyMeasurementsDto: BodyMeasurementsDto,
  ) {
    return this.customerService.updateBodyMeasurements(id, bodyMeasurementsDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Excluir cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Cliente excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async remove(@Param('id') id: string) {
    await this.customerService.delete(id);
    return;
  }
}
