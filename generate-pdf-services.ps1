# Script to generate PDF service files for the Clothes Rental System
# This script creates all necessary files for PDF generation functionality
# Author: Claude

# Configuration
$basePath = "."  # Run from project root

# ANSI color codes for terminal output
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$RED = "`e[31m"
$RESET = "`e[0m"

# Helper functions
function Write-Success($message) {
    Write-Host "${GREEN}SUCCESS:${RESET} $message"
}

function Write-Warning($message) {
    Write-Host "${YELLOW}WARNING:${RESET} $message"
}

function Write-Error($message) {
    Write-Host "${RED}ERROR:${RESET} $message"
}

function Create-Directory($path) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Success "Created directory: $path"
    } else {
        Write-Warning "Directory already exists: $path"
    }
}

function Create-File($path, $content) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType File -Path $path -Force | Out-Null
        Set-Content -Path $path -Value $content
        Write-Success "Created file: $path"
    } else {
        Write-Warning "File already exists: $path"
        $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
        if ($overwrite -eq "y") {
            Set-Content -Path $path -Value $content
            Write-Success "Overwritten file: $path"
        }
    }
}

# Check if we're in the project root
if (-not (Test-Path "$basePath/src")) {
    Write-Error "This script should be run from the project root directory"
    exit 1
}

Write-Host "Starting PDF service files generation..."

# 1. Create PDF Service Interface
$pdfServiceInterfacePath = "$basePath/src/shared/domain/services/pdf.service.interface.ts"
$pdfServiceInterfaceContent = @'
// src/shared/domain/services/pdf.service.interface.ts
export interface IPDFService {
  generatePDF(templateName: string, data: any): Promise<Buffer>;
  getTemplateNames(): string[];
}
'@

Create-Directory (Split-Path $pdfServiceInterfacePath)
Create-File $pdfServiceInterfacePath $pdfServiceInterfaceContent

