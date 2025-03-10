# Script to generate additional PDF service files for the Clothes Rental System
# This script creates PDF functionality for Employees and Events/Locations
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

Write-Host "Starting additional PDF service files generation..."

# 1. Create Employee PDF Template
$employeeTemplatePath = "$basePath/src/shared/infrastructure/templates/employee-profile.template.ts"
$employeeTemplateContent = @'
// src/shared/infrastructure/templates/employee-profile.template.ts
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

  // Format employee data
  const employee = data.employee || {};
  const contracts = data.contracts || [];
  const performanceData = data.performanceData || [];

  // Create contracts/sales table if available
  const contractsTable = {
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto'],
      body: [
        [
          { text: 'Contrato', style: 'tableHeader' },
          { text: 'Cliente', style: 'tableHeader' },
          { text: 'Data', style: 'tableHeader' },
          { text: 'Valor', style: 'tableHeader' }
        ],
        ...contracts.map(contract => [
          contract.contractNumber,
          contract.customer?.name || 'N/A',
          formatDate(contract.createdAt),
          formatCurrency(contract.totalAmount)
        ])
      ]
    },
    margin: [0, 5, 0, 15]
  };

  // Create performance table if available
  const performanceTable = performanceData.length > 0 ? {
    table: {
      headerRows: 1,
      widths: ['*', 'auto', 'auto'],
      body: [
        [
          { text: 'Período', style: 'tableHeader' },
          { text: 'Contratos', style: 'tableHeader' },
          { text: 'Desempenho', style: 'tableHeader' }
        ],
        ...performanceData.map(item => [
          item.period,
          item.contractCount.toString(),
          `${item.performanceRate.toFixed(2)}%`
        ])
      ]
    },
    margin: [0, 5, 0, 15]
  } : null;

  // Create the document definition
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        {
          text: 'PERFIL DO FUNCIONÁRIO',
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
      { text: 'INFORMAÇÕES PESSOAIS', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Nome: ', bold: true },
              employee.name || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'CPF: ', bold: true },
              employee.cpf || 'N/A'
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
              employee.phone || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Data de Contratação: ', bold: true },
              employee.hireDate ? formatDate(employee.hireDate) : 'N/A'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 10]
      },
      { text: 'INFORMAÇÕES PROFISSIONAIS', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Cargo: ', bold: true },
              employee.position || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Salário: ', bold: true },
              employee.salary ? formatCurrency(employee.salary) : 'N/A'
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
              { text: 'Horário de Trabalho: ', bold: true },
              employee.workingHours || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Taxa de Desempenho: ', bold: true },
              employee.performanceRate ? `${employee.performanceRate}%` : 'N/A'
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
              employee.address || 'N/A'
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
              employee.city || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Estado: ', bold: true },
              employee.state || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'CEP: ', bold: true },
              employee.zipCode || 'N/A'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 20]
      },
      { text: 'HISTÓRICO DE VENDAS', style: 'subheader' },
      contracts.length > 0 
        ? contractsTable 
        : { text: 'Nenhum histórico de vendas disponível.', style: 'normal', margin: [0, 0, 0, 15] },
      
      // Only add performance section if data is available
      performanceData.length > 0 ? 
        [
          { text: 'DESEMPENHO', style: 'subheader' },
          performanceTable
        ] : []
    ],
    styles: defaultStyles
  };
}
'@

Create-Directory (Split-Path $employeeTemplatePath)
Create-File $employeeTemplatePath $employeeTemplateContent

