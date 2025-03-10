// src/shared/infrastructure/templates/location-detail.template.ts
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
          { text: 'Organizador', style: 'tableHeader' },
        ],
        ...events.map((event) => [
          event.name || 'N/A',
          event.category || 'N/A',
          formatDate(event.date),
          event.organizer || 'N/A',
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
          text: 'DETALHES DO LOCAL',
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
      { text: 'INFORMAÇÕES DO LOCAL', style: 'subheader' },
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
        margin: [0, 0, 0, 15],
      },
      { text: 'ENDEREÇO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Logradouro: ', bold: true }, location.address || 'N/A'],
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
        margin: [0, 0, 0, 20],
      },
      { text: 'EVENTOS REALIZADOS NESTE LOCAL', style: 'subheader' },
      events.length > 0
        ? eventsTable
        : {
            text: 'Nenhum evento registrado para este local.',
            style: 'normal',
            margin: [0, 0, 0, 15],
          },

      // Add a table of upcoming events if provided
      data.upcomingEvents && data.upcomingEvents.length > 0
        ? [
            { text: 'PRÓXIMOS EVENTOS', style: 'subheader' },
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto'],
                body: [
                  [
                    { text: 'Nome do Evento', style: 'tableHeader' },
                    { text: 'Data', style: 'tableHeader' },
                    { text: 'Categoria', style: 'tableHeader' },
                  ],
                  ...data.upcomingEvents.map((event) => [
                    event.name || 'N/A',
                    formatDate(event.date),
                    event.category || 'N/A',
                  ]),
                ],
              },
              margin: [0, 5, 0, 15],
            },
          ]
        : [],
    ],
    styles: defaultStyles,
  };
}
