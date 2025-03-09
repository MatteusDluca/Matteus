export declare class CreateEmployeeDto {
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
export declare class UpdateEmployeeDto {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    position?: string;
    salary?: number;
    hireDate?: Date;
    workingHours?: string;
    performanceRate?: number;
}
export declare class EmployeeResponseDto {
    id: string;
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
    createdAt: Date;
    updatedAt: Date;
}
