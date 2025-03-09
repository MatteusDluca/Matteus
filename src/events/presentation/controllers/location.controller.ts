// src/events/presentation/controllers/location.controller.ts
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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LocationService } from '../../application/services/location.service';
import {
  CreateLocationDto,
  UpdateLocationDto,
  LocationDto,
  LocationWithEventCountDto,
} from '../../application/dtos/location.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';

@ApiTags('Locais de Eventos')
@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar todos os locais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de locais retornada com sucesso',
    type: [LocationDto],
  })
  async findAll() {
    return this.locationService.findAll();
  }

  @Get('most-used')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Listar locais mais utilizados' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de locais (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dos locais mais utilizados',
    type: [LocationWithEventCountDto],
  })
  async findMostUsedLocations(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.locationService.findMostUsedLocations(limit);
  }

  @Get('city/:city')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Listar locais por cidade' })
  @ApiParam({ name: 'city', description: 'Nome da cidade' })
  @ApiResponse({
    status: 200,
    description: 'Lista de locais da cidade',
    type: [LocationDto],
  })
  async findByCity(@Param('city') city: string) {
    return this.locationService.findByCity(city);
  }

  @Get('name/:name')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar local por nome' })
  @ApiParam({ name: 'name', description: 'Nome do local' })
  @ApiResponse({
    status: 200,
    description: 'Local encontrado com sucesso',
    type: LocationDto,
  })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async findByName(@Param('name') name: string) {
    return this.locationService.findByName(name);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Buscar local por ID' })
  @ApiParam({ name: 'id', description: 'ID do local' })
  @ApiResponse({
    status: 200,
    description: 'Local encontrado com sucesso',
    type: LocationDto,
  })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.locationService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Criar novo local' })
  @ApiResponse({
    status: 201,
    description: 'Local criado com sucesso',
    type: LocationDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar local' })
  @ApiParam({ name: 'id', description: 'ID do local' })
  @ApiResponse({
    status: 200,
    description: 'Local atualizado com sucesso',
    type: LocationDto,
  })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Excluir local' })
  @ApiParam({ name: 'id', description: 'ID do local' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Local excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async remove(@Param('id') id: string) {
    await this.locationService.delete(id);
    return;
  }
}
