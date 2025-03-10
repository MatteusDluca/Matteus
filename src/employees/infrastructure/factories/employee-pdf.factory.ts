// src/employees/infrastructure/factories/employee-pdf.factory.ts
import { Injectable } from '@nestjs/common';
import { Employee } from '../../domain/entities/employee.entity';

@Injectable()
export class EmployeePDFFactory {
  /**
   * Prepares data for employee profile PDF generation
   */
  public prepareProfileData(
    employee: Employee,
    contracts: any[] = [],
    performanceData: any[] = [],
  ): any {
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
  public prepareReportData(
    employees: Employee[],
    startDate: Date,
    endDate: Date,
    performanceData: any[],
  ): any {
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
            rows: employees.map((employee) => {
              const employeePerformance = performanceData.find(
                (p) => p.employeeId === employee.id,
              ) || {
                contractCount: 0,
                totalValue: 0,
                performanceRate: 0,
              };

              return [
                employee.name,
                employee.position,
                employeePerformance.contractCount.toString(),
                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  employeePerformance.totalValue,
                ),
                `${employeePerformance.performanceRate.toFixed(2)}%`,
              ];
            }),
          },
        },
      ],
    };
  }
}
