// src/shared/infrastructure/templates/product-catalog.template.ts
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
  categoryHeader: {
    fontSize: 14,
    bold: true,
    color: 'white',
    fillColor: '#4472C4',
    margin: [0, 10, 0, 5],
  },
};

export default function (data: any) {
  const formatDate = (date: string | Date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Group products by category
  const productsByCategory = {};
  const products = data.products || [];

  products.forEach((product) => {
    const categoryId = product.categoryId;
    const categoryName = product.category?.name || 'Sem Categoria';

    if (!productsByCategory[categoryId]) {
      productsByCategory[categoryId] = {
        name: categoryName,
        products: [],
      };
    }

    productsByCategory[categoryId].products.push(product);
  });

  // Define a content array that can hold any valid PDFMake content element
  const documentContent: any[] = [
    {
      text: 'CATÁLOGO DE PRODUTOS',
      style: 'header',
      alignment: 'center',
      margin: [0, 0, 0, 20],
    },
    {
      text: `Data de Emissão: ${formatDate(new Date())}`,
      alignment: 'right',
      margin: [0, 0, 0, 20],
    },
  ];

  // Add category sections
  Object.keys(productsByCategory).forEach((categoryId) => {
    const category = productsByCategory[categoryId];

    documentContent.push({
      text: category.name.toUpperCase(),
      style: 'categoryHeader',
      alignment: 'left',
      margin: [0, 10, 0, 10],
    });

    // Add table for products in this category
    documentContent.push({
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Produto', style: 'tableHeader' },
            { text: 'Código', style: 'tableHeader' },
            { text: 'Tamanho', style: 'tableHeader' },
            { text: 'Cor', style: 'tableHeader' },
            { text: 'Preço', style: 'tableHeader' },
          ],
          ...category.products.map((product) => [
            product.name,
            product.code,
            product.size,
            product.color,
            formatCurrency(product.rentalPrice),
          ]),
        ],
      },
      margin: [0, 0, 0, 20],
    });
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
    content: documentContent,
    styles: defaultStyles,
  };
}
