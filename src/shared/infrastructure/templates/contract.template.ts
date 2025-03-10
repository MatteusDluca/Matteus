// src/shared/infrastructure/templates/contract.template.ts
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
    totalAmount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      data.totalAmount,
    ),
    depositAmount: data.depositAmount
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
          data.depositAmount,
        )
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
          { text: 'Subtotal', style: 'tableHeader' },
        ],
        ...formattedContract.items.map((item) => [
          item.product?.name || 'Produto não disponível',
          item.quantity,
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            item.unitPrice,
          ),
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            item.subtotal,
          ),
        ]),
      ],
    },
    margin: [0, 5, 0, 15],
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
          { text: 'Data', style: 'tableHeader' },
        ],
        ...formattedContract.payments.map((payment) => [
          payment.method,
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            payment.amount,
          ),
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
          text: 'CONTRATO DE ALUGUEL',
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
            text: [{ text: 'Contrato N°: ', bold: true }, formattedContract.contractNumber],
          },
          {
            width: '*',
            text: [{ text: 'Status: ', bold: true }, formattedContract.status],
            alignment: 'right',
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 10],
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Data de Emissão: ', bold: true }, formattedContract.createdAt],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 20],
      },
      { text: 'INFORMAÇÕES DO CLIENTE', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Nome: ', bold: true }, formattedContract.customer?.name || ''],
          },
          {
            width: '*',
            text: [
              { text: 'Documento: ', bold: true },
              `${formattedContract.customer?.documentType || ''} ${
                formattedContract.customer?.documentNumber || ''
              }`,
            ],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Telefone: ', bold: true }, formattedContract.customer?.phone || ''],
          },
          {
            width: '*',
            text: [{ text: 'Email: ', bold: true }, formattedContract.customer?.email || ''],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 10],
      },
      { text: 'DATAS IMPORTANTES', style: 'subheader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Data da Prova: ', bold: true }, formattedContract.fittingDate],
          },
        ],
        style: 'normal',
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Data de Retirada: ', bold: true }, formattedContract.pickupDate],
          },
          {
            width: '*',
            text: [{ text: 'Data de Devolução: ', bold: true }, formattedContract.returnDate],
          },
        ],
        style: 'normal',
        margin: [0, 0, 0, 10],
      },
      formattedContract.event
        ? [
            { text: 'EVENTO', style: 'subheader' },
            {
              columns: [
                {
                  width: '*',
                  text: [
                    { text: 'Nome do Evento: ', bold: true },
                    formattedContract.event?.name || '',
                  ],
                },
                {
                  width: '*',
                  text: [
                    { text: 'Data do Evento: ', bold: true },
                    formattedContract.event?.date ? formatDate(formattedContract.event.date) : '',
                  ],
                },
              ],
              style: 'normal',
              margin: [0, 0, 0, 10],
            },
          ]
        : [],
      { text: 'ITENS ALUGADOS', style: 'subheader' },
      itemsTable,
      { text: 'PAGAMENTOS', style: 'subheader' },
      paymentsTable,
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Valor Total: ', bold: true }, formattedContract.totalAmount],
          },
          {
            width: '*',
            text: [{ text: 'Depósito/Caução: ', bold: true }, formattedContract.depositAmount],
            alignment: 'right',
          },
        ],
        style: 'normal',
        margin: [0, 10, 0, 20],
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
            margin: [0, 50, 0, 0],
          },
          {
            width: '*',
            text: '___________________________',
            alignment: 'center',
            margin: [0, 50, 0, 0],
          },
        ],
      },
      {
        columns: [
          {
            width: '*',
            text: 'Assinatura do Cliente',
            alignment: 'center',
          },
          {
            width: '*',
            text: 'Assinatura da Empresa',
            alignment: 'center',
          },
        ],
        margin: [0, 5, 0, 0],
      },
      {
        columns: [
          {
            width: '*',
            text: formattedContract.customer?.name || '',
            alignment: 'center',
          },
          {
            width: '*',
            text: formattedContract.employee?.name || '',
            alignment: 'center',
          },
        ],
        margin: [0, 5, 0, 0],
      },
    ],
    styles: defaultStyles,
  };
}