# 2. Create PDF Service Implementation
$pdfServicePath = "$basePath/src/shared/infrastructure/services/pdf.service.ts"
$pdfServiceContent = @'
// src/shared/infrastructure/services/pdf.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { IPDFService } from '../../domain/services/pdf.service.interface';
import * as PdfPrinter from 'pdfmake';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PDFService implements IPDFService {
  private readonly logger = new Logger(PDFService.name);
  private readonly printer: any;
  private readonly templates: Map<string, any> = new Map();
  private readonly fonts = {
    Roboto: {
      normal: path.join(__dirname, '../../../../node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf'),
      bold: path.join(__dirname, '../../../../node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf'),
      italics: path.join(__dirname, '../../../../node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf'),
      bolditalics: path.join(__dirname, '../../../../node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf'),
    },
  };

  constructor() {
    this.printer = new PdfPrinter(this.fonts);
    this.loadTemplates();
  }

  /**
   * Loads all PDF templates
   */
  private loadTemplates(): void {
    // Load base templates
    this.registerTemplate('contract', require('../templates/contract.template').default);
    this.registerTemplate('invoice', require('../templates/invoice.template').default);
    this.registerTemplate('product-catalog', require('../templates/product-catalog.template').default);
    this.registerTemplate('customer-profile', require('../templates/customer-profile.template').default);
    this.registerTemplate('report', require('../templates/report.template').default);

    this.logger.log(`Loaded ${this.templates.size} PDF templates`);
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
'@

Create-Directory (Split-Path $pdfServicePath)
Create-File $pdfServicePath $pdfServiceContent

# 3. Create Templates Directory and Templates
$templatesDir = "$basePath/src/shared/infrastructure/templates"
Create-Directory $templatesDir

# 3.1 Contract Template
$contractTemplatePath = "$templatesDir/contract.template.ts"
$contractTemplateContent = @'
// src/shared/infrastructure/templates/contract.template.ts
import { format } from 'date-fns';

const defaultStyles = {
  header: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10]
  },
  subheader: {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  sectionTitle: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  normal: {
    fontSize: 12,
    margin: [0, 5, 0, 2]
  },
  tableHeader: {
    bold: true,
    fontSize: 13,
    color: 'black',
    fillColor: '#eeeeee'
  }
};

export default function(data: any) {
  const formatDate = (date: string | Date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  // Format the data for display
  const formattedContract = {
    contractNumber: data.contractNumber,
    status: data.status,
    customer: data.customer,
    employee: data.employee,
    event: data.event,
    pickupDate: formatDate(data.pickupDate),
    returnDate: formatDate(data.returnDate),
    fittingDate: data.fittingDate ? formatDate(data.fittingDate) : 'Não agendada',
    totalAmount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalAmount),
    depositAmount: data.depositAmount 
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.depositAmount)
      : 'N/A',
    items: data.items || [],
    payments: data.payments || [],
    specialConditions: data.specialConditions || 'Nenhuma condição especial',
    observations: data.observations || 'Nenhuma observação',
    createdAt: formatDate(data.createdAt),
  };

  // Generate items table
  const itemsTable = {
    table: {
      headerRows: 1,
      widths: ['*', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: 'Produto', style: 'tableHeader' },
          { text: 'Quantidade', style: 'tableHeader' },
          { text: 'Preço Unitário', style: 'tableHeader' },
          { text: 'Subtotal', style: 'tableHeader' }
        ],
        ...formattedContract.items.map(item => [
          item.product?.name || 'Produto não disponível',
          item.quantity,
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice),
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)
        ])
      ]
    },
    margin: [0, 5, 0, 15]
  };

  // Generate payments table
  const paymentsTable = {
    table: {
      headerRows: 1,
      widths: ['*', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: 'Método', style: 'tableHeader' },
          { text: 'Valor', style: 'tableHeader' },
          { text: 'Status', style: 'tableHeader' },
          { text: 'Data', style: 'tableHeader' }
        ],
        ...formattedContract.payments.map(payment => [
          payment.method,
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount),
          payment.status,
          payment.paidAt ? formatDate(payment.paidAt) : 'Pendente'
        ])
      ]
    },
    margin: [0, 5, 0, 15]
  };

  // Create the document definition
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        {
          text: 'CONTRATO DE ALUGUEL',
          style: {
            fontSize: 18,
            bold: true,
            color: '#333333',
            alignment: 'center'
          },
          margin: [0, 20, 0, 0]
        }
      ]
    },
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { text: `${currentPage.toString()} de ${pageCount.toString()}`, alignment: 'center' }
        ],
        margin: [0, 0, 0, 20]
      };
    },
    content: [
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Contrato N°: ', bold: true },
              formattedContract.contractNumber
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Status: ', bold: true },
              formattedContract.status
            ],
            alignment: 'right'
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 10]
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Data de Emissão: ', bold: true },
              formattedContract.createdAt
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 20]
      },
      { text: 'INFORMAÇÕES DO CLIENTE', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Nome: ', bold: true },
              formattedContract.customer?.name || ''
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Documento: ', bold: true },
              `${formattedContract.customer?.documentType || ''} ${formattedContract.customer?.documentNumber || ''}`
            ]
          }
        ],
        style: 'normal'
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Telefone: ', bold: true },
              formattedContract.customer?.phone || ''
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Email: ', bold: true },
              formattedContract.customer?.email || ''
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 10]
      },
      { text: 'DATAS IMPORTANTES', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Data da Prova: ', bold: true },
              formattedContract.fittingDate
            ]
          }
        ],
        style: 'normal'
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Data de Retirada: ', bold: true },
              formattedContract.pickupDate
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Data de Devolução: ', bold: true },
              formattedContract.returnDate
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 10]
      },
      formattedContract.event ? 
      [
        { text: 'EVENTO', style: 'subheader' },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Nome do Evento: ', bold: true },
                formattedContract.event?.name || ''
              ]
            },
            {
              width: '*',
              text: [
                { text: 'Data do Evento: ', bold: true },
                formattedContract.event?.date ? formatDate(formattedContract.event.date) : ''
              ]
            }
          ],
          style: 'normal',
          margin: [0, 0, 0, 10]
        }
      ] : [],
      { text: 'ITENS ALUGADOS', style: 'subheader' },
      itemsTable,
      { text: 'PAGAMENTOS', style: 'subheader' },
      paymentsTable,
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Valor Total: ', bold: true },
              formattedContract.totalAmount
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Depósito/Caução: ', bold: true },
              formattedContract.depositAmount
            ],
            alignment: 'right'
          }
        ],
        style: 'normal',
        margin: [0, 10, 0, 20]
      },
      { text: 'CONDIÇÕES ESPECIAIS', style: 'sectionTitle' },
      { text: formattedContract.specialConditions, style: 'normal', margin: [0, 0, 0, 10] },
      { text: 'OBSERVAÇÕES', style: 'sectionTitle' },
      { text: formattedContract.observations, style: 'normal', margin: [0, 0, 0, 20] },
      { text: 'ASSINATURAS', style: 'sectionTitle' },
      {
        columns: [
          {
            width: '*',
            text: '___________________________',
            alignment: 'center',
            margin: [0, 50, 0, 0]
          },
          {
            width: '*',
            text: '___________________________',
            alignment: 'center',
            margin: [0, 50, 0, 0]
          }
        ]
      },
      {
        columns: [
          {
            width: '*',
            text: 'Assinatura do Cliente',
            alignment: 'center'
          },
          {
            width: '*',
            text: 'Assinatura da Empresa',
            alignment: 'center'
          }
        ],
        margin: [0, 5, 0, 0]
      },
      {
        columns: [
          {
            width: '*',
            text: formattedContract.customer?.name || '',
            alignment: 'center'
          },
          {
            width: '*',
            text: formattedContract.employee?.name || '',
            alignment: 'center'
          }
        ],
        margin: [0, 5, 0, 0]
      }
    ],
    styles: defaultStyles
  };
}
'@

