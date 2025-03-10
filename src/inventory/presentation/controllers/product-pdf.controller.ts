// src/inventory/presentation/controllers/product-pdf.controller.ts
import { Controller, Get, Query, Res, Inject, UseGuards, ParseBoolPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { ProductService } from '../../application/services/product.service';
import { CategoryService } from '../../application/services/category.service';
import { ProductPDFFactory } from '../../infrastructure/factories/product-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';
import { ProductStatus } from '../../domain/entities/product.entity';

@ApiTags('Produtos PDF')
@Controller('products/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductPDFController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly productPdfFactory: ProductPDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get('catalog')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar catálogo de produtos em PDF' })
  @ApiQuery({
    name: 'onlyAvailable',
    required: false,
    type: Boolean,
    description: 'Apenas produtos disponíveis?',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filtrar por categoria específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Catálogo de produtos gerado com sucesso',
  })
  async generateProductCatalog(
    @Res() res: Response,
    @Query('onlyAvailable', new ParseBoolPipe({ optional: true })) onlyAvailable = false,
    @Query('categoryId') categoryId?: string,
  ) {
    // Buscar produtos com filtros
    let products;
    if (onlyAvailable) {
      products = await this.productService.findByStatus(ProductStatus.AVAILABLE);
    } else if (categoryId) {
      products = await this.productService.findByCategoryId(categoryId);
    } else {
      products = await this.productService.findAll();
    }

    // Buscar todas as categorias
    const categories = await this.categoryService.findAll();

    // Preparar dados para o PDF
    const pdfData = this.productPdfFactory.prepareCatalogData(products, categories);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('product-catalog', pdfData);

    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=catalogo-produtos.pdf',
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
