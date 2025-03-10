// src/shared/infrastructure/templates/report.template.ts
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

  // Format report data
  const reportInfo = {
    title: data.title || 'Relatório',
    subtitle: data.subtitle || '',
    date: formatDate(new Date()),
    period: data.period || 'Não especificado',
    generatedBy: data.generatedBy || 'Sistema',
    content: data.content || [],
  };

  // Build dynamic content based on report data
  const reportContent = [];

  // Add each content section from the data
  reportInfo.content.forEach((section) => {
    reportContent.push({ text: section.title, style: 'subheader' });

    if (section.description) {
      reportContent.push({ text: section.description, style: 'normal', margin: [0, 0, 0, 10] });
    }

    // Add table if available
    if (section.table && section.table.headers && section.table.rows) {
      const tableHeaders = section.table.headers.map((header) => ({
        text: header,
        style: 'tableHeader',
      }));

      const tableBody = [tableHeaders];
      section.table.rows.forEach((row) => {
        tableBody.push(row);
      });

      reportContent.push({
        table: {
          headerRows: 1,
          widths: Array(section.table.headers.length).fill('*'),
          body: tableBody,
        },
        margin: [0, 5, 0, 15],
      });
    }

    // Add chart placeholder if available
    if (section.chart) {
      reportContent.push({
        text: `[GRÁFICO: ${section.chart.title || 'Gráfico'}]`,
        style: 'normal',
        alignment: 'center',
        margin: [0, 10, 0, 10],
      });

      // Add chart description if available
      if (section.chart.description) {
        reportContent.push({
          text: section.chart.description,
          style: 'normal',
          margin: [0, 0, 0, 10],
          italics: true,
        });
      }
    }

    // Add summary if available
    if (section.summary) {
      reportContent.push({ text: 'Resumo', style: 'sectionTitle' });
      section.summary.forEach((item) => {
        reportContent.push({
          columns: [
            {
              width: '*',
              text: [{ text: `${item.label}: `, bold: true }, item.value],
            },
          ],
          style: 'normal',
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
      reportInfo.subtitle
        ? {
            text: reportInfo.subtitle,
            style: 'subheader',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          }
        : {},
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Data do Relatório: ', bold: true }, reportInfo.date],
          },
          {
            width: '*',
            text: [{ text: 'Período: ', bold: true }, reportInfo.period],
            alignment: 'right',
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 5],
      },
      {
        text: [{ text: 'Gerado por: ', bold: true }, reportInfo.generatedBy],
        style: 'normal',
        margin: [0, 0, 0, 20],
      },
      ...reportContent,
    ],
    styles: defaultStyles,
  };
}
