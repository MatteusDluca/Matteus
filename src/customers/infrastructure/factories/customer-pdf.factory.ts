// src/customers/infrastructure/factories/customer-pdf.factory.ts
import { Injectable } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';

@Injectable()
export class CustomerPDFFactory {
  /**
   * Prepares data for customer profile PDF generation
   */
  public prepareProfileData(customer: Customer, contracts: any[] = []): any {
    return {
      customer,
      contracts,
      // Add any additional transformations or data needed for PDF
    };
  }
}
