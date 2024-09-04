# Projeto base para backend Node.js

- Banco de dados SQL (Postregres)
- Banco de dados NoSql (Rethinkdb)
- Permite conexão com Socket.io
- Cache com Redis


#### Estrutura de pastas
```
/project-root
│
├── /config             # Configurações da aplicação
│   ├── /env            # Configurações específicas do ambiente
│   │   ├── development.js
│   │   ├── production.js
│   │   └── test.js
│   ├── db.js           # Configuração do banco de dados (Postgres e NoSQL)
│   └── socket.js       # Configuração do WebSocket
│
├── /src                # Código-fonte principal
│   ├── /api            # Endpoints e controladores da API
│   │   ├── /v1         # Versão 1 da API
│   │   │   ├── /controllers
│   │   │   ├── /routes
│   │   │   └── index.js
│   │   └── /v2         # Versão 2 da API (se necessário)
│   │       ├── /controllers
│   │       ├── /routes
│   │       └── index.js
│   ├── /models         # Modelos do banco de dados (PostgreSQL e NoSQL)
│   │   ├── /sql        # Modelos SQL (Postgres)
│   │   └── /nosql      # Modelos NoSQL (MongoDB)
│   ├── /services       # Serviços de negócios e lógica de aplicação
│   ├── /sockets        # Lógica do WebSocket
│   ├── /middlewares    # Middlewares da aplicação
│   ├── /utils          # Utilitários e helpers
│   └── server.js       # Configuração e inicialização do servidor
│
├── /migrations         # Migrações de banco de dados (SQL e NoSQL)
│
├── /tests              # Testes (unitários, integração)
│   ├── /unit           # Testes unitários
│   ├── /integration    # Testes de integração
│   └── /e2e            # Testes end-to-end
│
├── /scripts            # Scripts utilitários e automação
│
├── /docs               # Documentação do projeto
│
├── .env                # Variáveis de ambiente (desenvolvimento)
├── .gitignore          # Arquivos e pastas a serem ignorados pelo Git
├── package.json        # Dependências e scripts npm
└── README.md           # Documentação básica do projeto

```

#### Explicação de pastas

<details>
<summary>/config</summary>
    <blockquote>
     Contém todas as configurações da aplicação, incluindo arquivos específicos para diferentes ambientes (desenvolvimento, produção, teste). O arquivo db.js gerencia a conexão com os bancos de dados PostgreSQL e NoSQL, enquanto socket.js configura os WebSockets.
    </blockquote>
</details>

<details>
<summary>/src/api</summary>
<blockquote>
Organiza as rotas e controladores da API em versões (v1, v2, etc.), facilitando a manutenção e a evolução da API. Cada versão possui seus próprios controladores e rotas
</blockquote>
</details>

<details>
<summary>/src/models</summary>
<blockquote>
Separa os modelos do banco de dados SQL e NoSQL, garantindo que as diferenças entre os dois tipos de bancos de dados sejam gerenciadas de forma clara.
</blockquote>
</details>

<details>
<summary>/src/services</summary>
<blockquote>
Contém a lógica de negócios da aplicação. Isso ajuda a manter os controladores leves e focados em lidar com requisições e respostas.
</blockquote>
</details>

<details>
<summary>/src/sockets</summary>
<blockquote>
Contém a lógica e os eventos dos WebSockets. Isso inclui o gerenciamento de conexões e a comunicação em tempo real.
</blockquote>
</details>

<details>
<summary>/src/middlewares</summary>
<blockquote>
Inclui middlewares que processam as requisições antes de chegarem aos controladores, como autenticação, autorização, e validação de dados.
</blockquote>
</details>

<details>
<summary>/src/utils</summary>
<blockquote>
Funções utilitárias e helpers que são reutilizadas em diferentes partes do código.
</blockquote>
</details>

<details>
<summary>/migrations</summary>
<blockquote>
Contém scripts de migração para o banco de dados SQL e, se necessário, scripts para ajustar o banco NoSQL.
</blockquote>
</details>

<details>
<summary>/tests</summary>
<blockquote>
Organizado em testes unitários, de integração e end-to-end (E2E), proporcionando uma estrutura clara para diferentes tipos de testes.
</blockquote>
</details>

<details>
<summary>/scripts</summary>
<blockquote>
Scripts que automatizam tarefas, como inicializar o banco de dados, executar linting, ou deploy.
</blockquote>
</details>

<details>
<summary>/docs</summary>
<blockquote>
Documentação detalhada do projeto, incluindo especificações de API, configuração do ambiente de desenvolvimento, e outras informações relevantes.
</blockquote>
</details>

#### Considerações para Escalabilidade
- <b>Modularidade</b>: A estrutura modular facilita a adição de novos recursos sem impactar a base de código existente. Por exemplo, se você adicionar uma nova funcionalidade no WebSocket, ela pode ser isolada dentro da pasta /src/sockets.

- <b>Microserviços</b> (Opcional): Se o projeto crescer significativamente, você pode considerar dividir a aplicação em microserviços, onde cada serviço tem seu próprio repositório e estrutura semelhante à descrita acima.

- <b>Autenticação e Segurança</b>: Garanta que há uma abordagem centralizada para autenticação e autorização, possivelmente implementada nos middlewares.

#### Versionamento de Serviços

```
/project-root
│
├── /src
│   ├── /api
│   │   ├── /v1
│   │   │   ├── /controllers
│   │   │   │   └── userController.js
│   │   │   ├── /routes
│   │   │   │   └── userRoutes.js
│   │   │   └── index.js
│   │   └── /v2
│   │       ├── /controllers
│   │       │   └── userController.js
│   │       ├── /routes
│   │       │   └── userRoutes.js
│   │       └── index.js
│   └── server.js
│
└── package.json
```

#### Fluxo de Requests

```
User Request
      |
    Routes
      |
  Controller
      |
   Service
      |
   Repository
      |
SQL or NoSQL Database
      |
   Repository
      |
   Service
      |
  Controller
      |
User Response
```

1.	User Request: A requisição do usuário chega à aplicação.
2.	Routes: A requisição é direcionada para a rota correspondente.
3.	Controller: A rota encaminha a requisição para o controlador. O controlador é responsável por receber a requisição e determinar qual serviço deve ser chamado.
4.	Service: O controlador chama o serviço apropriado. O serviço contém a lógica de negócios e decide qual repositório deve ser acessado para obter ou manipular os dados.
5.	Repository: O serviço chama o repositório correspondente. O repositório é responsável por interagir com o banco de dados (SQL ou NoSQL) para realizar operações como buscar, inserir, atualizar ou deletar dados.
6.	Database (SQL/NoSQL): O repositório executa a consulta ao banco de dados (SQL ou NoSQL).
7.	Repository Response: Após a consulta ao banco de dados, o repositório retorna os dados para o serviço.
8.	Service Response: O serviço processa os dados recebidos do repositório, aplica qualquer lógica de negócios necessária e, em seguida, retorna a resposta para o controlador.
9.	Controller Response: O controlador recebe a resposta do serviço e formata a resposta final (se necessário) para enviar de volta ao cliente.
10.	User Response: A resposta é enviada ao usuário.



#### Design Patterns
- Repository Pattern
- Service Layer Pattern
- Factory Pattern
- Middleware Pattern
- Observer Pattern

#### Bibliotecas
- pg
- jsonwebtoken
- bcrypt
- events
- express > 4.16.0
- ws
- rethinkdb ![](https://www.npmjs.com/package/rethinkdb)
- winston
- morgan
- nodemon (opcional)
- dotenv
- redis