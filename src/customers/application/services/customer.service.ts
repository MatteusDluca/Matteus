// src/customers/application/services/customer.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Customer, BodyMeasurements } from '../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CreateCustomerDto, UpdateCustomerDto, BodyMeasurementsDto } from '../dtos/customer.dto';
import { BaseService } from '../../../shared/application/services/base.service';

@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {
    super(customerRepository);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async findByDocument(documentNumber: string): Promise<Customer> {
    const customer = await this.customerRepository.findByDocument(documentNumber);
    if (!customer) {
      throw new NotFoundException(`Cliente com documento ${documentNumber} não encontrado`);
    }
    return customer;
  }

  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new NotFoundException(`Cliente com email ${email} não encontrado`);
    }
    return customer;
  }

  async findByUserId(userId: string): Promise<Customer> {
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException(`Cliente com ID de usuário ${userId} não encontrado`);
    }
    return customer;
  }

  async findTopCustomers(limit = 10): Promise<Customer[]> {
    return this.customerRepository.findTopCustomers(limit);
  }

  async findBirthdaysInMonth(month: number): Promise<Customer[]> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Mês deve estar entre 1 e 12');
    }
    return this.customerRepository.findBirthdaysInMonth(month);
  }

  // Sobrescrevendo o método create da classe base para aceitar CreateCustomerDto
  async create(data: Partial<Customer> | CreateCustomerDto): Promise<Customer> {
    const createCustomerDto = data as CreateCustomerDto;

    // Verificar se já existe um cliente com o mesmo documento
    const existingCustomer = await this.customerRepository.findByDocument(
      createCustomerDto.documentNumber,
    );
    if (existingCustomer) {
      throw new BadRequestException(
        `Já existe um cliente com o documento ${createCustomerDto.documentNumber}`,
      );
    }

    // Verificar se já existe um cliente com o mesmo userId (se fornecido)
    if (createCustomerDto.userId) {
      const existingCustomerUser = await this.customerRepository.findByUserId(
        createCustomerDto.userId,
      );
      if (existingCustomerUser) {
        throw new BadRequestException(`Já existe um cliente associado ao usuário informado`);
      }
    }

    // Transformar BodyMeasurementsDto em BodyMeasurements
    let bodyMeasurements: BodyMeasurements | undefined;
    if (createCustomerDto.bodyMeasurements) {
      bodyMeasurements = this.convertToBodyMeasurements(createCustomerDto.bodyMeasurements);
    }

    // Criar cliente com pontos de fidelidade inicializados
    return this.customerRepository.create({
      ...createCustomerDto,
      bodyMeasurements,
      loyaltyPoints: 0,
    });
  }

  async update(id: string, data: Partial<Customer> | UpdateCustomerDto): Promise<Customer> {
    // Verificar se o cliente existe
    await this.findById(id);

    const updateCustomerDto = data as UpdateCustomerDto;

    // Transformar BodyMeasurementsDto em BodyMeasurements se existir
    let bodyMeasurements: BodyMeasurements | undefined;
    if (updateCustomerDto.bodyMeasurements) {
      bodyMeasurements = this.convertToBodyMeasurements(updateCustomerDto.bodyMeasurements);

      // Criar uma nova cópia do objeto de atualização com o bodyMeasurements convertido
      const updatedData = {
        ...updateCustomerDto,
        bodyMeasurements,
      };

      return this.customerRepository.update(id, updatedData);
    }

    return this.customerRepository.update(id, updateCustomerDto);
  }

  async updateLoyaltyPoints(id: string, points: number): Promise<Customer> {
    // Verificar se o cliente existe
    await this.findById(id);

    return this.customerRepository.updateLoyaltyPoints(id, points);
  }

  async updateBodyMeasurements(
    id: string,
    bodyMeasurementsDto: BodyMeasurementsDto,
  ): Promise<Customer> {
    // Verificar se o cliente existe
    const customer = await this.findById(id);

    // Converter BodyMeasurementsDto para BodyMeasurements
    const bodyMeasurements = this.convertToBodyMeasurements(bodyMeasurementsDto);

    // Mesclar medidas existentes com as novas
    const currentMeasurements = customer.bodyMeasurements || {};
    const updatedMeasurements = {
      ...currentMeasurements,
      ...bodyMeasurements,
    };

    return this.customerRepository.update(id, { bodyMeasurements: updatedMeasurements });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    return this.customerRepository.delete(id);
  }

  // Método auxiliar para converter BodyMeasurementsDto para BodyMeasurements
  private convertToBodyMeasurements(dto: BodyMeasurementsDto): BodyMeasurements {
    // Criar um objeto com índice de assinatura para string
    const result: BodyMeasurements = {};

    // Copiar todas as propriedades do DTO para o objeto resultado
    for (const key in dto) {
      if (Object.prototype.hasOwnProperty.call(dto, key)) {
        result[key] = dto[key];
      }
    }

    return result;
  }
}
