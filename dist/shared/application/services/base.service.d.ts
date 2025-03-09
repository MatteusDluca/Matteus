import { IBaseRepository } from '../../domain/repositories/base.repository.interface';
export declare abstract class BaseService<T> {
    private readonly repository;
    constructor(repository: IBaseRepository<T>);
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
}
