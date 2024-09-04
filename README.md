# Node.js API Template

Este repositório é uma base para o desenvolvimento de projetos de backend em Node.js, criado por **Pablo Ruan** ([@pabloruan0710](https://github.com/pabloruan0710)). O projeto oferece uma estrutura modular e escalável, com integração opcional para PostgreSQL, Socket.io, RethinkDB e Redis, além de funcionalidades de autenticação com JWT e cache automático utilizando middleware com Redis.

Integrações já adicionadas:
- Banco de dados SQL (Postregres)
- Banco de dados NoSql (Rethinkdb)
- Permite conexão com Socket.io (mesma porta do server express definido no .env)
- Cache com Redis

## Instalação

Necessário `Node >= v16.10.0`

1. Clone o repositório:

   ```bash
   git clone https://github.com/pabloruan0710/node-api-template.git
   
   # Acessar pasta do projeto
   cd node-api-template
   
   # Instale as dependências
   npm install

   # Configure o arquivo .env conforme necessário
   cp .env.example .env

   # Defina a porta do servidor no .env, ex: PORT=4000
   PORT=

   # Inicie o servidor
   npm run dev

   # Testando o serviço, abra o browser e digite
   http://localhost:4000/api/v1/example/test

   #### Opcional: Caso queira republicar em outro repositório do git.
   # 1.	Vá para o GitHub e crie um novo repositório.
   # 2.	Não inicialize o novo repositório com um README, .gitignore ou qualquer outra configuração, pois você estará enviando o conteúdo do repositório clonado.
   # 3.	Copie a URL do novo repositório (algo como https://github.com/seu-usuario/novo-repositorio.git).
   git remote remove origin
   git remote add origin https://github.com/seu-usuario/novo-repositorio.git
   git push -u origin main

   ```

## Criação de módulo

É possível criar um novo módulo a partir de um comando, eliminando necessidade de criar todos os arquivos (services, controller, respositories, rotues) na mão, basta executar o seguinte comando

1. Criando módulo:

   ```bash
   npm run generate <NomeDoModulo> <VersaoServico> <NoSQL>
   # Exemplo: npm run generate User v1 false
   ```

   - **NomeDoModulo**: Nome do seu novo módulo, ex: User
   - **VersaoServico**: Versão do serviço, ex: v1, v2, v3 (usado para versionamento e **deve compor o endpoint**)
   - **NoSql**: por padrão o serviço é criado com o Repository SQL (postrgres), caso queira usar o RethinkDB, use true para esse parametro

## Funcionalidades

- Estrutura organizada em múltiplas pastas (routes, controllers, services, repositories, etc.).
- Suporte para banco de dados **PostgreSQL** e **RethinkDB** (opcionais).
- Integração com **Socket.io** para comunicação em tempo real (opcional).
- Cache automático usando **Redis** como middleware.
- Autenticação segura utilizando **JSON Web Tokens (JWT)**.
- Hashing de senhas com **bcrypt**.
- Logging avançado com **Winston** e **Morgan**.
- Variáveis de ambiente gerenciadas com **dotenv**.
- Suporte opcional para reinicialização automática com **nodemon** durante o desenvolvimento.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de execução de código JavaScript no servidor.
- **Express**: Framework web para Node.js que facilita o desenvolvimento de APIs REST.
- **PostgreSQL**: Banco de dados relacional (opcional).
- **RethinkDB**: Banco de dados NoSQL orientado a documentos e voltado para aplicativos em tempo real (opcional).
- **Redis**: Armazenamento de dados em memória usado para cache e gerenciamento de sessões.
- **Socket.io**: Biblioteca para comunicação em tempo real (opcional).
- **JWT (jsonwebtoken)**: Padrão aberto para autenticação e troca segura de informações.
- **bcrypt**: Biblioteca para hashing de senhas.
- **Winston** e **Morgan**: Bibliotecas para registro de logs.
- **dotenv**: Carrega variáveis de ambiente de um arquivo `.env`.

## Estrutura de Pastas

A arquitetura do projeto é dividida nas seguintes pastas principais:

- **/controllers**: Lida com a lógica de requisição e resposta.
- **/services**: Contém a lógica de negócios.
- **/repositories**: Comunica diretamente com os repositórios (SQL ou NOSQL).
- **/routes**: Define as rotas da API e mapeia para os controladores apropriados.
- **/middlewares**: Middlewares personalizados, incluindo o middleware de cache com Redis.
- **/config**: Configurações e variáveis de ambiente.
- **/models**: Modelos para interação com bancos de dados.

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

## Explicação de pastas

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

## Considerações para Escalabilidade
- <b>Modularidade</b>: A estrutura modular facilita a adição de novos recursos sem impactar a base de código existente. Por exemplo, se você adicionar uma nova funcionalidade no WebSocket, ela pode ser isolada dentro da pasta /src/sockets.

- <b>Microserviços</b> (Opcional): Se o projeto crescer significativamente, você pode considerar dividir a aplicação em microserviços, onde cada serviço tem seu próprio repositório e estrutura semelhante à descrita acima.

- <b>Autenticação e Segurança</b>: Garanta que há uma abordagem centralizada para autenticação e autorização, possivelmente implementada nos middlewares.

## Versionamento de Serviços

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

## Fluxo de Requests

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


## Design Patterns
- Repository Pattern
- Service Layer Pattern
- Factory Pattern
- Middleware Pattern
- Observer Pattern

## Bibliotecas

- ([pg](https://www.npmjs.com/package/pg))
- ([jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken))
- ([bcrypt](https://www.npmjs.com/package/bcrypt))
- ([express > 4.16.0](https://www.npmjs.com/package/express))
- ([socket.io](https://www.npmjs.com/package/socket.io))
- ([rethinkdb](https://www.npmjs.com/package/rethinkdb))
- ([winston](https://www.npmjs.com/package/winston))
- ([morgan](https://www.npmjs.com/package/morgan))
- ([nodemon](https://www.npmjs.com/package/nodemon))
- ([dotenv](https://www.npmjs.com/package/dotenv))
- ([redis](https://www.npmjs.com/package/redis))
- ([lodash](https://www.npmjs.com/package/lodash))

## Contribuição

Contribuições são bem-vindas! Se você deseja contribuir, por favor, abra um Pull Request ou uma Issue com sugestões.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.