# 2. Create Event PDF Template
$eventTemplatePath = "$basePath/src/shared/infrastructure/templates/event-detail.template.ts"
$eventTemplateContent = @'
// src/shared/infrastructure/templates/event-detail.template.ts
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
    return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '';
  };

  // Format event data
  const event = data.event || {};
  const location = event.location || {};
  const contracts = data.contracts || [];

  // Create contracts table if available
  const contractsTable = {
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto'],
      body: [
        [
          { text: 'Contrato', style: 'tableHeader' },
          { text: 'Cliente', style: 'tableHeader' },
          { text: 'Itens', style: 'tableHeader' },
          { text: 'Status', style: 'tableHeader' }
        ],
        ...contracts.map(contract => [
          contract.contractNumber,
          contract.customer?.name || 'N/A',
          contract.items?.length || 0,
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
          text: 'DETALHES DO EVENTO',
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
        text: `Data de Emissão: ${formatDate(new Date()).split(' ')[0]}`,
        alignment: 'right',
        margin: [0, 0, 0, 20]
      },
      { text: 'INFORMAÇÕES DO EVENTO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Nome: ', bold: true },
              event.name || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Categoria: ', bold: true },
              event.category || 'N/A'
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
              { text: 'Data: ', bold: true },
              event.date ? formatDate(event.date) : 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Capacidade: ', bold: true },
              event.capacity ? `${event.capacity} pessoas` : 'N/A'
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
              { text: 'Organizador: ', bold: true },
              event.organizer || 'N/A'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 5]
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Descrição: ', bold: true },
              event.description || 'Nenhuma descrição disponível'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 20]
      },
      { text: 'LOCAL DO EVENTO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Nome: ', bold: true },
              location.name || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Tipo: ', bold: true },
              location.type || 'N/A'
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
              { text: 'Endereço: ', bold: true },
              location.address || 'N/A'
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
              location.city || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Estado: ', bold: true },
              location.state || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'CEP: ', bold: true },
              location.zipCode || 'N/A'
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
              { text: 'Capacidade: ', bold: true },
              location.capacity ? `${location.capacity} pessoas` : 'N/A'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 5]
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Descrição: ', bold: true },
              location.description || 'Nenhuma descrição disponível'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 20]
      },
      { text: 'CONTRATOS ASSOCIADOS', style: 'subheader' },
      contracts.length > 0 
        ? contractsTable 
        : { text: 'Nenhum contrato associado a este evento.', style: 'normal', margin: [0, 0, 0, 15] }
    ],
    styles: defaultStyles
  };
}
'@

Create-File $eventTemplatePath $eventTemplateContent

# 3. Create Location PDF Template
$locationTemplatePath = "$basePath/src/shared/infrastructure/templates/location-detail.template.ts"
$locationTemplateContent = @'
// src/shared/infrastructure/templates/location-detail.template.ts
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

  // Format location data
  const location = data.location || {};
  const events = data.events || [];

  // Create events table if available
  const eventsTable = {
    table: {
      headerRows: 1,
      widths: ['*', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: 'Nome do Evento', style: 'tableHeader' },
          { text: 'Categoria', style: 'tableHeader' },
          { text: 'Data', style: 'tableHeader' },
          { text: 'Organizador', style: 'tableHeader' }
        ],
        ...events.map(event => [
          event.name || 'N/A',
          event.category || 'N/A',
          formatDate(event.date),
          event.organizer || 'N/A'
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
          text: 'DETALHES DO LOCAL',
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
      { text: 'INFORMAÇÕES DO LOCAL', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Nome: ', bold: true },
              location.name || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Tipo: ', bold: true },
              location.type || 'N/A'
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
              { text: 'Capacidade: ', bold: true },
              location.capacity ? `${location.capacity} pessoas` : 'N/A'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 5]
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Descrição: ', bold: true },
              location.description || 'Nenhuma descrição disponível'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 15]
      },
      { text: 'ENDEREÇO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Logradouro: ', bold: true },
              location.address || 'N/A'
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
              location.city || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'Estado: ', bold: true },
              location.state || 'N/A'
            ]
          },
          {
            width: '*',
            text: [
              { text: 'CEP: ', bold: true },
              location.zipCode || 'N/A'
            ]
          }
        ],
        style: 'normal',
        margin: [0, 0, 0, 20]
      },
      { text: 'EVENTOS REALIZADOS NESTE LOCAL', style: 'subheader' },
      events.length > 0 
        ? eventsTable 
        : { text: 'Nenhum evento registrado para este local.', style: 'normal', margin: [0, 0, 0, 15] },
      
      // Add a table of upcoming events if provided
      data.upcomingEvents && data.upcomingEvents.length > 0 ? 
        [
          { text: 'PRÓXIMOS EVENTOS', style: 'subheader' },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto'],
              body: [
                [
                  { text: 'Nome do Evento', style: 'tableHeader' },
                  { text: 'Data', style: 'tableHeader' },
                  { text: 'Categoria', style: 'tableHeader' }
                ],
                ...data.upcomingEvents.map(event => [
                  event.name || 'N/A',
                  formatDate(event.date),
                  event.category || 'N/A'
                ])
              ]
            },
            margin: [0, 5, 0, 15]
          }
        ] : []
    ],
    styles: defaultStyles
  };
}
'@

