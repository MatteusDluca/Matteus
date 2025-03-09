// src/contracts/presentation/controllers/payment.controller.ts
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
import { PaymentService } from '../../application/services/payment.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentDto } from '../../application/dtos/payment.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { PaymentStatus } from '../../domain/entities/payment.entity';

@ApiTags('Pagamentos')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar todos os pagamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos retornada com sucesso',
    type: [PaymentDto],
  })
  async findAll() {
    return this.paymentService.findAll();
  }

  @Get('contract/:contractId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar pagamentos de um contrato' })
  @ApiParam({ name: 'contractId', description: 'ID do contrato' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos do contrato',
    type: [PaymentDto],
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findByContractId(@Param('contractId') contractId: string) {
    return this.paymentService.findByContractId(contractId);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar pagamentos por status' })
  @ApiParam({
    name: 'status',
    enum: PaymentStatus,
    description: 'Status do pagamento',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos filtrada por status',
    type: [PaymentDto],
  })
  async findByStatus(@Param('status', new ParseEnumPipe(PaymentStatus)) status: PaymentStatus) {
    return this.paymentService.findByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento encontrado com sucesso',
    type: PaymentDto,
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.paymentService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Registrar novo pagamento' })
  @ApiResponse({
    status: 201,
    description: 'Pagamento registrado com sucesso',
    type: PaymentDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento atualizado com sucesso',
    type: PaymentDto,
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Put(':id/mark-as-paid')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Marcar pagamento como pago' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento marcado como pago com sucesso',
    type: PaymentDto,
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async markAsPaid(@Param('id') id: string) {
    return this.paymentService.markAsPaid(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Excluir pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Pagamento excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.paymentService.delete(id);
  }
}
