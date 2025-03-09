import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { BaseService } from '../../../shared/application/services/base.service';
export declare class CategoryService extends BaseService<Category> {
    private readonly categoryRepository;
    constructor(categoryRepository: ICategoryRepository);
    findAll(): Promise<Category[]>;
    findByName(name: string): Promise<Category>;
    getWithProductCount(): Promise<{
        id: string;
        name: string;
        productCount: number;
    }[]>;
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    delete(id: string): Promise<void>;
}