Create-File $locationTemplatePath $locationTemplateContent

# 4. Create Event PDF Factory
$eventPdfFactoryPath = "$basePath/src/events/infrastructure/factories/event-pdf.factory.ts"
$eventPdfFactoryContent = @'
// src/events/infrastructure/factories/event-pdf.factory.ts
import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import { Location } from '../../domain/entities/location.entity';

@Injectable()
export class EventPDFFactory {
  /**
   * Prepares data for event PDF generation
   */
  public prepareEventData(event: Event, contracts: any[] = []): any {
    return {
      event,
      contracts,
      // Add any additional transformations or data needed for PDF
    };
  }

  /**
   * Prepares data for location PDF generation
   */
  public prepareLocationData(location: Location, events: Event[] = [], upcomingEvents: Event[] = []): any {
    return {
      location,
      events,
      upcomingEvents,
      // Add any additional transformations or data needed for PDF
    };
  }

  /**
   * Prepares data for events calendar PDF generation
   */
  public prepareEventsCalendarData(events: Event[], startDate: Date, endDate: Date): any {
    return {
      events,
      period: {
        startDate,
        endDate
      },
      title: 'Calendário de Eventos',
      subtitle: `Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      generatedBy: 'Sistema',
      content: [
        {
          title: 'Eventos Programados',
          table: {
            headers: ['Nome', 'Categoria', 'Data', 'Local', 'Organizador'],
            rows: events.map(event => [
              event.name,
              event.category,
              new Date(event.date).toLocaleDateString() + ' ' + new Date(event.date).toLocaleTimeString(),
              event.location?.name || 'N/A',
              event.organizer || 'N/A'
            ])
          }
        }
      ]
    };
  }
}
'@

Create-Directory (Split-Path $eventPdfFactoryPath)
Create-File $eventPdfFactoryPath $eventPdfFactoryContent

# 5. Create Employee PDF Factory
$employeePdfFactoryPath = "$basePath/src/employees/infrastructure/factories/employee-pdf.factory.ts"
$employeePdfFactoryContent = @'
// src/employees/infrastructure/factories/employee-pdf.factory.ts
import { Injectable } from '@nestjs/common';
import { Employee } from '../../domain/entities/employee.entity';

@Injectable()
export class EmployeePDFFactory {
  /**
   * Prepares data for employee profile PDF generation
   */
  public prepareProfileData(employee: Employee, contracts: any[] = [], performanceData: any[] = []): any {
    return {
      employee,
      contracts,
      performanceData,
      // Add any additional transformations or data needed for PDF
    };
  }

  /**
   * Prepares data for employee report PDF generation
   */
  public prepareReportData(employees: Employee[], startDate: Date, endDate: Date, performanceData: any[]): any {
    return {
      title: 'Relatório de Desempenho de Funcionários',
      subtitle: `Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      generatedBy: 'Sistema',
      content: [
        {
          title: 'Desempenho por Funcionário',
          table: {
            headers: ['Nome', 'Cargo', 'Contratos', 'Valor Total', 'Taxa de Desempenho'],
            rows: employees.map(employee => {
              const employeePerformance = performanceData.find(p => p.employeeId === employee.id) || { 
                contractCount: 0, 
                totalValue: 0, 
                performanceRate: 0 
              };
              
              return [
                employee.name,
                employee.position,
                employeePerformance.contractCount.toString(),
                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(employeePerformance.totalValue),
                `${employeePerformance.performanceRate.toFixed(2)}%`
              ];
            })
          }
        }
      ]
    };
  }
}
'@

