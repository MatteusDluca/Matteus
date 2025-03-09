// src/customers/domain/entities/customer.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

// src/customers/domain/entities/customer.entity.ts
export interface BodyMeasurements {
  bust?: number;
  waist?: number;
  hips?: number;
  height?: number;
  shoulders?: number;
  inseam?: number;
  sleeve?: number;
  neck?: number;
  // Adicionar esta linha para compatibilidade com Prisma JSON
  [key: string]: number | undefined;
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
