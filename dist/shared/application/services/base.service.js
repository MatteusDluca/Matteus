"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        return this.repository.findAll();
    }
    async findById(id) {
        const entity = await this.repository.findById(id);
        if (!entity) {
            throw new common_1.NotFoundException(`Entidade com ID ${id} não encontrada`);
        }
        return entity;
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(id, data) {
        await this.findById(id);
        return this.repository.update(id, data);
    }
    async delete(id) {
        await this.findById(id);
        return this.repository.delete(id);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map