// src/shared/domain/services/pdf.service.interface.ts
export interface IPDFService {
  generatePDF(templateName: string, data: any): Promise<Buffer>;
  getTemplateNames(): string[];
}
