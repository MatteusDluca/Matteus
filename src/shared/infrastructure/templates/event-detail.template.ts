// src/shared/infrastructure/templates/event-detail.template.ts
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
          { text: 'Status', style: 'tableHeader' },
        ],
        ...contracts.map((contract) => [
          contract.contractNumber,
          contract.customer?.name || 'N/A',
          contract.items?.length || 0,
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
          text: 'DETALHES DO EVENTO',
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
        text: `Data de Emissão: ${formatDate(new Date()).split(' ')[0]}`,
        alignment: 'right',
        margin: [0, 0, 0, 20],
      },
      { text: 'INFORMAÇÕES DO EVENTO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Nome: ', bold: true }, event.name || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'Categoria: ', bold: true }, event.category || 'N/A'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Data: ', bold: true }, event.date ? formatDate(event.date) : 'N/A'],
          },
          {
            width: '*',
            text: [
              { text: 'Capacidade: ', bold: true },
              event.capacity ? `${event.capacity} pessoas` : 'N/A',
            ],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Organizador: ', bold: true }, event.organizer || 'N/A'],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 5],
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Descrição: ', bold: true },
              event.description || 'Nenhuma descrição disponível',
            ],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 20],
      },
      { text: 'LOCAL DO EVENTO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Nome: ', bold: true }, location.name || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'Tipo: ', bold: true }, location.type || 'N/A'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Endereço: ', bold: true }, location.address || 'N/A'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Cidade: ', bold: true }, location.city || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'Estado: ', bold: true }, location.state || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'CEP: ', bold: true }, location.zipCode || 'N/A'],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Capacidade: ', bold: true },
              location.capacity ? `${location.capacity} pessoas` : 'N/A',
            ],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 5],
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Descrição: ', bold: true },
              location.description || 'Nenhuma descrição disponível',
            ],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 20],
      },
      { text: 'CONTRATOS ASSOCIADOS', style: 'subheader' },
      contracts.length > 0
        ? contractsTable
        : {
            text: 'Nenhum contrato associado a este evento.',
            style: 'normal',
            margin: [0, 0, 0, 15],
          },
    ],
    styles: defaultStyles,
  };
}