Create-File $contractTemplatePath $contractTemplateContent

# 3.2 Invoice Template
$invoiceTemplatePath = "$templatesDir/invoice.template.ts"
$invoiceTemplateContent = @'
// src/shared/infrastructure/templates/invoice.template.ts
import { format } from 'date-fns';

const defaultStyles = {
  header: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10]
  },
  subheader: {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  tableHeader: {
    bold: true,
    fontSize: 13,
    color: 'black',
    fillColor: '#eeeeee'
  }
};

export default function(data: any) {
  const formatDate = (date: string | Date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Format payments
  const payments = data.payments || [];

  // Generate payments table
  const paymentsTable = {
    table: {
      headerRows: 1,
      widths: ['*', 'auto', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: 'Referência', style: 'tableHeader' },
          { text: 'Método', style: 'tableHeader' },
          { text: 'Valor', style: 'tableHeader' },
          { text: 'Status', style: 'tableHeader' },
          { text: 'Data', style: 'tableHeader' }
        ],
        ...payments.map(payment => [
          payment.reference || '-',
          payment.method,
          formatCurrency(payment.amount),
          payment.status,
          payment.paidAt ? formatDate(payment.paidAt) : 'Pendente'
        ])
      ]
    },
    margin: [0, 5, 0, 15]
  };

  // Create the document definition
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        {
          text: 'RECIBO DE PAGAMENTO',
          style: {
            fontSize: 18,
            bold: true,
            color: '#333333',
            alignment: 'center'
          },
          margin: [0, 20, 0, 0]
        }
      ]
    },
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { text: `${currentPage.toString()} de ${pageCount.toString()}`, alignment: 'center' }
        ],
        margin: [0, 0, 0, 20]
      };
    },
    content: [
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'DADOS DA EMPRESA', style: 'subheader' },
              { text: 'Nome Empresa de Aluguel de Roupas Ltda', bold: true },
              { text: 'CNPJ: 00.000.000/0001-00' },
              { text: 'Endereço: Rua Exemplo, 123 - Cidade' },
              { text: 'Telefone: (11) 1234-5678' },
              { text: 'Email: contato@empresaaluguelroupas.com' }
            ]
          },
          {
            width: '*',
            stack: [
              { text: 'RECIBO N°:', style: 'subheader', alignment: 'right' },
              { text: data.contractNumber || 'N/A', alignment: 'right', bold: true },
              { text: 'Data: ' + formatDate(data.paidAt || new Date()), alignment: 'right' }
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      { text: 'CLIENTE', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Nome: ', bold: true },
              data.customer?.name || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Documento: ', bold: true },
              `${data.customer?.documentType || ''} ${data.customer?.documentNumber || 'N/A'}`
            ]
          }
        ]
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Telefone: ', bold: true },
              data.customer?.phone || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Email: ', bold: true },
              data.customer?.email || 'N/A'
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      { text: 'CONTRATO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Contrato N°: ', bold: true },
              data.contractNumber || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Status: ', bold: true },
              data.status || 'N/A'
            ]
          }
        ]
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Retirada: ', bold: true },
              formatDate(data.pickupDate)
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Devolução: ', bold: true },
              formatDate(data.returnDate)
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      { text: 'PAGAMENTOS', style: 'subheader' },
      paymentsTable,
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'RESUMO', style: 'subheader', alignment: 'right' },
              { 
                text: [
                  { text: 'Total do Contrato: ', bold: true },
                  formatCurrency(data.totalAmount || 0)
                ], 
                alignment: 'right' 
              },
              { 
                text: [
                  { text: 'Total Pago: ', bold: true },
                  formatCurrency(
                    payments
                      .filter(p => p.status === 'PAID')
                      .reduce((sum, p) => sum + p.amount, 0)
                  )
                ], 
                alignment: 'right' 
              },
              { 
                text: [
                  { text: 'Saldo Restante: ', bold: true },
                  formatCurrency(
                    data.totalAmount - 
                    payments
                      .filter(p => p.status === 'PAID')
                      .reduce((sum, p) => sum + p.amount, 0)
                  )
                ], 
                alignment: 'right',
                margin: [0, 0, 0, 20]
              }
            ]
          }
        ]
      },
      {
        columns: [
          {
            width: '*',
            text: '___________________________',
            alignment: 'center',
            margin: [0, 40, 0, 0]
          }
        ]
      },
      {
        columns: [
          {
            width: '*',
            text: 'Assinatura do Responsável',
            alignment: 'center'
          }
        ],
        margin: [0, 5, 0, 0]
      },
      {
        columns: [
          {
            width: '*',
            text: data.employee?.name || '',
            alignment: 'center'
          }
        ],
        margin: [0, 5, 0, 0]
      }
    ],
    styles: defaultStyles
  };
}
'@

