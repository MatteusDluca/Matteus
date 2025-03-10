// src/contracts/infrastructure/factories/contract-pdf.factory.ts
import { Injectable } from '@nestjs/common';
import { Contract } from '../../domain/entities/contract.entity';

@Injectable()
export class ContractPDFFactory {
  /**
   * Prepares data for contract PDF generation
   */
  public prepareContractData(contract: Contract): any {
    // Include all relevant data
    return {
      ...contract,
      // Add any additional transformations or data needed for PDF
    };
  }

  /**
   * Prepares data for invoice PDF generation
   */
  public prepareInvoiceData(contract: Contract): any {
    // Include payment-specific data
    return {
      ...contract,
      // Add any additional transformations or data needed for invoice
    };
  }
}
