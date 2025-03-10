// src/inventory/infrastructure/factories/product-pdf.factory.ts
import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class ProductPDFFactory {
  /**
   * Prepares data for product catalog PDF generation
   */
  public prepareCatalogData(products: Product[], categories: Category[]): any {
    return {
      products,
      categories,
      // Add any additional transformations or data needed for PDF
    };
  }
}