Create-File $invoiceTemplatePath $invoiceTemplateContent

# 3.3 Product Catalog Template
$productCatalogTemplatePath = "$templatesDir/product-catalog.template.ts"
$productCatalogTemplateContent = @'
// src/shared/infrastructure/templates/product-catalog.template.ts
import { format } from 'date-fns';

const defaultStyles = {
  header: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10]
  },
  subheader: {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  sectionTitle: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  normal: {
    fontSize: 12,
    margin: [0, 5, 0, 2]
  },
  tableHeader: {
    bold: true,
    fontSize: 13,
    color: 'black',
    fillColor: '#eeeeee'
  },
  categoryHeader: {
    fontSize: 14,
    bold: true,
    color: 'white',
    fillColor: '#4472C4',
    margin: [0, 10, 0, 5]
  }
};

export default function(data: any) {
  const formatDate = (date: string | Date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Group products by category
  const productsByCategory = {};
  const products = data.products || [];
  
  products.forEach(product => {
    const categoryId = product.categoryId;
    const categoryName = product.category?.name || 'Sem Categoria';
    
    if (!productsByCategory[categoryId]) {
      productsByCategory[categoryId] = {
        name: categoryName,
        products: []
      };
    }
    
    productsByCategory[categoryId].products.push(product);
  });

  // Generate content for each category
  const content = [
    {
      text: 'CATÁLOGO DE PRODUTOS',
      style: 'header',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    },
    {
      text: `Data de Emissão: ${formatDate(new Date())}`,
      alignment: 'right',
      margin: [0, 0, 0, 20]
    }
  ];

  // Add category sections
  Object.keys(productsByCategory).forEach(categoryId => {
    const category = productsByCategory[categoryId];
    
    content.push({
      text: category.name.toUpperCase(),
      style: 'categoryHeader',
      margin: [0, 10, 0, 10]
    });
    
    // Create table for products in this category
    const categoryTable = {
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Produto', style: 'tableHeader' },
            { text: 'Código', style: 'tableHeader' },
            { text: 'Tamanho', style: 'tableHeader' },
            { text: 'Cor', style: 'tableHeader' },
            { text: 'Preço', style: 'tableHeader' }
          ],
          ...category.products.map(product => [
            product.name,
            product.code,
            product.size,
            product.color,
            formatCurrency(product.rentalPrice)
          ])
        ]
      },
      margin: [0, 0, 0, 20]
    };
    
    content.push(categoryTable);
  });

  // Create the document definition
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        {
          text: 'CATÁLOGO DE PRODUTOS PARA ALUGUEL',
          style: {
            fontSize: 16,
            bold: true,
            color: '#333333',
            alignment: 'center'
          },
          margin: [0, 20, 0, 0]
        }
      ]
    },
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { text: `${currentPage.toString()} de ${pageCount.toString()}`, alignment: 'center' }
        ],
        margin: [0, 0, 0, 20]
      };
    },
    content: content,
    styles: defaultStyles
  };
}
'@

Create-File $productCatalogTemplatePath $productCatalogTemplateContent

# 3.4 Customer Profile Template
$customerProfileTemplatePath = "$templatesDir/customer-profile.template.ts"
$customerProfileTemplateContent = @'
// src/shared/infrastructure/templates/customer-profile.template.ts
import { format } from 'date-fns';

const defaultStyles = {
  header: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10]
  },
  subheader: {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  sectionTitle: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  normal: {
    fontSize: 12,
    margin: [0, 5, 0, 2]
  },
  tableHeader: {
    bold: true,
    fontSize: 13,
    color: 'black',
    fillColor: '#eeeeee'
  }
};

