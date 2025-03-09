import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class CategoryRepository implements ICategoryRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    getWithProductCount(): Promise<{
        id: string;
        name: string;
        productCount: number;
    }[]>;
    create(data: Partial<Category>): Promise<Category>;
    update(id: string, data: Partial<Category>): Promise<Category>;
    delete(id: string): Promise<void>;
}
