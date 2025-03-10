// src/shared/infrastructure/pdf/pdf.module.ts
import { Module } from '@nestjs/common';
import { PDFService } from '../services/pdf.service';

@Module({
  providers: [
    {
      provide: 'IPDFService',
      useClass: PDFService,
    },
  ],
  exports: ['IPDFService'],
})
export class PDFModule {}