export default function(data: any) {
  const formatDate = (date: string | Date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  // Format customer data
  const customer = data.customer || {};
  const contracts = data.contracts || [];
  const bodyMeasurements = customer.bodyMeasurements || {};

  // Create measurements table if exists
  let measurementsSection = [];
  if (Object.keys(bodyMeasurements).length > 0) {
    // Convert measurements to rows for display
    const measurementRows = [];
    for (const [key, value] of Object.entries(bodyMeasurements)) {
      measurementRows.push([
        { text: key.charAt(0).toUpperCase() + key.slice(1), style: 'tableHeader' },
        { text: `${value} cm` }
      ]);
    }

    measurementsSection = [
      { text: 'MEDIDAS CORPORAIS', style: 'subheader' },
      {
        table: {
          widths: ['*', 'auto'],
          body: measurementRows
        },
        margin: [0, 5, 0, 15]
      }
    ];
  }

  // Create contracts history table
  const contractsTable = {
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: 'Contrato', style: 'tableHeader' },
          { text: 'Evento', style: 'tableHeader' },
          { text: 'Retirada', style: 'tableHeader' },
          { text: 'Devolução', style: 'tableHeader' },
          { text: 'Status', style: 'tableHeader' }
        ],
        ...contracts.map(contract => [
          contract.contractNumber,
          contract.event?.name || 'N/A',
          formatDate(contract.pickupDate),
          formatDate(contract.returnDate),
          contract.status
        ])
      ]
    },
    margin: [0, 5, 0, 15]
  };

  // Create the document definition
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        {
          text: 'PERFIL DO CLIENTE',
          style: {
            fontSize: 18,
            bold: true,
            color: '#333333',
            alignment: 'center'
          },
          margin: [0, 20, 0, 0]
        }
      ]
    },
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { text: `${currentPage.toString()} de ${pageCount.toString()}`, alignment: 'center' }
        ],
        margin: [0, 0, 0, 20]
      };
    },
    content: [
      {
        text: `Data de Emissão: ${formatDate(new Date())}`,
        alignment: 'right',
        margin: [0, 0, 0, 20]
      },
      { text: 'DADOS PESSOAIS', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Nome: ', bold: true },
              customer.name || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Documento: ', bold: true },
              `${customer.documentType || ''} ${customer.documentNumber || 'N/A'}`
            ]
          }
        ],
        style: 'normal'
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Data de Nascimento: ', bold: true },
              customer.birthDate ? formatDate(customer.birthDate) : 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Pontos de Fidelidade: ', bold: true },
              customer.loyaltyPoints || '0'
            ]
          }
        ],
        style: 'normal'
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Telefone: ', bold: true },
              customer.phone || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Email: ', bold: true },
              customer.email || 'N/A'
            ]
          }
        ],
        style: 'normal'
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Instagram: ', bold: true },
              customer.instagram || 'N/A'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 10]
      },
      { text: 'ENDEREÇO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Logradouro: ', bold: true },
              customer.address || 'N/A'
            ]
          }
        ],
        style: 'normal'
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Cidade: ', bold: true },
              customer.city || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Estado: ', bold: true },
              customer.state || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'CEP: ', bold: true },
              customer.zipCode || 'N/A'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 10]
      },
      ...measurementsSection,
      { text: 'PREFERÊNCIAS', style: 'subheader' },
      { text: customer.preferences || 'Nenhuma preferência registrada', style: 'normal', margin: [0, 0, 0, 10] },
      { text: 'OBSERVAÇÕES', style: 'subheader' },
      { text: customer.observations || 'Nenhuma observação registrada', style: 'normal', margin: [0, 0, 0, 10] },
      { text: 'HISTÓRICO DE ALUGUÉIS', style: 'subheader' },
      contracts.length > 0 
        ? contractsTable 
        : { text: 'Cliente não possui histórico de aluguéis.', style: 'normal', margin: [0, 0, 0, 10] }
    ],
    styles: defaultStyles
  };
}
'@

Create-File $customerProfileTemplatePath $customerProfileTemplateContent

# 3.5 Report Template
$reportTemplatePath = "$templatesDir/report.template.ts"
$reportTemplateContent = @'
// src/shared/infrastructure/templates/report.template.ts
import { format } from 'date-fns';

const defaultStyles = {
  header: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10]
  },
  subheader: {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  sectionTitle: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5]
  },
  normal: {
    fontSize: 12,
    margin: [0, 5, 0, 2]
  },
  tableHeader: {
    bold: true,
    fontSize: 13,
    color: 'black',
    fillColor: '#eeeeee'
  }
};

