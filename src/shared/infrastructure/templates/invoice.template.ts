// src/shared/infrastructure/templates/invoice.template.ts
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
          { text: 'Data', style: 'tableHeader' },
        ],
        ...payments.map((payment) => [
          payment.reference || '-',
          payment.method,
          formatCurrency(payment.amount),
          payment.status,
          payment.paidAt ? formatDate(payment.paidAt) : 'Pendente',
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
          text: 'RECIBO DE PAGAMENTO',
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
        columns: [
          {
            width: '*',
            stack: [
              { text: 'DADOS DA EMPRESA', style: 'subheader' },
              { text: 'Nome Empresa de Aluguel de Roupas Ltda', bold: true },
              { text: 'CNPJ: 00.000.000/0001-00' },
              { text: 'Endereço: Rua Exemplo, 123 - Cidade' },
              { text: 'Telefone: (11) 1234-5678' },
              { text: 'Email: contato@empresaaluguelroupas.com' },
            ],
          },
          {
            width: '*',
            stack: [
              { text: 'RECIBO N°:', style: 'subheader', alignment: 'right' },
              { text: data.contractNumber || 'N/A', alignment: 'right', bold: true },
              { text: 'Data: ' + formatDate(data.paidAt || new Date()), alignment: 'right' },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },
      { text: 'CLIENTE', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Nome: ', bold: true }, data.customer?.name || 'N/A'],
          },
          {
            width: '*',
            text: [
              { text: 'Documento: ', bold: true },
              `${data.customer?.documentType || ''} ${data.customer?.documentNumber || 'N/A'}`,
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Telefone: ', bold: true }, data.customer?.phone || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'Email: ', bold: true }, data.customer?.email || 'N/A'],
          },
        ],
        margin: [0, 0, 0, 20],
      },
      { text: 'CONTRATO', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Contrato N°: ', bold: true }, data.contractNumber || 'N/A'],
          },
          {
            width: '*',
            text: [{ text: 'Status: ', bold: true }, data.status || 'N/A'],
          },
        ],
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Retirada: ', bold: true }, formatDate(data.pickupDate)],
          },
          {
            width: '*',
            text: [{ text: 'Devolução: ', bold: true }, formatDate(data.returnDate)],
          },
        ],
        margin: [0, 0, 0, 20],
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
                  formatCurrency(data.totalAmount || 0),
                ],
                alignment: 'right',
              },
              {
                text: [
                  { text: 'Total Pago: ', bold: true },
                  formatCurrency(
                    payments
                      .filter((p) => p.status === 'PAID')
                      .reduce((sum, p) => sum + p.amount, 0),
                  ),
                ],
                alignment: 'right',
              },
              {
                text: [
                  { text: 'Saldo Restante: ', bold: true },
                  formatCurrency(
                    data.totalAmount -
                      payments
                        .filter((p) => p.status === 'PAID')
                        .reduce((sum, p) => sum + p.amount, 0),
                  ),
                ],
                alignment: 'right',
                margin: [0, 0, 0, 20],
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: '*',
            text: '___________________________',
            alignment: 'center',
            margin: [0, 40, 0, 0],
          },
        ],
      },
      {
        columns: [
          {
            width: '*',
            text: 'Assinatura do Responsável',
            alignment: 'center',
          },
        ],
        margin: [0, 5, 0, 0],
      },
      {
        columns: [
          {
            width: '*',
            text: data.employee?.name || '',
            alignment: 'center',
          },
        ],
        margin: [0, 5, 0, 0],
      },
    ],
    styles: defaultStyles,
  };
}
