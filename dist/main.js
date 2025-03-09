"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./shared/presentation/filters/http-exception.filter");
const prisma_exception_filter_1 = require("./shared/presentation/filters/prisma-exception.filter");
const common_2 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_2.Logger('Bootstrap');
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(), new prisma_exception_filter_1.PrismaExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API de Gerenciamento para Loja de Aluguel de Roupas')
        .setDescription('API completa para gerenciamento de loja de aluguel de roupas')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.enableCors();
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Aplicação iniciada com sucesso na porta ${port}`);
    logger.log(`Documentação Swagger disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map