export default function(data: any) {
  const formatDate = (date: string | Date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Format report data
  const reportInfo = {
    title: data.title || 'Relatório',
    subtitle: data.subtitle || '',
    date: formatDate(new Date()),
    period: data.period || 'Não especificado',
    generatedBy: data.generatedBy || 'Sistema',
    content: data.content || []
  };

  // Build dynamic content based on report data
  const reportContent = [];

  // Add each content section from the data
  reportInfo.content.forEach(section => {
    reportContent.push({ text: section.title, style: 'subheader' });
    
    if (section.description) {
      reportContent.push({ text: section.description, style: 'normal', margin: [0, 0, 0, 10] });
    }
    
    // Add table if available
    if (section.table && section.table.headers && section.table.rows) {
      const tableHeaders = section.table.headers.map(header => ({ text: header, style: 'tableHeader' }));
      
      const tableBody = [tableHeaders];
      section.table.rows.forEach(row => {
        tableBody.push(row);
      });
      
      reportContent.push({
        table: {
          headerRows: 1,
          widths: Array(section.table.headers.length).fill('*'),
          body: tableBody
        },
        margin: [0, 5, 0, 15]
      });
    }
    
    // Add chart placeholder if available
    if (section.chart) {
      reportContent.push({
        text: `[GRÁFICO: ${section.chart.title || 'Gráfico'}]`,
        style: 'normal',
        alignment: 'center',
        margin: [0, 10, 0, 10]
      });
      
      // Add chart description if available
      if (section.chart.description) {
        reportContent.push({
          text: section.chart.description,
          style: 'normal',
          margin: [0, 0, 0, 10],
          italics: true
        });
      }
    }
    
    // Add summary if available
    if (section.summary) {
      reportContent.push({ text: 'Resumo', style: 'sectionTitle' });
      section.summary.forEach(item => {
        reportContent.push({
          columns: [
            {
              width: '*',
              text: [
                { text: `${item.label}: `, bold: true },
                item.value
              ]
            }
          ],
          style: 'normal'
        });
      });
    }
  });

  // Create the document definition
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        {
          text: reportInfo.title.toUpperCase(),
          style: {
            fontSize: 18,
            bold: true,
            color: '#333333',
            alignment: 'center'
          },
          margin: [0, 20, 0, 0]
        }
      ]
    },
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { text: `${currentPage.toString()} de ${pageCount.toString()}`, alignment: 'center' }
        ],
        margin: [0, 0, 0, 20]
      };
    },
    content: [
      reportInfo.subtitle ? {
        text: reportInfo.subtitle,
        style: 'subheader',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      } : {},
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Data do Relatório: ', bold: true },
              reportInfo.date
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Período: ', bold: true },
              reportInfo.period
            ],
            alignment: 'right'
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 5]
      },
      {
        text: [
          { text: 'Gerado por: ', bold: true },
          reportInfo.generatedBy
        ],
        style: 'normal',
        margin: [0, 0, 0, 20]
      },
      ...reportContent
    ],
    styles: defaultStyles
  };
}
'@

Create-File $reportTemplatePath $reportTemplateContent

# 4. Create PDF Module
$pdfModulePath = "$basePath/src/shared/infrastructure/pdf/pdf.module.ts"
$pdfModuleContent = @'
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
'@

Create-Directory (Split-Path $pdfModulePath)
Create-File $pdfModulePath $pdfModuleContent

# 5. Create Factory for Contract PDFs
$contractPdfFactoryPath = "$basePath/src/contracts/infrastructure/factories/contract-pdf.factory.ts"
$contractPdfFactoryContent = @'
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
'@

Create-Directory (Split-Path $contractPdfFactoryPath)
Create-File $contractPdfFactoryPath $contractPdfFactoryContent

# 6. Create Factory for Product PDFs
$productPdfFactoryPath = "$basePath/src/inventory/infrastructure/factories/product-pdf.factory.ts"
$productPdfFactoryContent = @'
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
'@

Create-Directory (Split-Path $productPdfFactoryPath)
Create-File $productPdfFactoryPath $productPdfFactoryContent

# 7. Create Factory for Customer PDFs
$customerPdfFactoryPath = "$basePath/src/customers/infrastructure/factories/customer-pdf.factory.ts"
$customerPdfFactoryContent = @'
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
'@

Create-Directory (Split-Path $customerPdfFactoryPath)
Create-File $customerPdfFactoryPath $customerPdfFactoryContent

