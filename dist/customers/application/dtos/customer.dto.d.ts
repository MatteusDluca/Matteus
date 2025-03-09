import { DocumentType } from '../../domain/entities/customer.entity';
export declare class BodyMeasurementsDto {
    [key: string]: number | undefined;
    bust?: number;
    waist?: number;
    hips?: number;
    height?: number;
    shoulders?: number;
    inseam?: number;
    sleeve?: number;
    neck?: number;
}
export declare class CreateCustomerDto {
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
    bodyMeasurements?: BodyMeasurementsDto;
    preferences?: string;
    observations?: string;
}
export declare class UpdateCustomerDto {
    userId?: string;
    name?: string;
    birthDate?: Date;
    phone?: string;
    email?: string;
    instagram?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    bodyMeasurements?: BodyMeasurementsDto;
    preferences?: string;
    observations?: string;
}
export declare class UpdateLoyaltyPointsDto {
    points: number;
}
export declare class CustomerResponseDto {
    id: string;
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
    bodyMeasurements?: BodyMeasurementsDto;
    loyaltyPoints: number;
    preferences?: string;
    observations?: string;
    createdAt: Date;
    updatedAt: Date;
}
