"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../shared/application/services/base.service");
let CategoryService = class CategoryService extends base_service_1.BaseService {
    constructor(categoryRepository) {
        super(categoryRepository);
        this.categoryRepository = categoryRepository;
    }
    async findAll() {
        return this.categoryRepository.findAll();
    }
    async findByName(name) {
        const category = await this.categoryRepository.findByName(name);
        if (!category) {
            throw new common_1.NotFoundException(`Categoria com nome ${name} não encontrada`);
        }
        return category;
    }
    async getWithProductCount() {
        return this.categoryRepository.getWithProductCount();
    }
    async create(createCategoryDto) {
        const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
        if (existingCategory) {
            throw new common_1.BadRequestException(`Já existe uma categoria com o nome ${createCategoryDto.name}`);
        }
        return this.categoryRepository.create(createCategoryDto);
    }
    async update(id, updateCategoryDto) {
        await this.findById(id);
        if (updateCategoryDto.name) {
            const existingCategory = await this.categoryRepository.findByName(updateCategoryDto.name);
            if (existingCategory && existingCategory.id !== id) {
                throw new common_1.BadRequestException(`Já existe uma categoria com o nome ${updateCategoryDto.name}`);
            }
        }
        return this.categoryRepository.update(id, updateCategoryDto);
    }
    async delete(id) {
        await this.findById(id);
        return this.categoryRepository.delete(id);
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ICategoryRepository')),
    __metadata("design:paramtypes", [Object])
], CategoryService);
//# sourceMappingURL=category.service.js.map