# EmployeesCustomersGenerator.ps1
# Script para gerar os módulos de Funcionários e Clientes

Write-Host "Iniciando geração dos módulos de Funcionários e Clientes..." -ForegroundColor Cyan

# Garantir que estamos no diretório raiz do projeto
if (-not (Test-Path -Path "src")) {
    Write-Host "Diretório 'src' não encontrado. Por favor, execute este script a partir do diretório raiz do projeto." -ForegroundColor Red
    exit 1
}

#################################################
# MÓDULO COMPARTILHADO (SHARED)
#################################################

Write-Host "Criando arquivos compartilhados..." -ForegroundColor Yellow

# Base Entity
$baseEntityContent = @"
// src/shared/domain/entities/base.entity.ts
export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
"@
New-Item -Path "src/shared/domain/entities" -ItemType Directory -Force
Set-Content -Path "src/shared/domain/entities/base.entity.ts" -Value $baseEntityContent

# Base Repository Interface
$baseRepositoryContent = @"
// src/shared/domain/repositories/base.repository.interface.ts
export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
"@
New-Item -Path "src/shared/domain/repositories" -ItemType Directory -Force
Set-Content -Path "src/shared/domain/repositories/base.repository.interface.ts" -Value $baseRepositoryContent

# Base Service
$baseServiceContent = @"
// src/shared/application/services/base.service.ts
import { NotFoundException } from '@nestjs/common';
import { IBaseRepository } from '../../domain/repositories/base.repository.interface';

