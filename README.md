# Sistema de Gerenciamento para Loja de Aluguel de Roupas

Sistema completo para gerenciamento de loja de aluguel de roupas construído com NestJS, TypeScript, Prisma ORM e PostgreSQL.

## Arquitetura

O sistema segue uma arquitetura de microserviços com princípios do Domain-Driven Design (DDD).

### Camadas
- Camada de Domínio: Entidades, Agregados, Serviços de Domínio
- Camada de Aplicação: Casos de Uso, DTOs, Serviços de Aplicação
- Camada de Infraestrutura: Repositórios, Adaptadores Externos
- Camada de Apresentação: Controladores, Middlewares

### Módulos
- Autenticação: Gerenciamento de usuários, permissões e logs de auditoria
- Funcionários: Gerenciamento de funcionários da loja
- Clientes: Gerenciamento de dados e histórico de clientes
- Inventário: Gerenciamento de produtos, categorias e manutenção
- Eventos/Locais: Gerenciamento de eventos e locais associados
- Contratos: Gerenciamento de aluguéis, pagamentos e notificações

## Tecnologias Utilizadas

- **Backend**: NestJS + TypeScript
- **ORM**: Prisma ORM
- **Banco de Dados**: PostgreSQL
- **API**: REST com documentação Swagger
- **Autenticação**: JWT com refresh tokens e controle de acesso baseado em papéis
- **Testes**: Jest + Supertest
- **Validação**: class-validator + class-transformer

## Requisitos

- Node.js (v16 ou superior)
- PostgreSQL (v13 ou superior)

## Instalação

1. Clone este repositório
2. Instale as dependências:
   `
   npm install
   `
3. Configure o arquivo .env com suas variáveis de ambiente (use .env.example como base)
4. Execute as migrações do banco de dados:
   `
   npx prisma migrate dev
   `
5. Execute os seeds para popular dados iniciais (opcional):
   `
   npm run seed
   `

## Executando o Projeto

### Desenvolvimento
`
npm run start:dev
`

### Produção
`
npm run build
npm run start:prod
`

## Acesso à API

- API REST: http://localhost:3000/api
- Documentação Swagger: http://localhost:3000/api/docs

## Testes

### Executar testes unitários
`
npm run test
`

### Executar testes de integração
`
npm run test:e2e
`

### Gerar relatório de cobertura
`
npm run test:cov
`

## Estrutura do Projeto
`
aluguel-roupas/
├── src/
│   ├── auth/              # Módulo de autenticação
│   ├── employees/         # Módulo de funcionários
│   ├── customers/         # Módulo de clientes
│   ├── inventory/         # Módulo de inventário
│   ├── events/            # Módulo de eventos/locais
│   ├── contracts/         # Módulo de contratos
│   ├── shared/            # Código compartilhado
│   ├── app.module.ts      # Módulo principal
│   └── main.ts            # Ponto de entrada
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── seed.ts            # Script de seeds
├── test/                  # Testes de integração
├── .env                   # Variáveis de ambiente
└── package.json
`
