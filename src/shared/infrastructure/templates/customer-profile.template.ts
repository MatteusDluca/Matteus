// src/shared/infrastructure/templates/customer-profile.template.ts
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
        { text: `${value} cm` },
      ]);
    }

    measurementsSection = [
      { text: 'MEDIDAS CORPORAIS', style: 'subheader' },
      {
        table: {
          widths: ['*', 'auto'],
          body: measurementRows,
        },
        margin: [0, 5, 0, 15],
      },
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
          { text: 'Status', style: 'tableHeader' },
        ],
        ...contracts.map((contract) => [
          contract.contractNumber,
          contract.event?.name || 'N/A',
          formatDate(contract.pickupDate),
          formatDate(contract.returnDate),
          contract.status,
        ]),
      ],
    },
    margin: [0, 5, 0, 15],
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
      { text: 'DADOS PESSOAIS', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Nome: ', bold: true }, customer.name || 'N/A'],
          },
          {
            width: '*',
            text: [
              { text: 'Documento: ', bold: true },
              `${customer.documentType || ''} ${customer.documentNumber || 'N/A'}`,
            ],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Data de Nascimento: ', bold: true },
              customer.birthDate ? formatDate(customer.birthDate) : 'N/A',
            ],
          },
          {
            width: '*',
            text: [{ text: 'Pontos de Fidelidade: ', bold: true }, customer.loyaltyPoints || '0'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Telefone: ', bold: true }, customer.phone || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'Email: ', bold: true }, customer.email || 'N/A'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Instagram: ', bold: true }, customer.instagram || 'N/A'],
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
            text: [{ text: 'Logradouro: ', bold: true }, customer.address || 'N/A'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Cidade: ', bold: true }, customer.city || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'Estado: ', bold: true }, customer.state || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'CEP: ', bold: true }, customer.zipCode || 'N/A'],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 10],
      },
      ...measurementsSection,
      { text: 'PREFERÊNCIAS', style: 'subheader' },
      {
        text: customer.preferences || 'Nenhuma preferência registrada',
        style: 'normal',
        margin: [0, 0, 0, 10],
      },
      { text: 'OBSERVAÇÕES', style: 'subheader' },
      {
        text: customer.observations || 'Nenhuma observação registrada',
        style: 'normal',
        margin: [0, 0, 0, 10],
      },
      { text: 'HISTÓRICO DE ALUGUÉIS', style: 'subheader' },
      contracts.length > 0
        ? contractsTable
        : {
            text: 'Cliente não possui histórico de aluguéis.',
            style: 'normal',
            margin: [0, 0, 0, 10],
          },
    ],
    styles: defaultStyles,
  };
}
