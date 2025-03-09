import { CategoryService } from '../../application/services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../application/dtos/category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(): Promise<import("../../domain/entities/category.entity").Category[]>;
    getWithProductCount(): Promise<{
        id: string;
        name: string;
        productCount: number;
    }[]>;
    findOne(id: string): Promise<import("../../domain/entities/category.entity").Category>;
    findByName(name: string): Promise<import("../../domain/entities/category.entity").Category>;
    create(createCategoryDto: CreateCategoryDto): Promise<import("../../domain/entities/category.entity").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("../../domain/entities/category.entity").Category>;
    remove(id: string): Promise<void>;
}
