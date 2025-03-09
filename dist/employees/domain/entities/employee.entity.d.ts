import { BaseEntity } from '../../../shared/domain/entities/base.entity';
export declare class Employee extends BaseEntity {
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
