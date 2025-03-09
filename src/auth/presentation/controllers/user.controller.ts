// src/auth/presentation/controllers/user.controller.ts
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
  Req, // Adicionando a importação do Req
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express'; // Importando Request do express
import { UserService } from '../../application/services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserWithoutSensitiveDataDto,
} from '../../application/dtos/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { Role, UserStatus } from '../../domain/entities/user.entity';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UserResponseDto],
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário atual' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
    type: UserWithoutSensitiveDataDto,
  })
  async findMe(@CurrentUser('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buscar usuário por email' })
  @ApiParam({ name: 'email', description: 'Email do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser('id') adminId: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;

    return this.userService.create(createUserDto, adminId, ipAddress, userAgent);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('id') adminId: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;

    return this.userService.update(id, updateUserDto, adminId, ipAddress, userAgent);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar status do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiQuery({
    name: 'status',
    enum: UserStatus,
    description: 'Novo status do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async updateStatus(
    @Param('id') id: string,
    @Query('status') status: UserStatus,
    @CurrentUser('id') adminId: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;

    // O método correto é updateStatus, não changeStatus
    return this.userService.updateStatus(id, status, adminId, ipAddress, userAgent);
  }

  @Post(':id/reset-password')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Resetar senha do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Senha resetada com sucesso',
    schema: {
      properties: {
        password: { type: 'string', description: 'Nova senha temporária' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async resetPassword(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;

    return this.userService.resetPassword(id, adminId, ipAddress, userAgent);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Usuário excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id') id: string, @CurrentUser('id') adminId: string, @Req() req: Request) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;

    await this.userService.delete(id, adminId, ipAddress, userAgent);
    return;
  }
}
