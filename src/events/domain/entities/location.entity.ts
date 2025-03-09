// src/events/domain/entities/location.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Event } from './event.entity';

export class Location extends BaseEntity {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity?: number | null; // Modificado para aceitar null
  type?: string | null; // Modificado para aceitar null
  description?: string | null; // Modificado para aceitar null

  // Relacionamentos
  events?: Event[];
}
