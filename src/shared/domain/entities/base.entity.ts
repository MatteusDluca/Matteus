// src/shared/domain/entities/base.entity.ts
export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
