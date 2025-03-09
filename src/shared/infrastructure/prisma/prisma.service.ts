// src/shared/infrastructure/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    this.logger.log('Conectando ao banco de dados...');
    await this.$connect();
    this.logger.log('Conectado ao banco de dados com sucesso');

    // Log de consultas lentas
    (this as any).$on('query', (e: any) => {
      if (e.duration > 500) {
        // Log para consultas que levam mais de 500ms
        this.logger.warn(`Consulta lenta (${e.duration}ms): ${e.query}`);
      }
    });
  }

  async onModuleDestroy() {
    this.logger.log('Desconectando do banco de dados...');
    await this.$connect();

    this.logger.log('Desconectado do banco de dados com sucesso');
  }
}
