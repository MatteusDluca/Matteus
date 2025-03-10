// src/shared/infrastructure/services/pdf.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { IPDFService } from '../../domain/services/pdf.service.interface';
import PdfPrinter from 'pdfmake';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PDFService implements IPDFService {
  private readonly logger = new Logger(PDFService.name);
  private readonly printer: any;
  private readonly templates: Map<string, any> = new Map();
  private readonly fonts = {
    Roboto: {
      // Point to our local fonts directory
      normal: path.join(__dirname, '../fonts/Roboto/Roboto-Regular.ttf'),
      bold: path.join(__dirname, '../fonts/Roboto/Roboto-Medium.ttf'),
      italics: path.join(__dirname, '../fonts/Roboto/Roboto-Italic.ttf'),
      bolditalics: path.join(__dirname, '../fonts/Roboto/Roboto-MediumItalic.ttf'),
    },
  };

  constructor() {
    this.printer = new PdfPrinter(this.fonts);
    this.loadTemplates();
  }

  async onModuleInit() {
    await this.loadTemplates();
  }

  /**
   * Loads all PDF templates
   * This method initializes all the templates that can be used to generate PDFs
   */
  private async loadTemplates(): Promise<void> {
    try {
      // Define the core templates that must exist
      const requiredTemplates = [
        { name: 'contract', path: '../templates/contract.template' },
        { name: 'invoice', path: '../templates/invoice.template' },
        { name: 'product-catalog', path: '../templates/product-catalog.template' },
        { name: 'customer-profile', path: '../templates/customer-profile.template' },
        { name: 'report', path: '../templates/report.template' },
      ];

      // Define optional templates
      const optionalTemplates = [
        { name: 'employee-profile', path: '../templates/employee-profile.template' },
        { name: 'event-detail', path: '../templates/event-detail.template' },
        { name: 'location-detail', path: '../templates/location-detail.template' },
      ];

      // Load required templates
      for (const template of requiredTemplates) {
        try {
          // Using import() for ESLint compliance
          const module = await import(template.path);
          if (module.default) {
            this.registerTemplate(template.name, module.default);
            this.logger.log(`Loaded template: ${template.name}`);
          } else {
            this.logger.error(`Template ${template.name} has no default export`);
          }
        } catch (e) {
          this.logger.error(`Required template ${template.name} could not be loaded: ${e.message}`);
          // Don't rethrow - we want to try loading other templates
        }
      }

      // Load optional templates
      for (const template of optionalTemplates) {
        try {
          const module = await import(template.path);
          if (module.default) {
            this.registerTemplate(template.name, module.default);
            this.logger.log(`Loaded optional template: ${template.name}`);
          }
        } catch (e) {
          this.logger.warn(`Optional template ${template.name} not found, skipping`);
        }
      }

      this.logger.log(`Loaded ${this.templates.size} PDF templates`);
    } catch (error) {
      this.logger.error(`Error loading templates: ${error.message}`, error.stack);
    }
  }

  /**
   * Register a template
   */
  public registerTemplate(name: string, template: any): void {
    this.templates.set(name, template);
  }

  /**
   * Get template names
   */
  public getTemplateNames(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Generate PDF from template and data
   */
  public async generatePDF(templateName: string, data: any): Promise<Buffer> {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    try {
      // Generate document definition by calling the template function with data
      const documentDefinition = template(data);

      // Create PDF
      const pdfDoc = this.printer.createPdfKitDocument(documentDefinition);

      return new Promise((resolve, reject) => {
        try {
          const chunks: Buffer[] = [];
          pdfDoc.on('data', (chunk) => chunks.push(chunk));
          pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
          pdfDoc.on('error', reject);
          pdfDoc.end();
        } catch (err) {
          reject(err);
        }
      });
    } catch (error) {
      this.logger.error(`Error generating PDF: ${error.message}`, error.stack);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }
}