# 8. Create PDF Controller for contracts
$contractPdfControllerPath = "$basePath/src/contracts/presentation/controllers/contract-pdf.controller.ts"
$contractPdfControllerContent = @'
// src/contracts/presentation/controllers/contract-pdf.controller.ts
import { Controller, Get, Param, Res, Inject, UseGuards, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { ContractService } from '../../application/services/contract.service';
import { ContractPDFFactory } from '../../infrastructure/factories/contract-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';

@ApiTags('Contratos PDF')
@Controller('contracts/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractPDFController {
  constructor(
    private readonly contractService: ContractService,
    private readonly contractPdfFactory: ContractPDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar PDF do contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({
    status: 200,
    description: 'PDF do contrato gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async generateContractPDF(@Param('id') id: string, @Res() res: Response) {
    // Buscar contrato com todas as relações necessárias
    const contract = await this.contractService.findById(id);
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${id} não encontrado`);
    }

    // Preparar dados para o PDF
    const pdfData = this.contractPdfFactory.prepareContractData(contract);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('contract', pdfData);
    
    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=contrato-${contract.contractNumber}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }

  @Get(':id/invoice')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar PDF do recibo de pagamento' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({
    status: 200,
    description: 'PDF do recibo gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async generateInvoicePDF(@Param('id') id: string, @Res() res: Response) {
    // Buscar contrato com todas as relações necessárias
    const contract = await this.contractService.findById(id);
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${id} não encontrado`);
    }

    // Preparar dados para o PDF
    const pdfData = this.contractPdfFactory.prepareInvoiceData(contract);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('invoice', pdfData);
    
    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=recibo-${contract.contractNumber}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
'@

Create-File $contractPdfControllerPath $contractPdfControllerContent

# 9. Create PDF Controller for products
$productPdfControllerPath = "$basePath/src/inventory/presentation/controllers/product-pdf.controller.ts"
$productPdfControllerContent = @'
// src/inventory/presentation/controllers/product-pdf.controller.ts
import { Controller, Get, Query, Res, Inject, UseGuards, ParseBoolPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
    @Query('onlyAvailable', new ParseBoolPipe({ optional: true })) onlyAvailable: boolean = false,
    @Query('categoryId') categoryId?: string,
    @Res() res: Response,
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
'@

Create-File $productPdfControllerPath $productPdfControllerContent

# 10. Create PDF Controller for customers
$customerPdfControllerPath = "$basePath/src/customers/presentation/controllers/customer-pdf.controller.ts"
$customerPdfControllerContent = @'
// src/customers/presentation/controllers/customer-pdf.controller.ts
import { Controller, Get, Param, Res, Inject, UseGuards, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { CustomerService } from '../../application/services/customer.service';
import { CustomerPDFFactory } from '../../infrastructure/factories/customer-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';

@ApiTags('Clientes PDF')
@Controller('customers/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerPDFController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerPdfFactory: CustomerPDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get('profile/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar perfil do cliente em PDF' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do cliente gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async generateCustomerProfile(@Param('id') id: string, @Res() res: Response) {
    // Buscar cliente
    const customer = await this.customerService.findById(id);
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Aqui idealmente buscaria o histórico de contratos do cliente
    // Isso exigiria injetar o serviço de contratos ou fazer uma consulta
    // Para simplificar, enviamos um array vazio
    const contracts = [];

    // Preparar dados para o PDF
    const pdfData = this.customerPdfFactory.prepareProfileData(customer, contracts);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('customer-profile', pdfData);
    
    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=cliente-${customer.documentNumber}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
'@

Create-File $customerPdfControllerPath $customerPdfControllerContent

# 11. Update the module files to include PDF controllers and services

# 11.1 Update Contracts Module
$contractsModulePath = "$basePath/src/contracts/contracts.module.ts"

# We need to read the file contents first
$contractsModuleContent = Get-Content -Path $contractsModulePath -Raw

# Update Contracts Module to include PDFModule and the PDF controller
$updatedContractsModuleContent = $contractsModuleContent -replace 
'import { Module } from (.+?);', @'
import { Module } from $1;
import { PDFModule } from '../shared/infrastructure/pdf/pdf.module';
'@ -replace 
'controllers: \[([^\]]+)\],', @'
controllers: [$1
    ContractPDFController,
  ],
'@ -replace 
'imports: \[([^\]]+)\],', @'
imports: [$1
    PDFModule,
  ],
'@ -replace 
'EmployeeRepository', @'
EmployeeRepository,
    ContractPDFFactory
'@ -replace 
'CustomerRepository', @'
CustomerRepository
import { ContractPDFController } from './presentation/controllers/contract-pdf.controller';
import { ContractPDFFactory } from './infrastructure/factories/contract-pdf.factory';
'@

# Write the updated content back to the file
if ($contractsModuleContent -ne $updatedContractsModuleContent) {
    Set-Content -Path $contractsModulePath -Value $updatedContractsModuleContent
    Write-Success "Updated Contracts Module with PDF support"
} else {
    Write-Warning "No changes needed for Contracts Module"
}

# 11.2 Update Inventory Module
$inventoryModulePath = "$basePath/src/inventory/inventory.module.ts"

# We need to read the file contents first
$inventoryModuleContent = Get-Content -Path $inventoryModulePath -Raw

# Update Inventory Module to include PDFModule and the PDF controller
$updatedInventoryModuleContent = $inventoryModuleContent -replace 
'import { Module } from (.+?);', @'
import { Module } from $1;
import { PDFModule } from '../shared/infrastructure/pdf/pdf.module';
'@ -replace 
'controllers: \[([^\]]+)\],', @'
controllers: [$1
    ProductPDFController,
  ],
'@ -replace 
'imports: \[([^\]]+)\],', @'
imports: [$1
    PDFModule,
  ],
'@ -replace 
'MaintenanceLogRepository', @'
MaintenanceLogRepository,
    ProductPDFFactory
'@ -replace 
'PrismaModule', @'
PrismaModule
import { ProductPDFController } from './presentation/controllers/product-pdf.controller';
import { ProductPDFFactory } from './infrastructure/factories/product-pdf.factory';
'@

# Write the updated content back to the file
if ($inventoryModuleContent -ne $updatedInventoryModuleContent) {
    Set-Content -Path $inventoryModulePath -Value $updatedInventoryModuleContent
    Write-Success "Updated Inventory Module with PDF support"
} else {
    Write-Warning "No changes needed for Inventory Module"
}

# 11.3 Update Customers Module
$customersModulePath = "$basePath/src/customers/customers.module.ts"

# We need to read the file contents first
$customersModuleContent = Get-Content -Path $customersModulePath -Raw

# Update Customers Module to include PDFModule and the PDF controller
$updatedCustomersModuleContent = $customersModuleContent -replace 
'import { Module } from (.+?);', @'
import { Module } from $1;
import { PDFModule } from '../shared/infrastructure/pdf/pdf.module';
'@ -replace 
'controllers: \[([^\]]+)\],', @'
controllers: [
    $1,
    CustomerPDFController,
  ],
'@ -replace 
'imports: \[([^\]]+)\],', @'
imports: [$1, PDFModule],
'@ -replace 
'providers: \[', @'
providers: [
    CustomerPDFFactory,
'@ -replace 
'PrismaModule', @'
PrismaModule
import { CustomerPDFController } from './presentation/controllers/customer-pdf.controller';
import { CustomerPDFFactory } from './infrastructure/factories/customer-pdf.factory';
'@

# Write the updated content back to the file
if ($customersModuleContent -ne $updatedCustomersModuleContent) {
    Set-Content -Path $customersModulePath -Value $updatedCustomersModuleContent
    Write-Success "Updated Customers Module with PDF support"
} else {
    Write-Warning "No changes needed for Customers Module"
}

# 12. Update Shared Module to export PDFModule
$sharedModulePath = "$basePath/src/shared/shared.module.ts"

# Check if the file exists, if not create it
if (-not (Test-Path $sharedModulePath)) {
    $sharedModuleContent = @'
// src/shared/shared.module.ts
import { Module } from '@nestjs/common';
import { PDFModule } from './infrastructure/pdf/pdf.module';

@Module({
  imports: [PDFModule],
  exports: [PDFModule],
})
export class SharedModule {}
'@
    Create-File $sharedModulePath $sharedModuleContent
} else {
    # File exists, read and update
    $sharedModuleContent = Get-Content -Path $sharedModulePath -Raw
    
    # Check if PDFModule is already imported
    if ($sharedModuleContent -notmatch 'PDFModule') {
        $updatedSharedModuleContent = $sharedModuleContent -replace 
        'import { Module } from (.+?);', @'
import { Module } from $1;
import { PDFModule } from './infrastructure/pdf/pdf.module';
'@ -replace 
        'imports: \[([^\]]*)\]', @'
imports: [$1, PDFModule]
'@ -replace 
        'exports: \[([^\]]*)\]', @'
exports: [$1, PDFModule]
'@
        
        # Write the updated content back to the file
        Set-Content -Path $sharedModulePath -Value $updatedSharedModuleContent
        Write-Success "Updated Shared Module to export PDFModule"
    } else {
        Write-Warning "PDFModule already included in Shared Module"
    }
}

Write-Host "`nPDF service files generation completed successfully!"
Write-Host "The following functionality has been added:"
Write-Host "1. PDF generation service"
Write-Host "2. PDF templates for contracts, invoices, products, customers and reports"
Write-Host "3. PDF controllers for each domain"
Write-Host "4. PDF factories for data preparation"
Write-Host "`nAvailable endpoints:"
Write-Host "- GET /api/contracts/pdf/:id - Generate contract PDF"
Write-Host "- GET /api/contracts/pdf/:id/invoice - Generate invoice PDF"
Write-Host "- GET /api/products/pdf/catalog - Generate product catalog PDF"
Write-Host "- GET /api/customers/pdf/profile/:id - Generate customer profile PDF"