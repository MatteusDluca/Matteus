export declare class CreateLocationDto {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    capacity?: number;
    type?: string;
    description?: string;
}
export declare class UpdateLocationDto {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    capacity?: number;
    type?: string;
    description?: string;
}
export declare class LocationDto {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    capacity?: number;
    type?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class LocationWithEventCountDto {
    id: string;
    name: string;
    eventCount: number;
}