Create-Directory (Split-Path $employeePdfFactoryPath)
Create-File $employeePdfFactoryPath $employeePdfFactoryContent

# 6. Register templates in PDFService
$pdfServicePath = "$basePath/src/shared/infrastructure/services/pdf.service.ts"

# We need to check if the file exists first
if (Test-Path $pdfServicePath) {
    # Read the file content
    $pdfServiceContent = Get-Content -Path $pdfServicePath -Raw

    # Check if we need to add the new templates
    if ($pdfServiceContent -notmatch 'employee-profile') {
        # Update the loadTemplates method to include the new templates
        $updatedPdfServiceContent = $pdfServiceContent -replace 
        'private loadTemplates\(\): void \{([^}]*)', @'
private loadTemplates(): void {$1
    this.registerTemplate('employee-profile', require('../templates/employee-profile.template').default);
    this.registerTemplate('event-detail', require('../templates/event-detail.template').default);
    this.registerTemplate('location-detail', require('../templates/location-detail.template').default);
'@

        # Write back to the file
        if ($pdfServiceContent -ne $updatedPdfServiceContent) {
            Set-Content -Path $pdfServicePath -Value $updatedPdfServiceContent
            Write-Success "Updated PDF Service to include new templates"
        }
    } else {
        Write-Warning "Templates already registered in PDF Service"
    }
} else {
    Write-Error "PDF Service file not found. Run generate-pdf-services.ps1 first."
}

# 7. Create Event PDF Controller
$eventPdfControllerPath = "$basePath/src/events/presentation/controllers/event-pdf.controller.ts"
$eventPdfControllerContent = @'
// src/events/presentation/controllers/event-pdf.controller.ts
import { Controller, Get, Param, Query, Res, Inject, UseGuards, NotFoundException, ParseDatePipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { EventService } from '../../application/services/event.service';
import { LocationService } from '../../application/services/location.service';
import { EventPDFFactory } from '../../infrastructure/factories/event-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';

@ApiTags('Eventos e Locais PDF')
@Controller('events/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventPDFController {
  constructor(
    private readonly eventService: EventService,
    private readonly locationService: LocationService,
    private readonly eventPdfFactory: EventPDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get('event/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar PDF com detalhes do evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({
    status: 200,
    description: 'PDF do evento gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async generateEventPDF(@Param('id') id: string, @Res() res: Response) {
    // Buscar evento
    const event = await this.eventService.findById(id);
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    // Aqui idealmente buscaria os contratos associados ao evento
    // Para simplificar, enviamos um array vazio
    const contracts = [];

    // Preparar dados para o PDF
    const pdfData = this.eventPdfFactory.prepareEventData(event, contracts);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('event-detail', pdfData);
    
    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=evento-${event.id}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }

  @Get('location/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar PDF com detalhes do local' })
  @ApiParam({ name: 'id', description: 'ID do local' })
  @ApiResponse({
    status: 200,
    description: 'PDF do local gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Local não encontrado' })
  async generateLocationPDF(@Param('id') id: string, @Res() res: Response) {
    // Buscar local
    const location = await this.locationService.findById(id);
    if (!location) {
      throw new NotFoundException(`Local com ID ${id} não encontrado`);
    }

    // Buscar eventos associados a este local
    const events = await this.eventService.findByLocationId(id);
    
    // Filtrar para eventos futuros
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.date) > now);

    // Preparar dados para o PDF
    const pdfData = this.eventPdfFactory.prepareLocationData(location, events, upcomingEvents);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('location-detail', pdfData);
    
    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=local-${location.id}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }

  @Get('calendar')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Gerar calendário de eventos em PDF' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'Data final (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Calendário de eventos gerado com sucesso',
  })
  async generateEventsCalendar(
    @Query('startDate') startDateStr: string,
    @Query('endDate') endDateStr: string,
    @Res() res: Response,
  ) {
    // Converter strings para datas
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Buscar eventos no intervalo de datas
    const events = await this.eventService.findByDateRange(startDate, endDate);

    // Preparar dados para o PDF
    const pdfData = this.eventPdfFactory.prepareEventsCalendarData(events, startDate, endDate);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('report', pdfData);
    
    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=calendario-eventos.pdf',
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
'@

Create-Directory (Split-Path $eventPdfControllerPath)
Create-File $eventPdfControllerPath $eventPdfControllerContent

# 8. Create Employee PDF Controller
$employeePdfControllerPath = "$basePath/src/employees/presentation/controllers/employee-pdf.controller.ts"
$employeePdfControllerContent = @'
// src/employees/presentation/controllers/employee-pdf.controller.ts
import { Controller, Get, Param, Query, Res, Inject, UseGuards, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { Role } from '../../../auth/domain/entities/user.entity';
import { EmployeeService } from '../../application/services/employee.service';
import { EmployeePDFFactory } from '../../infrastructure/factories/employee-pdf.factory';
import { IPDFService } from '../../../shared/domain/services/pdf.service.interface';

@ApiTags('Funcionários PDF')
@Controller('employees/pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeePDFController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly employeePdfFactory: EmployeePDFFactory,
    @Inject('IPDFService')
    private readonly pdfService: IPDFService,
  ) {}

  @Get('profile/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Gerar perfil do funcionário em PDF' })
  @ApiParam({ name: 'id', description: 'ID do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do funcionário gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async generateEmployeeProfile(@Param('id') id: string, @Res() res: Response) {
    // Buscar funcionário
    const employee = await this.employeeService.findById(id);
    if (!employee) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado`);
    }

    // Aqui idealmente buscaria o histórico de contratos e dados de desempenho
    // Para simplificar, enviamos arrays vazios
    const contracts = [];
    const performanceData = [];

    // Preparar dados para o PDF
    const pdfData = this.employeePdfFactory.prepareProfileData(employee, contracts, performanceData);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('employee-profile', pdfData);
    
    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=funcionario-${employee.cpf}.pdf`,
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }

  @Get('report')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Gerar relatório de desempenho dos funcionários' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'Data final (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Relatório de funcionários gerado com sucesso',
  })
  async generateEmployeeReport(
    @Query('startDate') startDateStr: string,
    @Query('endDate') endDateStr: string,
    @Res() res: Response,
  ) {
    // Converter strings para datas
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Buscar todos os funcionários
    const employees = await this.employeeService.findAll();
    
    // Aqui idealmente buscaria dados de desempenho para o período
    // Para simplificar, criamos dados fictícios
    const performanceData = employees.map(employee => ({
      employeeId: employee.id,
      contractCount: Math.floor(Math.random() * 20),
      totalValue: Math.random() * 10000,
      performanceRate: Math.random() * 100
    }));

    // Preparar dados para o PDF
    const pdfData = this.employeePdfFactory.prepareReportData(employees, startDate, endDate, performanceData);

    // Gerar PDF
    const buffer = await this.pdfService.generatePDF('report', pdfData);
    
    // Definir headers e enviar resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=relatorio-funcionarios.pdf',
      'Content-Length': buffer.length,
    });

    // Enviar buffer como resposta
    res.end(buffer);
  }
}
'@

