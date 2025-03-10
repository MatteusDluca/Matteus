// src/shared/shared.module.ts
import { Module } from '@nestjs/common';
import { PDFModule } from './infrastructure/pdf/pdf.module';

@Module({
  imports: [PDFModule],
  exports: [PDFModule],
})
export class SharedModule {}
