<div align="center">
  <h1>⚡ Hardware Shop API 🛒</h1>
  <p><strong>Plataforma de Marketplace de Hardware</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Fastify-v5.8-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
    <img src="https://img.shields.io/badge/TypeScript-v5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
    <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
    <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  </p>

  <p>
    Construído com base nos princípios de <strong>Domain-Driven Design (DDD)</strong>, <strong>Clean Architecture</strong>, <strong>Domain Events</strong> e <strong>Transactional Outbox Pattern</strong> para garantir consistência eventual e alta escalabilidade.
  </p>
</div>

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
  - [Clean Architecture & Camadas](#clean-architecture--camadas)
  - [Domain-Driven Design (DDD) & Bounded Contexts](#domain-driven-design-ddd--bounded-contexts)
- [Design Patterns Aplicados](#-design-patterns-aplicados)
  - [1. Factory Pattern](#1-factory-pattern)
  - [2. Aggregate & Aggregate Root](#2-aggregate--aggregate-root)
  - [3. WatchedList & Attachment Pattern](#3-watchedlist--attachment-pattern)
  - [4. Transactional Outbox Pattern](#4-transactional-outbox-pattern)
  - [5. Either Monad (Functional Error Handling)](#5-either-monad-functional-error-handling)
  - [6. Presenter & Mapper Patterns](#6-presenter--mapper-patterns)
- [Disparo de Eventos e Mensageria (Pub/Sub)](#-disparo-de-eventos-e-mensageria-pubsub)
  - [Fluxo de Ciclo de Vida dos Eventos](#fluxo-de-ciclo-de-vida-dos-eventos)
  - [Como o Outbox Relay Funciona](#como-o-outbox-relay-funciona)
- [Funcionalidades de Ponta a Ponta](#-funcionalidades-de-ponta-a-ponta)
  - [Autenticação e Usuários](#1-autenticação-e-usuários)
  - [Catálogo de Produtos e Imagens](#2-catálogo-de-produtos-e-imagens)
  - [Sistema de Perguntas e Respostas](#3-sistema-de-perguntas-e-respostas)
  - [Carrinho de Compras](#4-carrinho-de-compras)
  - [Checkout e Pagamento (Stripe)](#5-checkout-e-pagamento-stripe)
  - [Sistema de Notificações](#6-sistema-de-notificações)
- [Documentação Interativa (Swagger / OpenAPI)](#-documentação-interativa-swagger--openapi)
- [Endpoints da API](#-endpoints-da-api)
- [Instalação e Execução](#-instalação-e-execução)
- [Suíte de Testes](#-suíte-de-testes)

---

## 🚀 Visão Geral

O **Hardware Shop** é uma API RESTful de nível empresarial para comércio eletrônico especializado em hardware. O sistema foi projetado para lidar com múltiplos papéis de usuário (`Client` e `Seller`), gerenciamento completo de catálogo de componentes de hardware com especificações dinâmicas, anexos de imagem em nuvem, fluxo de dúvidas com notificações em tempo real, carrinho de compras inteligente e checkout resiliente integrado ao gateway **Stripe**, com consistência transacional garantida pelo padrão **Transactional Outbox**.

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Finalidade |
| :--- | :--- |
| **Node.js & TypeScript** | Linguagem e ambiente base com tipagem estática e segurança em tempo de compilação |
| **Fastify** | Framework HTTP web de altíssimo throughput e baixo overhead |
| **PostgreSQL** | Banco de dados relacional robusto com conformidade ACID total |
| **Prisma ORM** | Mapeamento objeto-relacional tipado, geração de migrations e queries otimizadas |
| **@fastify/swagger & @fastify/swagger-ui** | Geração automatizada da especificação OpenAPI 3.0 e UI interativa em `/docs` |
| **@fastify/jwt** | Autenticação stateless via JSON Web Tokens e controle de autorização baseado em claims |
| **@fastify/multipart** | Streaming de upload de arquivos binários |
| **Zod** | Validação em runtime de payloads, schemas de requisição e variáveis de ambiente |
| **Stripe SDK** | Gateway de pagamentos internacionais com suporte a PaymentIntents e webhooks |
| **Cloudinary SDK** | Armazenamento e entrega de mídia em nuvem otimizada para imagens de produtos |
| **BcryptJS** | Algoritmo criptográfico de hashing com salt para segurança de senhas |
| **Vitest** | Framework de testes unitários e de integração de execução concorrente ultrarrápida |
| **Tsup & Tsx** | Empacotamento de produção em alta velocidade via esbuild e execução em desenvolvimento |

---

## 🏛 Arquitetura do Projeto

A aplicação adota a **Clean Architecture** (Arquitetura Limpa) aliada aos preceitos táticos do **Domain-Driven Design (DDD)**. As regras de negócio são totalmente desacopladas de frameworks, bancos de dados e ferramentas externas.

```mermaid
graph TD
    subgraph Core ["🔹 Core Layer (Framework-Agnostic)"]
        Either["Either<Left, Right>"]
        Aggregate["AggregateRoot & Entity"]
        WatchedList["WatchedList<T>"]
        DomainEvents["DomainEvents (In-Memory Bus)"]
    end

    subgraph Domain ["🔹 Domain Layer (Business Logic)"]
        subgraph MarketplaceContext ["Marketplace Context"]
            ProductAgg["Product (Aggregate)"]
            QuestionAgg["Question (Aggregate)"]
            AnswerAgg["AnswerQuestion (Aggregate)"]
            CartAgg["Cart (Aggregate)"]
            MarketplaceUseCases["Use Cases (CRUD, Search, etc.)"]
        end
        subgraph PaymentContext ["Payment Context"]
            OrderAgg["Order (Aggregate)"]
            CheckoutUseCase["CheckoutUseCase"]
            PaymentGatewayInt["PaymentGateway (Interface)"]
        end
        subgraph NotificationContext ["Notification Context"]
            NotificationEntity["Notification (Entity)"]
            Subscribers["Event Subscribers (OnQuestion, OnAnswer, OnOrder)"]
        end
    end

    subgraph Infra ["🔹 Infrastructure Layer"]
        HTTP["Fastify HTTP / Controllers / Routes"]
        PrismaRepo["Prisma Repositories ($transaction)"]
        OutboxTable["Outbox Table (Postgres)"]
        OutboxRelayWorker["Outbox Relay Worker (Cron/Interval)"]
        StripeGateway["StripePaymentGateway"]
        CloudinaryStorage["CloudinaryUploader"]
    end

    HTTP --> MarketplaceUseCases
    HTTP --> CheckoutUseCase
    MarketplaceUseCases --> PrismaRepo
    CheckoutUseCase --> StripeGateway
    CheckoutUseCase --> PrismaRepo
    PrismaRepo --> OutboxTable
    OutboxTable --> OutboxRelayWorker
    OutboxRelayWorker --> DomainEvents
    DomainEvents --> Subscribers
    Subscribers --> NotificationEntity
```

### Clean Architecture & Camadas

1. **`core/`**: O núcleo agnóstico. Contém tipos fundamentais, primitivas de DDD (`Entity`, `AggregateRoot`, `UniqueEntityId`, `WatchedList`), mônadas funcionais (`Either`), classes base de eventos de domínio (`DomainEvent`, `DomainEvents`, `EventHandler`) e tratamento global de erros da aplicação.
2. **`domain/`**: A camada mais interna da regra de negócios corporativa e da aplicação:
   - **Enterprise Business Rules (Entidades & Value Objects)**: Contêm a lógica invariável pura de negócio.
   - **Application Business Rules (Use Cases & Interfaces)**: Orquestram o fluxo de dados entre entidades e definem contratos (interfaces de repositórios e gateways) sem dependência direta de banco de dados ou libs externas.
3. **`infra/`**: A camada externa que implementa os detalhes técnicos:
   - **`infra/http`**: Servidor Fastify, Rotas, Controllers, Presenters, Middlewares JWT e Schemas OpenAPI.
   - **`infra/db`**: Conexão Prisma, Mappers de conversão entre registros de banco e entidades de domínio, Implementações concretas de repositórios e mecanismo de Outbox.
   - **`infra/cryptography`**: Implementação Bcrypt para hashing seguro.
   - **`infra/events`**: Bootstrap dos inscritos nos eventos de domínio e Outbox Relay.

### Domain-Driven Design (DDD) & Bounded Contexts

O domínio foi segregado em três **Bounded Contexts** bem definidos:

1. **Marketplace Context (`src/domain/marketplace`)**:
   - Gestão de Usuários (`User`), Catálogo de Produtos (`Product`), Especificações técnicas (`ProductSpecs`), Anexos (`ProductAttachment`), Perguntas (`Question`), Respostas (`AnswerQuestion`) e Carrinho de Compras (`Cart`).
2. **Payment Context (`src/domain/payment`)**:
   - Pedidos (`Order`), Itens do Pedido (`OrderItem`), Gateway de Pagamento (`PaymentGateway`), Processamento com Stripe e Gestão de Estados do Pedido (`PENDING`, `CONFIRMED`, `CANCELED`).
3. **Notification Context (`src/domain/notification`)**:
   - Notificações direcionadas (`Notification`), Registro de Ouvintes de Eventos (`Subscribers`) e Disparo de Alertas a Clientes e Vendedores.

---

## 💎 Design Patterns Aplicados

### 1. Factory Pattern
Localizado em `src/infra/http/factories/` e `test/factories/`.
- **Objetivo**: Centralizar a instanciação de dependências complexas (repositórios Prisma, gateways externos, criptografia) e injetá-las de forma desacoplada nos casos de uso.
- **Exemplo**: `makeCheckoutUseCase()` instancia `PrismaProductRepository`, `PrismaOrderRepository`, `PrismaUsersRepository`, `PrismaCartRepository` e `StripePaymentGateway`, entregando uma instância pronta para o controller.

### 2. Aggregate & Aggregate Root
- **Objetivo**: Garantir a consistência e a integridade transacional de um grupo de entidades e objetos de valor relacionados sob uma única raiz (`AggregateRoot`).
- **Implementações no projeto**:
  - `Product`: Raiz que gerencia e encapsula o ciclo de vida de suas `ProductAttachment` e `ProductSpecs`.
  - `Cart`: Raiz que controla as quantidades e valores dos seus itens `CartProduct`, expondo métodos como cálculo de valor total consolidado e quantidade geral.
  - `Order`: Raiz que encapsula os itens do pedido (`OrderItem`) e o status da compra.
  - `Question` & `AnswerQuestion`: Raízes responsáveis por gerenciar o ciclo de vida das dúvidas e registrar eventos quando criadas.

### 3. WatchedList & Attachment Pattern
Localizado em `src/core/entities/watched-list.ts`.
- **Objetivo**: Rastrear itens adicionados, removidos e mantidos em coleções agregadas (como anexos de produtos ou itens do carrinho), sem a necessidade de apagar e recriar toda a lista no banco de dados.
- **Benefício**:
  ```ts
  // Permite ao mapper do Prisma saber exatamente o que inserir ou remover via delta:
  const attachments = product.attachments.getItems();
  const newAttachments = product.attachments.getNewItems();
  const removedAttachments = product.attachments.getRemovedItems();
  ```

### 4. Transactional Outbox Pattern
Localizado em `src/infra/db/outbox/` e nos repositórios Prisma.
- **Objetivo**: Solucionar o problema do duplo commit (gravar no banco de dados e publicar uma mensagem de evento simultaneamente sem risco de perda).
- **Como funciona**:
  1. A alteração de estado do agregado (ex: criação de Pedido ou Pergunta) e a inserção do evento na tabela `Outbox` ocorrem na **mesma transação atômica do PostgreSQL** (`db.$transaction`).
  2. Um processo de background (`OutboxRelay`) pesquisa eventos com `publishedAt: null`.
  3. O relay publica o evento para o barramento de eventos (`DomainEvents.dispatch`) e marca o registro como processado com timestamp `publishedAt: new Date()`.
  4. Garante entrega garantida (**At-Least-Once Delivery**) mesmo em caso de falhas transitórias ou reinicialização do servidor.

### 5. Either Monad (Functional Error Handling)
Localizado em `src/core/either.ts`.
- **Objetivo**: Eliminar o lançamento indiscriminado de exceções (`throw new Error`), tornando o fluxo de erro explícito na assinatura dos métodos.
- **Estrutura**:
  - `Left<L>`: Representa uma falha de negócio (ex: `ResourceNotFoundError`, `PaymentDeclinedError`, `UserAlreadyExistsError`).
  - `Right<R>`: Representa o sucesso retornando a carga útil da operação.

### 6. Presenter & Mapper Patterns
- **Prisma Mappers (`src/infra/db/mappers/`)**: Isola a estrutura de tabelas do Prisma das entidades ricas do domínio, convertendo dados bidirecionalmente (`toDomain` e `toPrisma`).
- **HTTP Presenters (`src/infra/http/presenters/`)**: Sanitiza e formata os dados das entidades antes de devolvê-los na resposta HTTP (excluindo senhas com hash e formatando IDs e datas em ISO-8601).

---

## 📡 Disparo de Eventos e Mensageria (Pub/Sub)

A aplicação utiliza um padrão **Publish/Subscribe (Pub/Sub)** desacoplado em memória, orquestrado pela classe `DomainEvents` em conjunto com o `Transactional Outbox`.

### Fluxo de Ciclo de Vida dos Eventos

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as 👤 Cliente
    participant Controller as 🌐 HTTP Controller
    participant UseCase as ⚙️ Use Case
    participant Aggregate as 📦 Aggregate Root
    participant Repo as 🗄️ Prisma Repository
    participant DB as 🐘 PostgreSQL ($transaction)
    participant Relay as 🔄 Outbox Relay
    participant Bus as 📢 DomainEvents (Bus)
    participant Subscriber as 📬 Notification Subscriber

    Cliente->>Controller: POST /product/:id/question
    Controller->>UseCase: execute({ authorId, productId, content })
    UseCase->>Aggregate: Question.create(...)
    Aggregate->>Aggregate: addDomainEvent(QuestionCreatedEvent)
    UseCase->>Repo: save(question)
    
    rect rgb(30, 41, 59)
        note right of Repo: Transação Atômica ACID
        Repo->>DB: INSERT INTO questions ...
        Repo->>DB: INSERT INTO outbox (aggregateId, eventType, payload) ...
    end
    
    Repo->>Bus: dispatchEventsForAggregate(question.id)
    UseCase-->>Controller: Right({ question })
    Controller-->>Cliente: 201 Created

    loop Polling Assíncrono
        Relay->>DB: SELECT * FROM outbox WHERE publishedAt IS NULL
        Relay->>Bus: DomainEvents.dispatch(domainEvent)
        Bus->>Subscriber: OnQuestionCreated.handle(event)
        Subscriber->>DB: INSERT INTO notifications (recipientId = sellerId, ...)
        Relay->>DB: UPDATE outbox SET publishedAt = NOW()
    end
```

### Eventos e Ouvintes Registrados

| Evento de Domínio | Disparado Por | Inscrito (Subscriber) | Ação Executada |
| :--- | :--- | :--- | :--- |
| `QuestionCreatedEvent` | Criação de pergunta pelo cliente | `OnQuestionCreated` | Busca o vendedor autor do produto e cria uma notificação informando a nova dúvida. |
| `AnswerQuestionsCreatedEvent` | Criação de resposta pelo vendedor | `OnAnswerQuestionCreated` | Busca o autor original da dúvida e cria uma notificação informando a resposta. |
| `OrderCreatedEvent` | Conclusão de checkout de pedido | `OnOrderCreated` | Itera pelos produtos do pedido e notifica os respectivos vendedores com os detalhes da venda. |

---

## 🧩 Funcionalidades de Ponta a Ponta

### 1. Autenticação e Usuários
- **Cadastro (`/user/register`)**: Criação de contas com hash seguro de senha (Bcrypt) e atribuição da role inicial `Client`.
- **Autenticação (`/user/login`)**: Validação de credenciais e geração de token JWT assinado.
- **Gerenciamento de Perfil**:
  - Consulta aos dados do usuário logado (`/me`).
  - Atualização segura de senha (`/users/change-password`) com verificação de credencial antiga.
  - Atualização de e-mail (`/users/change-email`) com revalidação de senha.
  - Promoção de papel de usuário (`/users/change-role`) entre `Client` e `Seller`.

### 2. Catálogo de Produtos e Imagens
- **Upload de Imagens (`/attachments`)**: Suporte a upload multipart (JPEG, PNG, WEBP) processado e hospedado no **Cloudinary**.
- **Gestão de Produtos (Vendedor)**:
  - Criação de produtos (`/product/create`) com controle de estoque, preço em centavos, categoria, especificações técnicas dinâmicas em JSON (`specs`) e IDs de anexos.
  - Edição e remoção de produtos (`/product/:id/edit`, `/product/:id/delete`) com verificação estrita de posse (um vendedor não pode alterar produtos de outro).
- **Busca e Listagem**:
  - Listagem paginada geral de produtos (`/product/list`).
  - Busca textual por termo em nome/descrição (`/product/search?search=rtx`).
  - Listagem dos produtos cadastrados pelo vendedor logado (`/product/by-seller`).

### 3. Sistema de Perguntas e Respostas
- **Perguntas**:
  - Clientes enviam dúvidas sobre produtos (`POST /product/:id/question`).
  - Disparo automático do evento `QuestionCreatedEvent`.
  - Edição e remoção de dúvidas pelo próprio autor.
  - Listagem paginada de dúvidas por produto ou por vendedor (`/product/seller/questions`).
- **Respostas**:
  - Vendedores respondem dúvidas em seus produtos (`POST /product/:productId/question/:questionId/answer`).
  - Disparo automático do evento `AnswerQuestionsCreatedEvent`.
  - Edição e remoção de respostas.
  - Listagem paginada de respostas por pergunta.

### 4. Carrinho de Compras
- **Adicionar Itens (`POST /cart/add/:productId`)**: Adiciona novos produtos ou incrementa quantidades em carrinhos existentes de forma atômica.
- **Consulta do Carrinho (`GET /cart/items`)**: Retorna os itens detalhados, calculando o total acumulado de itens e o valor financeiro consolidado em centavos.
- **Remover Itens (`DELETE /cart/:productId/delete`)**: Remove produtos individualmente do carrinho.

### 5. Checkout e Pagamento (Stripe)
- **Fluxo de Checkout (`POST /orders/checkout`)**:
  1. Valida existência e preço do produto.
  2. Executa a cobrança no **Stripe Payment Gateway** utilizando o `paymentMethodId`.
  3. Cria a entidade agregada `Order` com status `PENDING` e vincula os `OrderItem`.
  4. Emite `OrderCreatedEvent` e persiste a transação junto ao Outbox no PostgreSQL.
- **Gestão de Pedidos**:
  - Histórico de compras do cliente (`GET /orders/history`).
  - Listagem de pedidos pendentes para o vendedor (`GET /orders/seller/pending`).
  - Listagem de pedidos confirmados para o vendedor (`GET /orders/seller/confirmed`).
  - Aprovação e cancelamento de pedidos (`PATCH /orders/:id/approve`, `PATCH /orders/:id/reject`).

### 6. Sistema de Notificações
- Notificações geradas automaticamente por eventos de domínio armazenadas no banco de dados.
- Endpoints dedicados para consulta:
  - Notificações de perguntas recebidas (`GET /notifications/questions`).
  - Notificações de respostas recebidas (`GET /notifications/answers`).

---

## 📖 Documentação Interativa (Swagger / OpenAPI)

A API possui documentação interativa gerada automaticamente com conformidade ao padrão **OpenAPI 3.0**.

Ao iniciar a aplicação, acesse no navegador:

```
http://localhost:3333/docs
```

A interface do Swagger UI oferece:
- Visualização de todos os schemas de requisição e resposta com exemplos reais.
- Descrição de restrições de validação (tamanhos de string, formatos de e-mail, UUIDs, enums).
- Botão **Authorize** para inserção do token JWT (`Bearer <seu-token>`) e teste interativo direto dos endpoints protegidos.

---

## 📋 Endpoints da API

### 👤 Usuários e Autenticação (`/user`, `/users`, `/me`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/user/register` | Não | Registra um novo usuário no sistema |
| `POST` | `/user/login` | Não | Realiza login e retorna o token JWT |
| `PATCH` | `/users/change-password` | Sim (JWT) | Altera a senha do usuário logado |
| `PATCH` | `/users/change-email` | Sim (JWT) | Altera o e-mail do usuário logado |
| `PATCH` | `/users/change-role` | Sim (JWT) | Alterna a role entre `Client` e `Seller` |
| `GET` | `/me` | Sim (JWT) | Retorna os dados do perfil logado |

### 📦 Produtos (`/product`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/product/create` | Sim (Seller) | Cadastra um novo produto de hardware |
| `GET` | `/product/list` | Não | Lista produtos de forma paginada |
| `GET` | `/product/search` | Não | Pesquisa produtos por nome ou descrição |
| `GET` | `/product/by-seller` | Sim (Seller) | Lista os produtos do vendedor autenticado |
| `PATCH` | `/product/:productId/edit` | Sim (Seller) | Atualiza dados de um produto |
| `DELETE` | `/product/:productId/delete` | Sim (Seller) | Remove um produto do catálogo |

### ❓ Perguntas e Respostas (`/product`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/product/:productId/question` | Sim (JWT) | Cria uma pergunta sobre o produto |
| `GET` | `/product/:productId/questions` | Não | Lista perguntas de um produto |
| `PUT` | `/product/questions/:questionId/edit` | Sim (JWT) | Edita o conteúdo de uma pergunta |
| `DELETE` | `/product/questions/:questionId/delete` | Sim (JWT) | Deleta uma pergunta |
| `GET` | `/product/seller/questions` | Sim (Seller) | Lista todas as perguntas recebidas pelo vendedor |
| `POST` | `/product/:productId/question/:questionId/answer` | Sim (Seller) | Responde a uma pergunta de produto |
| `GET` | `/product/questions/:questionId/answers` | Não | Lista respostas de uma pergunta |
| `PUT` | `/product/answers/:answerId/edit` | Sim (Seller) | Edita o conteúdo de uma resposta |
| `DELETE` | `/product/answers/:answerId/delete` | Sim (Seller) | Deleta uma resposta |

### 🛒 Carrinho (`/cart`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/cart/add/:productId` | Sim (JWT) | Adiciona produto ao carrinho do cliente |
| `GET` | `/cart/items` | Sim (JWT) | Obtém os itens e totais do carrinho |
| `DELETE` | `/cart/:productId/delete` | Sim (JWT) | Remove produto do carrinho |

### 💳 Pedidos e Checkout (`/orders`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/orders/checkout` | Sim (JWT) | Processa pagamento via Stripe e cria o pedido |
| `GET` | `/orders/history` | Sim (JWT) | Retorna o histórico de pedidos do cliente |
| `GET` | `/orders/seller/pending` | Sim (Seller) | Lista pedidos pendentes recebidos pelo vendedor |
| `GET` | `/orders/seller/confirmed` | Sim (Seller) | Lista pedidos confirmados do vendedor |
| `PATCH` | `/orders/:orderId/approve` | Sim (JWT) | Aprova um pedido (status CONFIRMED) |
| `PATCH` | `/orders/:orderId/reject` | Sim (JWT) | Cancela/Rejeita um pedido (status CANCELED) |

### 🔔 Notificações (`/notifications`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `GET` | `/notifications/questions` | Sim (Seller) | Lista notificações de novas perguntas recebidas |
| `GET` | `/notifications/answers` | Sim (Client) | Lista notificações de respostas recebidas |

### 📎 Anexos e Mídia (`/attachments`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/attachments` | Sim (JWT) | Faz upload multipart de imagem para o Cloudinary |

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- **Node.js** >= 18.x
- **PostgreSQL** instalado ou executando via Docker
- Conta configurada no **Stripe** e **Cloudinary** (para operações de gateway e storage)

### 1. Clonar o repositório
```bash
git clone https://github.com/LBDev06/Hardware-Shop.git
cd Hardware-Shop
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com base no modelo:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/hardware_shop?schema=public"

# Servidor & Autenticação
PORT=3333
JWT_SECRET="seu_jwt_secret_super_seguro_aqui"

# Gateway de Pagamento (Stripe)
STRIPE_SECRET_KEY="sk_test_..."

# Armazenamento de Imagens (Cloudinary)
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

### 4. Executar as Migrations do Banco de Dados
```bash
npx prisma migrate dev
```

### 5. Iniciar a Aplicação

Modo Desenvolvimento:
```bash
npm run dev
```

Modo Produção:
```bash
npm run build
npm start
```

---

## 🧪 Suíte de Testes

O projeto conta com ampla cobertura de testes unitários e de integração utilizando **Vitest**, testando use cases, entidades, agregados, mappers, outbox relay e subscribers de eventos de domínio de forma isolada e com repositórios em memória (*In-Memory Repositories*).

```bash
# Executar todos os testes uma única vez
npm test

# Executar testes em modo watch (interativo)
npm run test:watch
```
