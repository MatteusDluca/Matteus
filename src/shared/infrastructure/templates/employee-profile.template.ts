// src/shared/infrastructure/templates/employee-profile.template.ts
import { format } from 'date-fns';

const defaultStyles = {
  header: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10],
  },
  subheader: {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5],
  },
  sectionTitle: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5],
  },
  normal: {
    fontSize: 12,
    margin: [0, 5, 0, 2],
  },
  tableHeader: {
    bold: true,
    fontSize: 13,
    color: 'black',
    fillColor: '#eeeeee',
  },
};

export default function (data: any) {
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
          { text: 'Valor', style: 'tableHeader' },
        ],
        ...contracts.map((contract) => [
          contract.contractNumber,
          contract.customer?.name || 'N/A',
          formatDate(contract.createdAt),
          formatCurrency(contract.totalAmount),
        ]),
      ],
    },
    margin: [0, 5, 0, 15],
  };

  // Create performance table if available
  const performanceTable =
    performanceData.length > 0
      ? {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto'],
            body: [
              [
                { text: 'Período', style: 'tableHeader' },
                { text: 'Contratos', style: 'tableHeader' },
                { text: 'Desempenho', style: 'tableHeader' },
              ],
              ...performanceData.map((item) => [
                item.period,
                item.contractCount.toString(),
                `${item.performanceRate.toFixed(2)}%`,
              ]),
            ],
          },
          margin: [0, 5, 0, 15],
        }
      : null;

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
            alignment: 'center',
          },
          margin: [0, 20, 0, 0],
        },
      ],
    },
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          { text: `${currentPage.toString()} de ${pageCount.toString()}`, alignment: 'center' },
        ],
        margin: [0, 0, 0, 20],
      };
    },
    content: [
      {
        text: `Data de Emissão: ${formatDate(new Date())}`,
        alignment: 'right',
        margin: [0, 0, 0, 20],
      },
      { text: 'INFORMAÇÕES PESSOAIS', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Nome: ', bold: true }, employee.name || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'CPF: ', bold: true }, employee.cpf || 'N/A'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Telefone: ', bold: true }, employee.phone || 'N/A'],
          },
          {
            width: '*',
            text: [
              { text: 'Data de Contratação: ', bold: true },
              employee.hireDate ? formatDate(employee.hireDate) : 'N/A',
            ],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 10],
      },
      { text: 'INFORMAÇÕES PROFISSIONAIS', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Cargo: ', bold: true }, employee.position || 'N/A'],
          },
          {
            width: '*',
            text: [
              { text: 'Salário: ', bold: true },
              employee.salary ? formatCurrency(employee.salary) : 'N/A',
            ],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Horário de Trabalho: ', bold: true }, employee.workingHours || 'N/A'],
          },
          {
            width: '*',
            text: [
              { text: 'Taxa de Desempenho: ', bold: true },
              employee.performanceRate ? `${employee.performanceRate}%` : 'N/A',
            ],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 10],
      },
      { text: 'ENDEREÇO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Logradouro: ', bold: true }, employee.address || 'N/A'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Cidade: ', bold: true }, employee.city || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'Estado: ', bold: true }, employee.state || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'CEP: ', bold: true }, employee.zipCode || 'N/A'],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 20],
      },
      { text: 'HISTÓRICO DE VENDAS', style: 'subheader' },
      contracts.length > 0
        ? contractsTable
        : {
            text: 'Nenhum histórico de vendas disponível.',
            style: 'normal',
            margin: [0, 0, 0, 15],
          },

      // Only add performance section if data is available
      performanceData.length > 0
        ? [{ text: 'DESEMPENHO', style: 'subheader' }, performanceTable]
        : [],
    ],
    styles: defaultStyles,
  };
}
