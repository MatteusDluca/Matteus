// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/presentation/filters/http-exception.filter';
import { PrismaExceptionFilter } from './shared/presentation/filters/prisma-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Pipes globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtros de exceção globais
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento para Loja de Aluguel de Roupas')
    .setDescription('API completa para gerenciamento de loja de aluguel de roupas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // CORS
  app.enableCors();

  // Iniciar servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Aplicação iniciada com sucesso na porta ${port}`);
  logger.log(`Documentação Swagger disponível em: http://localhost:${port}/api/docs`);
}

bootstrap();
