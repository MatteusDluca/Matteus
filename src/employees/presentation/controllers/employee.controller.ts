// src/employees/presentation/controllers/employee.controller.ts
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
import { EmployeeService } from '../../application/services/employee.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from '../../application/dtos/employee.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Funcionários')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar todos os funcionários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de funcionários retornada com sucesso',
    type: [EmployeeResponseDto],
  })
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get('top-performers')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar funcionários com melhor desempenho' })
  @ApiQuery({
    name: 'minRate',
    required: false,
    type: Number,
    description: 'Taxa mínima de desempenho (default: 80)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de funcionários de alto desempenho',
    type: [EmployeeResponseDto],
  })
  async findTopPerformers(
    @Query('minRate', new ParseIntPipe({ optional: true })) minRate?: number,
  ) {
    return this.employeeService.findTopPerformers(minRate);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar funcionário por ID' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário encontrado com sucesso',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.employeeService.findById(id);
  }

  @Get('cpf/:cpf')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Buscar funcionário por CPF' })
  @ApiParam({ name: 'cpf', description: 'CPF do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário encontrado com sucesso',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async findByCpf(@Param('cpf') cpf: string) {
    return this.employeeService.findByCpf(cpf);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar funcionário por ID de usuário' })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário associado ao funcionário',
  })
  @ApiResponse({
    status: 200,
    description: 'Funcionário encontrado com sucesso',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async findByUserId(@Param('userId') userId: string) {
    return this.employeeService.findByUserId(userId);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar novo funcionário' })
  @ApiResponse({
    status: 201,
    description: 'Funcionário criado com sucesso',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar funcionário' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário atualizado com sucesso',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Put(':id/performance')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar taxa de desempenho do funcionário' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiQuery({
    name: 'rate',
    required: true,
    type: Number,
    description: 'Nova taxa de desempenho (0-100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Taxa de desempenho atualizada com sucesso',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async updatePerformance(@Param('id') id: string, @Query('rate', ParseIntPipe) rate: number) {
    return this.employeeService.updatePerformance(id, rate);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Excluir funcionário' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Funcionário excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async remove(@Param('id') id: string) {
    await this.employeeService.delete(id);
    return;
  }
}
