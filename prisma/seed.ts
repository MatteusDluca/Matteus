/* eslint-disable prettier/prettier */
// prisma/seed.ts
import { PrismaClient, DocumentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeds...');

  // Limpar dados existentes
  await cleanDatabase();

  // Criar usuário administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    },
  });

  console.log('Usuário admin criado:', adminUser.email);

  // Criar usuário gerente
  const managerPassword = await bcrypt.hash('manager123', 10);
  const managerUser = await prisma.user.create({
    data: {
      email: 'gerente@example.com',
      password: managerPassword,
      role: 'MANAGER',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    },
  });

  console.log('Usuário gerente criado:', managerUser.email);

  // Criar usuário funcionário
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employeeUser = await prisma.user.create({
    data: {
      email: 'funcionario@example.com',
      password: employeePassword,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    },
  });

  console.log('Usuário funcionário criado:', employeeUser.email);

  // Criar funcionários
  const admin = await prisma.employee.create({
    data: {
      userId: adminUser.id,
      name: 'Administrador',
      cpf: '12345678900',
      phone: '11999999999',
      address: 'Rua Admin, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      position: 'Administrador',
      salary: 10000,
      hireDate: new Date('2020-01-01'),
      workingHours: '09:00-18:00',
    },
  });

  console.log('Funcionário administrador criado:', admin.name);

  const manager = await prisma.employee.create({
    data: {
      userId: managerUser.id,
      name: 'Gerente',
      cpf: '98765432100',
      phone: '11988888888',
      address: 'Rua Gerente, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      position: 'Gerente',
      salary: 7000,
      hireDate: new Date('2020-01-01'),
      workingHours: '09:00-18:00',
    },
  });

  console.log('Funcionário gerente criado:', manager.name);

  const employee = await prisma.employee.create({
    data: {
      userId: employeeUser.id,
      name: 'Funcionário',
      cpf: '11122233344',
      phone: '11977777777',
      address: 'Rua Funcionário, 789',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      position: 'Atendente',
      salary: 3000,
      hireDate: new Date('2021-01-01'),
      workingHours: '09:00-18:00',
    },
  });

  console.log('Funcionário atendente criado:', employee.name);

  // Criar categorias de produtos
  const categorias = [
    'Vestidos de Gala',
    'Vestidos de Noiva',
    'Ternos e Smokings',
    'Vestidos para Debutantes',
    'Vestidos para Madrinhas',
    'Fantasias',
  ];

  for (const nome of categorias) {
    await prisma.category.create({
      data: {
        name: nome,
        description: `Categoria para ${nome}`,
      },
    });
    console.log('Categoria criada:', nome);
  }

  // Buscar as categorias criadas
  const categoriasDB = await prisma.category.findMany();

  // Criar produtos em cada categoria
  const produtos = [
    {
      name: 'Vestido Longo Azul',
      categoryId:
        categoriasDB.find((c) => c.name === 'Vestidos de Gala')?.id ||
        categoriasDB[0].id,
      code: 'VLA001',
      color: 'Azul',
      size: 'M',
      rentalPrice: 250,
      replacementCost: 1500,
      quantity: 3,
      description: 'Vestido longo azul marinho com detalhes em renda.',
    },
    {
      name: 'Smoking Preto Clássico',
      categoryId:
        categoriasDB.find((c) => c.name === 'Ternos e Smokings')?.id ||
        categoriasDB[0].id,
      code: 'SPC001',
      color: 'Preto',
      size: '42',
      rentalPrice: 300,
      replacementCost: 2000,
      quantity: 5,
      description: 'Smoking preto clássico com lapela cetim.',
    },
    {
      name: 'Vestido de Noiva Princesa',
      categoryId:
        categoriasDB.find((c) => c.name === 'Vestidos de Noiva')?.id ||
        categoriasDB[0].id,
      code: 'VNP001',
      color: 'Branco',
      size: '38',
      rentalPrice: 900,
      replacementCost: 5000,
      quantity: 2,
      description: 'Vestido de noiva estilo princesa com cauda longa.',
    },
    {
      name: 'Vestido Rosa para Debutante',
      categoryId:
        categoriasDB.find((c) => c.name === 'Vestidos para Debutantes')?.id ||
        categoriasDB[0].id,
      code: 'VRD001',
      color: 'Rosa',
      size: '36',
      rentalPrice: 450,
      replacementCost: 2500,
      quantity: 2,
      description: 'Vestido rosa com saia volumosa para debutante.',
    },
  ];

  for (const produto of produtos) {
    await prisma.product.create({
      data: {
        ...produto,
        status: 'AVAILABLE',
      },
    });
    console.log('Produto criado:', produto.name);
  }

  // Criar locais
  const locais = [
    {
      name: 'Buffet Jardins',
      address: 'Rua dos Jardins, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      capacity: 300,
      type: 'Buffet',
      description: 'Buffet para eventos sociais e corporativos.',
    },
    {
      name: 'Espaço Verde',
      address: 'Avenida das Flores, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      capacity: 200,
      type: 'Chácara',
      description: 'Espaço ao ar livre para eventos.',
    },
    {
      name: 'Clube Náutico',
      address: 'Avenida da Praia, 789',
      city: 'Santos',
      state: 'SP',
      zipCode: '11000000',
      capacity: 500,
      type: 'Clube',
      description: 'Clube com vista para o mar.',
    },
  ];

  for (const local of locais) {
    await prisma.location.create({
      data: local,
    });
    console.log('Local criado:', local.name);
  }

  // Criar eventos
  const locaisDB = await prisma.location.findMany();
  const hoje = new Date();
  const eventos = [
    {
      name: 'Casamento Silva e Santos',
      date: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 15, 20, 0),
      category: 'Casamento',
      locationId:
        locaisDB.find((l) => l.name === 'Buffet Jardins')?.id ||
        categoriasDB[0].id,
      capacity: 250,
      organizer: 'Cerimonial Elegance',
      description: 'Casamento formal com cerimônia religiosa.',
    },
    {
      name: 'Formatura Medicina USP',
      date: new Date(hoje.getFullYear(), hoje.getMonth() + 2, 10, 19, 0),
      category: 'Formatura',
      locationId:
        locaisDB.find((l) => l.name === 'Clube Náutico')?.id ||
        categoriasDB[0].id,
      capacity: 400,
      organizer: 'Comissão de Formatura',
      description: 'Formatura da turma de Medicina da USP.',
    },
    {
      name: 'Festa de 15 Anos Laura',
      date: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 20, 21, 0),
      category: 'Debutante',
      locationId:
        locaisDB.find((l) => l.name === 'Espaço Verde')?.id ||
        categoriasDB[0].id,
      capacity: 150,
      organizer: 'Família Oliveira',
      description: 'Festa de 15 anos com temática jardim encantado.',
    },
  ];

  for (const evento of eventos) {
    await prisma.event.create({
      data: evento,
    });
    console.log('Evento criado:', evento.name);
  }

  // Criar clientes de exemplo
  const clientes = [
    {
      name: 'João da Silva',
      documentType: 'CPF' as DocumentType,
      documentNumber: '11122233344',
      birthDate: new Date('1985-05-15'),
      phone: '11999999999',
      email: 'joao.silva@example.com',
      instagram: '@joaosilva',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000000',
      bodyMeasurements: {
        bust: 100,
        waist: 80,
        hips: 100,
        height: 180,
      },
      loyaltyPoints: 0,
      preferences: 'Prefere cores escuras',
      observations: 'Cliente assíduo',
    },
    {
      name: 'Maria Oliveira',
      documentType: 'CPF' as DocumentType,
      documentNumber: '22233344455',
      birthDate: new Date('1990-10-20'),
      phone: '11988888888',
      email: 'maria.oliveira@example.com',
      instagram: '@mariaoliveira',
      address: 'Avenida Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310000',
      bodyMeasurements: {
        bust: 90,
        waist: 70,
        hips: 95,
        height: 165,
      },
      loyaltyPoints: 0,
      preferences: 'Prefere vestidos longos',
      observations: 'Alérgica a tecidos sintéticos',
    },
  ];

  for (const cliente of clientes) {
    await prisma.customer.create({
      data: cliente,
    });
    console.log('Cliente criado:', cliente.name);
  }

  console.log('Seeds concluídos com sucesso!');
}

async function cleanDatabase() {
  // Limpar tabelas na ordem correta (respeitando chaves estrangeiras)
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.contractItem.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.event.deleteMany();
  await prisma.location.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  console.log('Banco de dados limpo com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    // Não retorna uma promise, apenas executa a operação
    prisma
      .$disconnect()
      .catch((e) => console.error('Erro ao desconectar do Prisma:', e));
  });