export abstract class BaseService<T> {
  constructor(private readonly repository: IBaseRepository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(\`Entidade com ID \${id} não encontrada\`);
    }
    return entity;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.findById(id); // Verifica se existe
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.repository.delete(id);
  }
}
"@
New-Item -Path "src/shared/application/services" -ItemType Directory -Force
Set-Content -Path "src/shared/application/services/base.service.ts" -Value $baseServiceContent

# HTTP Exception Filter
$httpExceptionFilterContent = @"
// src/shared/presentation/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? exceptionResponse['message']
          : exception.message || 'Erro interno do servidor',
    };

    this.logger.error(
      \`\${request.method} \${request.url} \${status} - \${JSON.stringify(errorResponse)}\`,
    );

    response.status(status).json(errorResponse);
  }
}
"@
New-Item -Path "src/shared/presentation/filters" -ItemType Directory -Force
Set-Content -Path "src/shared/presentation/filters/http-exception.filter.ts" -Value $httpExceptionFilterContent

# Prisma Exception Filter
$prismaExceptionFilterContent = @"
// src/shared/presentation/filters/prisma-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno no banco de dados';

    switch (exception.code) {
      case 'P2002': // Unique constraint violation
        status = HttpStatus.CONFLICT;
        const field = exception.meta?.target as string[];
        message = \`O valor do campo '\${field?.join(', ')}' já existe\`;
        break;
      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Registro não encontrado';
        break;
      case 'P2003': // Foreign key constraint failed
        status = HttpStatus.BAD_REQUEST;
        message = 'Erro de referência: entidade relacionada não encontrada';
        break;
      // Adicione mais casos conforme necessário
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    this.logger.error(
      \`Prisma Error \${exception.code}: \${request.method} \${request.url} - \${JSON.stringify(errorResponse)}\`,
    );

    response.status(status).json(errorResponse);
  }
}
"@
Set-Content -Path "src/shared/presentation/filters/prisma-exception.filter.ts" -Value $prismaExceptionFilterContent

# Validation Pipe
$validationPipeContent = @"
// src/shared/presentation/pipes/validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      const messages = errors.map(error => {
        return \`\${error.property}: \${Object.values(error.constraints).join(', ')}\`;
      });
      
      throw new BadRequestException({
        message: 'Erro de validação',
        errors: messages,
      });
    }
    
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
"@
New-Item -Path "src/shared/presentation/pipes" -ItemType Directory -Force
Set-Content -Path "src/shared/presentation/pipes/validation.pipe.ts" -Value $validationPipeContent

# Logger Middleware
$loggerMiddlewareContent = @"
// src/shared/presentation/middlewares/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        \`\${method} \${originalUrl} \${statusCode} \${contentLength} - \${responseTime}ms - \${userAgent} \${ip}\`,
      );
    });

    next();
  }
}
"@
New-Item -Path "src/shared/presentation/middlewares" -ItemType Directory -Force
Set-Content -Path "src/shared/presentation/middlewares/logger.middleware.ts" -Value $loggerMiddlewareContent

# Prisma Service
$prismaServiceContent = @"
// src/shared/infrastructure/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    this.logger.log('Conectando ao banco de dados...');
    await this.\$connect();
    this.logger.log('Conectado ao banco de dados com sucesso');
    
    // Log de consultas lentas
    this.\$on('query', (e: any) => {
      if (e.duration > 500) { // Log para consultas que levam mais de 500ms
        this.logger.warn(\`Consulta lenta (\${e.duration}ms): \${e.query}\`);
      }
    });
  }

  async onModuleDestroy() {
    this.logger.log('Desconectando do banco de dados...');
    await this.\$disconnect();
    this.logger.log('Desconectado do banco de dados com sucesso');
  }
}
"@
New-Item -Path "src/shared/infrastructure/prisma" -ItemType Directory -Force
Set-Content -Path "src/shared/infrastructure/prisma/prisma.service.ts" -Value $prismaServiceContent

# Prisma Module
$prismaModuleContent = @"
// src/shared/infrastructure/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
"@
Set-Content -Path "src/shared/infrastructure/prisma/prisma.module.ts" -Value $prismaModuleContent

#################################################
# MÓDULO DE FUNCIONÁRIOS (EMPLOYEES)
#################################################

Write-Host "Criando módulo de Funcionários..." -ForegroundColor Yellow

# Employee Domain Entity
$employeeEntityContent = @"
// src/employees/domain/entities/employee.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export class Employee extends BaseEntity {
  userId: string;
  name: string;
  cpf: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  position: string;
  salary: number;
  hireDate: Date;
  workingHours: string;
  performanceRate?: number;
}
"@
New-Item -Path "src/employees/domain/entities" -ItemType Directory -Force
Set-Content -Path "src/employees/domain/entities/employee.entity.ts" -Value $employeeEntityContent

# Employee Repository Interface
$employeeRepositoryInterfaceContent = @"
// src/employees/domain/repositories/employee.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Employee } from '../entities/employee.entity';

export interface IEmployeeRepository extends IBaseRepository<Employee> {
  findByCpf(cpf: string): Promise<Employee | null>;
  findByUserId(userId: string): Promise<Employee | null>;
  findByPerformanceAbove(rate: number): Promise<Employee[]>;
}
"@
New-Item -Path "src/employees/domain/repositories" -ItemType Directory -Force
Set-Content -Path "src/employees/domain/repositories/employee.repository.interface.ts" -Value $employeeRepositoryInterfaceContent

# Employee Repository Implementation
$employeeRepositoryContent = @"
// src/employees/infrastructure/repositories/employee.repository.ts
import { Injectable } from '@nestjs/common';
import { Employee } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async findByCpf(cpf: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { cpf },
    });
  }

  async findByUserId(userId: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { userId },
    });
  }

  async findByPerformanceAbove(rate: number): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: {
        performanceRate: {
          gte: rate,
        },
      },
      orderBy: {
        performanceRate: 'desc',
      },
    });
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    return this.prisma.employee.create({
      data: data as any,
    });
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.employee.delete({
      where: { id },
    });
  }
}
"@
New-Item -Path "src/employees/infrastructure/repositories" -ItemType Directory -Force
Set-Content -Path "src/employees/infrastructure/repositories/employee.repository.ts" -Value $employeeRepositoryContent

# Employee DTOs
$employeeDtosContent = @"
// src/employees/application/dtos/employee.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsNumber, IsOptional, Length, Matches, Min, Max, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'ID do usuário associado ao funcionário' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Nome completo do funcionário' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'CPF do funcionário (apenas números)' })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas 11 dígitos numéricos' })
  cpf: string;

  @ApiProperty({ description: 'Telefone do funcionário' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{10,15})$/, { message: 'Telefone deve conter apenas números, entre 10 e 15 dígitos' })
  phone: string;

  @ApiProperty({ description: 'Endereço do funcionário' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Cidade do funcionário' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado do funcionário' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @ApiProperty({ description: 'CEP do funcionário (apenas números)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode: string;

  @ApiProperty({ description: 'Cargo do funcionário' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ description: 'Salário do funcionário' })
  @IsNumber()
  @Min(0)
  salary: number;

  @ApiProperty({ description: 'Data de contratação', example: '2023-01-01' })
  @IsISO8601()
  @Type(() => Date)
  hireDate: Date;

  @ApiProperty({ description: 'Horário de trabalho do funcionário', example: '08:00-18:00' })
  @IsString()
  @IsNotEmpty()
  workingHours: string;

  @ApiPropertyOptional({ description: 'Taxa de desempenho (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  performanceRate?: number;
}

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ description: 'Nome completo do funcionário' })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiPropertyOptional({ description: 'Telefone do funcionário' })
  @IsOptional()
  @IsString()
  @Matches(/^(\d{10,15})$/, { message: 'Telefone deve conter apenas números, entre 10 e 15 dígitos' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Endereço do funcionário' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Cidade do funcionário' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Estado do funcionário' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiPropertyOptional({ description: 'CEP do funcionário (apenas números)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Cargo do funcionário' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ description: 'Salário do funcionário' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @ApiPropertyOptional({ description: 'Data de contratação', example: '2023-01-01' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  hireDate?: Date;

  @ApiPropertyOptional({ description: 'Horário de trabalho do funcionário', example: '08:00-18:00' })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional({ description: 'Taxa de desempenho (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  performanceRate?: number;
}

export class EmployeeResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  userId: string;
  
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  cpf: string;
  
  @ApiProperty()
  phone: string;
  
  @ApiProperty()
  address: string;
  
  @ApiProperty()
  city: string;
  
  @ApiProperty()
  state: string;
  
  @ApiProperty()
  zipCode: string;
  
  @ApiProperty()
  position: string;
  
  @ApiProperty()
  salary: number;
  
  @ApiProperty()
  hireDate: Date;
  
  @ApiProperty()
  workingHours: string;
  
  @ApiPropertyOptional()
  performanceRate?: number;
  
  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  updatedAt: Date;
}
"@
New-Item -Path "src/employees/application/dtos" -ItemType Directory -Force
Set-Content -Path "src/employees/application/dtos/employee.dto.ts" -Value $employeeDtosContent

# Employee Service
$employeeServiceContent = @"
// src/employees/application/services/employee.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Employee } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
export class EmployeeService extends BaseService<Employee> {
  constructor(private readonly employeeRepository: IEmployeeRepository) {
    super(employeeRepository);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.findAll();
  }

  async findByCpf(cpf: string): Promise<Employee> {
    const employee = await this.employeeRepository.findByCpf(cpf);
    if (!employee) {
      throw new NotFoundException(\`Funcionário com CPF \${cpf} não encontrado\`);
    }
    return employee;
  }

  async findByUserId(userId: string): Promise<Employee> {
    const employee = await this.employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException(\`Funcionário com ID de usuário \${userId} não encontrado\`);
    }
    return employee;
  }

  async findTopPerformers(minRate: number = 80): Promise<Employee[]> {
    return this.employeeRepository.findByPerformanceAbove(minRate);
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Verificar se já existe um funcionário com o mesmo CPF
    const existingEmployee = await this.employeeRepository.findByCpf(createEmployeeDto.cpf);
    if (existingEmployee) {
      throw new BadRequestException(\`Já existe um funcionário com o CPF \${createEmployeeDto.cpf}\`);
    }

    // Verificar se já existe um funcionário com o mesmo userId
    const existingEmployeeUser = await this.employeeRepository.findByUserId(createEmployeeDto.userId);
    if (existingEmployeeUser) {
      throw new BadRequestException(\`Já existe um funcionário associado ao usuário informado\`);
    }

    return this.employeeRepository.create(createEmployeeDto);
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    // Verificar se o funcionário existe
    await this.findById(id);

    return this.employeeRepository.update(id, updateEmployeeDto);
  }

  async updatePerformance(id: string, rate: number): Promise<Employee> {
    if (rate < 0 || rate > 100) {
      throw new BadRequestException('A taxa de desempenho deve estar entre 0 e 100');
    }

    return this.update(id, { performanceRate: rate });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.employeeRepository.delete(id);
  }
}
"@
New-Item -Path "src/employees/application/services" -ItemType Directory -Force
Set-Content -Path "src/employees/application/services/employee.service.ts" -Value $employeeServiceContent

# Employee Controller
$employeeControllerContent = @"
// src/employees/presentation/controllers/employee.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EmployeeService } from '../../application/services/employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto } from '../../application/dtos/employee.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@ApiTags('Funcionários')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Listar todos os funcionários' })
  @ApiResponse({ status: 200, description: 'Lista de funcionários retornada com sucesso', type: [EmployeeResponseDto] })
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get('top-performers')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Listar funcionários com melhor desempenho' })
  @ApiQuery({ name: 'minRate', required: false, type: Number, description: 'Taxa mínima de desempenho (default: 80)' })
  @ApiResponse({ status: 200, description: 'Lista de funcionários de alto desempenho', type: [EmployeeResponseDto] })
  async findTopPerformers(@Query('minRate', new ParseIntPipe({ optional: true })) minRate?: number) {
    return this.employeeService.findTopPerformers(minRate);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar funcionário por ID' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiResponse({ status: 200, description: 'Funcionário encontrado com sucesso', type: EmployeeResponseDto })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.employeeService.findById(id);
  }

  @Get('cpf/:cpf')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Buscar funcionário por CPF' })
  @ApiParam({ name: 'cpf', description: 'CPF do funcionário' })
  @ApiResponse({ status: 200, description: 'Funcionário encontrado com sucesso', type: EmployeeResponseDto })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async findByCpf(@Param('cpf') cpf: string) {
    return this.employeeService.findByCpf(cpf);
  }

  @Get('user/:userId')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar funcionário por ID de usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário associado ao funcionário' })
  @ApiResponse({ status: 200, description: 'Funcionário encontrado com sucesso', type: EmployeeResponseDto })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async findByUserId(@Param('userId') userId: string) {
    return this.employeeService.findByUserId(userId);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar novo funcionário' })
  @ApiResponse({ status: 201, description: 'Funcionário criado com sucesso', type: EmployeeResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Atualizar funcionário' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiResponse({ status: 200, description: 'Funcionário atualizado com sucesso', type: EmployeeResponseDto })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Put(':id/performance')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Atualizar taxa de desempenho do funcionário' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiQuery({ name: 'rate', required: true, type: Number, description: 'Nova taxa de desempenho (0-100)' })
  @ApiResponse({ status: 200, description: 'Taxa de desempenho atualizada com sucesso', type: EmployeeResponseDto })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async updatePerformance(
    @Param('id') id: string, 
    @Query('rate', ParseIntPipe) rate: number
  ) {
    return this.employeeService.updatePerformance(id, rate);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir funcionário' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Funcionário excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async remove(@Param('id') id: string) {
    await this.employeeService.delete(id);
    return;
  }
}
"@
New-Item -Path "src/employees/presentation/controllers" -ItemType Directory -Force
Set-Content -Path "src/employees/presentation/controllers/employee.controller.ts" -Value $employeeControllerContent

# Employee Module
$employeeModuleContent = @"
// src/employees/employees.module.ts
import { Module } from '@nestjs/common';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { EmployeeService } from './application/services/employee.service';
import { EmployeeRepository } from './infrastructure/repositories/employee.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
  ],
  exports: [EmployeeService],
})
export class EmployeesModule {}
"@
Set-Content -Path "src/employees/employees.module.ts" -Value $employeeModuleContent

#################################################
# MÓDULO DE CLIENTES (CUSTOMERS)
#################################################

Write-Host "Criando módulo de Clientes..." -ForegroundColor Yellow

# Customer Domain Entity
$customerEntityContent = @"
// src/customers/domain/entities/customer.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

export interface BodyMeasurements {
  bust?: number;
  waist?: number;
  hips?: number;
  height?: number;
  shoulders?: number;
  inseam?: number;
  sleeve?: number;
  neck?: number;
  // Outras medidas conforme necessário
}

export class Customer extends BaseEntity {
  userId?: string;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate?: Date;
  phone: string;
  email: string;
  instagram?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bodyMeasurements?: BodyMeasurements;
  loyaltyPoints: number;
  preferences?: string;
  observations?: string;
}
"@
New-Item -Path "src/customers/domain/entities" -ItemType Directory -Force
Set-Content -Path "src/customers/domain/entities/customer.entity.ts" -Value $customerEntityContent

# Customer Repository Interface
$customerRepositoryInterfaceContent = @"
// src/customers/domain/repositories/customer.repository.interface.ts
import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository extends IBaseRepository<Customer> {
  findByDocument(documentNumber: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findByUserId(userId: string): Promise<Customer | null>;
  findTopCustomers(limit: number): Promise<Customer[]>;
  findBirthdaysInMonth(month: number): Promise<Customer[]>;
  updateLoyaltyPoints(id: string, points: number): Promise<Customer>;
}
"@
New-Item -Path "src/customers/domain/repositories" -ItemType Directory -Force
Set-Content -Path "src/customers/domain/repositories/customer.repository.interface.ts" -Value $customerRepositoryInterfaceContent

# Customer Repository Implementation
$customerRepositoryContent = @"
// src/customers/infrastructure/repositories/customer.repository.ts
import { Injectable } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async findByDocument(documentNumber: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { documentNumber },
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: { email },
    });
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { userId },
    });
  }

  async findTopCustomers(limit: number): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      orderBy: { loyaltyPoints: 'desc' },
      take: limit,
    });
  }

  async findBirthdaysInMonth(month: number): Promise<Customer[]> {
    // Usando raw SQL com Prisma para extrair mês da data de aniversário
    const customers = await this.prisma.$queryRaw\`
      SELECT * FROM "Customer"
      WHERE EXTRACT(MONTH FROM "birthDate") = \${month}
      ORDER BY EXTRACT(DAY FROM "birthDate") ASC
    \`;
    
    return customers as Customer[];
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    // Garantir que loyaltyPoints seja inicializado para novos clientes
    if (!data.loyaltyPoints) {
      data.loyaltyPoints = 0;
    }
    
    return this.prisma.customer.create({
      data: data as any,
    });
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data: data as any,
    });
  }

  async updateLoyaltyPoints(id: string, points: number): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data: {
        loyaltyPoints: {
          increment: points,
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: { id },
    });
  }
}
"@
New-Item -Path "src/customers/infrastructure/repositories" -ItemType Directory -Force
Set-Content -Path "src/customers/infrastructure/repositories/customer.repository.ts" -Value $customerRepositoryContent

# Customer DTOs
$customerDtosContent = @"
// src/customers/application/dtos/customer.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsDate, 
  Length, Matches, IsObject, ValidateNested, IsInt, Min, Max, IsISO8601
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType } from '../../domain/entities/customer.entity';

export class BodyMeasurementsDto {
  @ApiPropertyOptional({ description: 'Medida do busto em cm' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  bust?: number;

  @ApiPropertyOptional({ description: 'Medida da cintura em cm' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  waist?: number;

  @ApiPropertyOptional({ description: 'Medida do quadril em cm' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  hips?: number;

  @ApiPropertyOptional({ description: 'Altura em cm' })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  height?: number;

  @ApiPropertyOptional({ description: 'Largura dos ombros em cm' })
  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(100)
  shoulders?: number;

  @ApiPropertyOptional({ description: 'Medida interna da perna em cm' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(150)
  inseam?: number;

  @ApiPropertyOptional({ description: 'Comprimento da manga em cm' })
  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(100)
  sleeve?: number;

  @ApiPropertyOptional({ description: 'Circunferência do pescoço em cm' })
  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(100)
  neck?: number;
}

export class CreateCustomerDto {
  @ApiPropertyOptional({ description: 'ID do usuário associado ao cliente (opcional)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Nome completo do cliente' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'Tipo de documento', enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ description: 'Número do documento (CPF ou CNPJ)' })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiPropertyOptional({ description: 'Data de nascimento', example: '1990-01-01' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({ description: 'Telefone do cliente' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{10,15})$/, { message: 'Telefone deve conter apenas números, entre 10 e 15 dígitos' })
  phone: string;

  @ApiProperty({ description: 'Email do cliente' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Instagram do cliente' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ description: 'Endereço do cliente' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Cidade do cliente' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado do cliente' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @ApiProperty({ description: 'CEP do cliente (apenas números)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode: string;

  @ApiPropertyOptional({ description: 'Medidas corporais do cliente' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BodyMeasurementsDto)
  bodyMeasurements?: BodyMeasurementsDto;

  @ApiPropertyOptional({ description: 'Preferências do cliente' })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiPropertyOptional({ description: 'Observações sobre o cliente' })
  @IsOptional()
  @IsString()
  observations?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'ID do usuário associado ao cliente' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Nome completo do cliente' })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiPropertyOptional({ description: 'Data de nascimento', example: '1990-01-01' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  birthDate?: Date;

  @ApiPropertyOptional({ description: 'Telefone do cliente' })
  @IsOptional()
  @IsString()
  @Matches(/^(\d{10,15})$/, { message: 'Telefone deve conter apenas números, entre 10 e 15 dígitos' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email do cliente' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Instagram do cliente' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ description: 'Endereço do cliente' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Cidade do cliente' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Estado do cliente' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiPropertyOptional({ description: 'CEP do cliente (apenas números)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Medidas corporais do cliente' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BodyMeasurementsDto)
  bodyMeasurements?: BodyMeasurementsDto;

  @ApiPropertyOptional({ description: 'Preferências do cliente' })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiPropertyOptional({ description: 'Observações sobre o cliente' })
  @IsOptional()
  @IsString()
  observations?: string;
}

export class UpdateLoyaltyPointsDto {
  @ApiProperty({ description: 'Pontos de fidelidade a adicionar (positivo) ou remover (negativo)' })
  @IsInt()
  points: number;
}

export class CustomerResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiPropertyOptional()
  userId?: string;
  
  @ApiProperty()
  name: string;
  
  @ApiProperty({ enum: DocumentType })
  documentType: DocumentType;
  
  @ApiProperty()
  documentNumber: string;
  
  @ApiPropertyOptional()
  birthDate?: Date;
  
  @ApiProperty()
  phone: string;
  
  @ApiProperty()
  email: string;
  
  @ApiPropertyOptional()
  instagram?: string;
  
  @ApiProperty()
  address: string;
  
  @ApiProperty()
  city: string;
  
  @ApiProperty()
  state: string;
  
  @ApiProperty()
  zipCode: string;
  
  @ApiPropertyOptional()
  bodyMeasurements?: BodyMeasurementsDto;
  
  @ApiProperty()
  loyaltyPoints: number;
  
  @ApiPropertyOptional()
  preferences?: string;
  
  @ApiPropertyOptional()
  observations?: string;
  
  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  updatedAt: Date;
}
"@
New-Item -Path "src/customers/application/dtos" -ItemType Directory -Force
Set-Content -Path "src/customers/application/dtos/customer.dto.ts" -Value $customerDtosContent

# Customer Service
$customerServiceContent = @"
// src/customers/application/services/customer.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(private readonly customerRepository: ICustomerRepository) {
    super(customerRepository);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async findByDocument(documentNumber: string): Promise<Customer> {
    const customer = await this.customerRepository.findByDocument(documentNumber);
    if (!customer) {
      throw new NotFoundException(\`Cliente com documento \${documentNumber} não encontrado\`);
    }
    return customer;
  }

  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new NotFoundException(\`Cliente com email \${email} não encontrado\`);
    }
    return customer;
  }

  async findByUserId(userId: string): Promise<Customer> {
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException(\`Cliente com ID de usuário \${userId} não encontrado\`);
    }
    return customer;
  }

  async findTopCustomers(limit: number = 10): Promise<Customer[]> {
    return this.customerRepository.findTopCustomers(limit);
  }

  async findBirthdaysInMonth(month: number): Promise<Customer[]> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Mês deve estar entre 1 e 12');
    }
    return this.customerRepository.findBirthdaysInMonth(month);
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Verificar se já existe um cliente com o mesmo documento
    const existingCustomer = await this.customerRepository.findByDocument(createCustomerDto.documentNumber);
    if (existingCustomer) {
      throw new BadRequestException(\`Já existe um cliente com o documento \${createCustomerDto.documentNumber}\`);
    }

    // Verificar se já existe um cliente com o mesmo userId (se fornecido)
    if (createCustomerDto.userId) {
      const existingCustomerUser = await this.customerRepository.findByUserId(createCustomerDto.userId);
      if (existingCustomerUser) {
        throw new BadRequestException(\`Já existe um cliente associado ao usuário informado\`);
      }
    }

    // Criar cliente com pontos de fidelidade inicializados
    return this.customerRepository.create({
      ...createCustomerDto,
      loyaltyPoints: 0
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    // Verificar se o cliente existe
    await this.findById(id);

    return this.customerRepository.update(id, updateCustomerDto);
  }

  async updateLoyaltyPoints(id: string, points: number): Promise<Customer> {
    // Verificar se o cliente existe
    await this.findById(id);

    return this.customerRepository.updateLoyaltyPoints(id, points);
  }

  async updateBodyMeasurements(id: string, bodyMeasurements: any): Promise<Customer> {
    // Verificar se o cliente existe
    const customer = await this.findById(id);

    // Mesclar medidas existentes com as novas
    const updatedMeasurements = {
      ...customer.bodyMeasurements,
      ...bodyMeasurements
    };

    return this.customerRepository.update(id, { bodyMeasurements: updatedMeasurements });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.customerRepository.delete(id);
  }
}
"@
New-Item -Path "src/customers/application/services" -ItemType Directory -Force
Set-Content -Path "src/customers/application/services/customer.service.ts" -Value $customerServiceContent

# Customer Controller
$customerControllerContent = @"
// src/customers/presentation/controllers/customer.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomerService } from '../../application/services/customer.service';
import { CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto, UpdateLoyaltyPointsDto, BodyMeasurementsDto } from '../../application/dtos/customer.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@ApiTags('Clientes')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso', type: [CustomerResponseDto] })
  async findAll() {
    return this.customerService.findAll();
  }

  @Get('top')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Listar os clientes mais fiéis' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de clientes (default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista dos melhores clientes', type: [CustomerResponseDto] })
  async findTopCustomers(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.customerService.findTopCustomers(limit);
  }

  @Get('birthdays')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Listar aniversariantes do mês' })
  @ApiQuery({ name: 'month', required: true, type: Number, description: 'Mês (1-12)' })
  @ApiResponse({ status: 200, description: 'Lista de aniversariantes do mês', type: [CustomerResponseDto] })
  async findBirthdaysInMonth(@Query('month', ParseIntPipe) month: number) {
    return this.customerService.findBirthdaysInMonth(month);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado com sucesso', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.customerService.findById(id);
  }

  @Get('document/:documentNumber')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar cliente por número de documento' })
  @ApiParam({ name: 'documentNumber', description: 'CPF ou CNPJ do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado com sucesso', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByDocument(@Param('documentNumber') documentNumber: string) {
    return this.customerService.findByDocument(documentNumber);
  }

  @Get('email/:email')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar cliente por email' })
  @ApiParam({ name: 'email', description: 'Email do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado com sucesso', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByEmail(@Param('email') email: string) {
    return this.customerService.findByEmail(email);
  }

  @Get('user/:userId')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Buscar cliente por ID de usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário associado ao cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado com sucesso', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByUserId(@Param('userId') userId: string) {
    return this.customerService.findByUserId(userId);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso', type: CustomerResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Put(':id/loyalty-points')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Atualizar pontos de fidelidade do cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Pontos de fidelidade atualizados com sucesso', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async updateLoyaltyPoints(
    @Param('id') id: string, 
    @Body() updateLoyaltyPointsDto: UpdateLoyaltyPointsDto
  ) {
    return this.customerService.updateLoyaltyPoints(id, updateLoyaltyPointsDto.points);
  }

  @Put(':id/measurements')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Atualizar medidas corporais do cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Medidas corporais atualizadas com sucesso', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async updateBodyMeasurements(
    @Param('id') id: string, 
    @Body() bodyMeasurementsDto: BodyMeasurementsDto
  ) {
    return this.customerService.updateBodyMeasurements(id, bodyMeasurementsDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Cliente excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async remove(@Param('id') id: string) {
    await this.customerService.delete(id);
    return;
  }
}
"@
New-Item -Path "src/customers/presentation/controllers" -ItemType Directory -Force
Set-Content -Path "src/customers/presentation/controllers/customer.controller.ts" -Value $customerControllerContent

# Customer Module
$customerModuleContent = @"
// src/customers/customers.module.ts
import { Module } from '@nestjs/common';
import { CustomerController } from './presentation/controllers/customer.controller';
import { CustomerService } from './application/services/customer.service';
import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
  exports: [CustomerService],
})
export class CustomersModule {}
"@
Set-Content -Path "src/customers/customers.module.ts" -Value $customerModuleContent

# main.ts para inicializar a aplicação com todos os filtros e pipes globais
$mainContent = @"
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/presentation/filters/http-exception.filter';
import { PrismaExceptionFilter } from './shared/presentation/filters/prisma-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Pipes globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtros de exceção globais
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento para Loja de Aluguel de Roupas')
    .setDescription('API completa para gerenciamento de loja de aluguel de roupas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // CORS
  app.enableCors();

  // Iniciar servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(\`Aplicação iniciada com sucesso na porta \${port}\`);
  logger.log(\`Documentação Swagger disponível em: http://localhost:\${port}/api/docs\`);
}

bootstrap();
"@
Set-Content -Path "src/main.ts" -Value $mainContent

# App Module para importar todos os módulos
$appModuleContent = @"
// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { LoggerMiddleware } from './shared/presentation/middlewares/logger.middleware';

@Module({
  imports: [
    // Configuração do ambiente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Módulos da aplicação
    PrismaModule,
    EmployeesModule,
    CustomersModule,
    // Outros módulos serão adicionados posteriormente
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
"@
Set-Content -Path "src/app.module.ts" -Value $appModuleContent

# Mensagem final
Write-Host @"

=====================================
Geração dos módulos de Funcionários e Clientes concluída!
=====================================

Arquivos gerados:

1. Componentes compartilhados:
   - Base Entity, Repository Interface e Service
   - Filtros de Exceção (HTTP e Prisma)
   - Middleware de Log
   - Serviço Prisma

2. Módulo de Funcionários:
   - Entidades, DTOs e Interfaces
   - Repository (com métodos específicos)
   - Service (com validações e regras de negócio)
   - Controller (com rotas REST completas)
   - Documentação Swagger

3. Módulo de Clientes:
   - Entidades, DTOs e Interfaces
   - Repository (com métodos específicos)
   - Service (com validações e regras de negócio)
   - Controller (com rotas REST completas)
   - Documentação Swagger

4. Arquivos de inicialização:
   - main.ts com configuração global
   - app.module.ts com importação dos módulos

Próximos passos:
1. Execute 'npm run start:dev' para iniciar o servidor
2. Acesse a documentação Swagger em http://localhost:3000/api/docs

"@ -ForegroundColor Green