Create-Directory (Split-Path $employeePdfControllerPath)
Create-File $employeePdfControllerPath $employeePdfControllerContent

# 9. Update Event Module to include PDF functionality
$eventsModulePath = "$basePath/src/events/events.module.ts"

# Check if the file exists
if (Test-Path $eventsModulePath) {
    # Read the file content
    $eventsModuleContent = Get-Content -Path $eventsModulePath -Raw

    # Update Events Module to include PDFModule and the PDF controller
    $updatedEventsModuleContent = $eventsModuleContent -replace 
    'import { Module } from (.+?);', @'
import { Module } from $1;
import { PDFModule } from '../shared/infrastructure/pdf/pdf.module';
'@ -replace 
    'controllers: \[([^\]]+)\],', @'
controllers: [$1, EventPDFController],
'@ -replace 
    'imports: \[([^\]]+)\],', @'
imports: [$1, PDFModule],
'@ -replace 
    'providers: \[', @'
providers: [
    EventPDFFactory,
'@ -replace 
    'PrismaModule', @'
PrismaModule
import { EventPDFController } from './presentation/controllers/event-pdf.controller';
import { EventPDFFactory } from './infrastructure/factories/event-pdf.factory';
'@

    # Write the updated content back to the file
    if ($eventsModuleContent -ne $updatedEventsModuleContent) {
        Set-Content -Path $eventsModulePath -Value $updatedEventsModuleContent
        Write-Success "Updated Events Module with PDF support"
    } else {
        Write-Warning "No changes needed for Events Module"
    }
} else {
    Write-Error "Events Module file not found"
}

# 10. Update Employee Module to include PDF functionality
$employeesModulePath = "$basePath/src/employees/employees.module.ts"

# Check if the file exists
if (Test-Path $employeesModulePath) {
    # Read the file content
    $employeesModuleContent = Get-Content -Path $employeesModulePath -Raw

    # Update Employees Module to include PDFModule and the PDF controller
    $updatedEmployeesModuleContent = $employeesModuleContent -replace 
    'import { Module } from (.+?);', @'
import { Module } from $1;
import { PDFModule } from '../shared/infrastructure/pdf/pdf.module';
'@ -replace 
    'controllers: \[([^\]]+)\],', @'
controllers: [$1, EmployeePDFController],
'@ -replace 
    'imports: \[([^\]]+)\],', @'
imports: [$1, PDFModule],
'@ -replace 
    'providers: \[', @'
providers: [
    EmployeePDFFactory,
'@ -replace 
    'PrismaModule', @'
PrismaModule
import { EmployeePDFController } from './presentation/controllers/employee-pdf.controller';
import { EmployeePDFFactory } from './infrastructure/factories/employee-pdf.factory';
'@

    # Write the updated content back to the file
    if ($employeesModuleContent -ne $updatedEmployeesModuleContent) {
        Set-Content -Path $employeesModulePath -Value $updatedEmployeesModuleContent
        Write-Success "Updated Employees Module with PDF support"
    } else {
        Write-Warning "No changes needed for Employees Module"
    }
} else {
    Write-Error "Employees Module file not found"
}

# Update the PDF service to register the new templates
$pdfServicePath = "$basePath/src/shared/infrastructure/services/pdf.service.ts"

Write-Host "`nAdditional PDF service files generation completed successfully!"
Write-Host "The following functionality has been added:"
Write-Host "1. PDF templates for employees, events, and locations"
Write-Host "2. PDF controllers for employees and events/locations"
Write-Host "3. PDF factories for data preparation"
Write-Host "`nAvailable endpoints:"
Write-Host "- GET /api/employees/pdf/profile/:id - Generate employee profile PDF"
Write-Host "- GET /api/employees/pdf/report - Generate employee performance report PDF"
Write-Host "- GET /api/events/pdf/event/:id - Generate event details PDF"
Write-Host "- GET /api/events/pdf/location/:id - Generate location details PDF"
Write-Host "- GET /api/events/pdf/calendar - Generate events calendar PDF"
