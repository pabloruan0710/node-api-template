const fs = require("fs");
const path = require("path");

// Função para criar arquivos e pastas boilerplate
function generateBoilerplate(moduleName, version, noSQL = false) {
  // Diretórios de destino
  const baseDir = path.resolve(__dirname, "../src"); // Assumindo que o código está em "src"
  const dirs = [
    "api",
    "services",
    "models/sql",
    "models/nosql",
    `api/${version}/controllers`,
    `api/${version}/routes`,
  ];
  const isNewVersion = fs.existsSync(path.join(baseDir, `api/${version}`));
  // Caminho completo para cada diretório
  dirs.forEach((dir) => {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Criação de arquivos boilerplate
  let database = noSQL ? "nosql" : "sql";
  createFile(
    path.join(baseDir, "services", `${moduleName}Service.js`),
    serviceTemplate(moduleName)
  );
  createFile(
    path.join(baseDir, `models/${database}`, `${moduleName}Repository.js`),
    repositoryTemplate(moduleName)
  );
  createFile(
    path.join(
      baseDir,
      `api/${version}/controllers`,
      `${moduleName}Controller.js`
    ),
    controllerTemplate(moduleName)
  );
  createFile(
    path.join(baseDir, `api/${version}/routes`, `${moduleName}Routes.js`),
    routesTemplate(moduleName)
  );

  // Cria Index de rotas para versão criada
  if (isNewVersion)
    createFile(
      path.join(baseDir, `api/${version}`, `index.js`),
      routeIndexTemplate(moduleName)
    );

  console.log(`✅ Novo módulo ${moduleName} criado com sucesso!`);
  console.log(`🚨 Adicione as seguintes linhas no arquivo 'src/routes.js'`);
  console.log(
    `→ "const ${moduleName}${version.toUpperCase()}Routes = require('./api/${version}')"`
  );
  console.log(
    `→ "app.use('/api/${version}', ${moduleName}${version.toUpperCase()}Routes)"`
  );
}

// Função para criar arquivo com conteúdo
function createFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

// Templates de código boilerplate
function serviceTemplate(moduleName) {
  return `
const ${moduleName}Repository = require('../models/sql/${moduleName}Repository')

class ${moduleName}Service {
    constructor() {
        // Inicialização do serviço
    }

    async example(exampleId) {
        const example = await ${moduleName}Repository.findExampleById(exampleId);
        if (!user) {
            throw new Error('Example not found')
        }
        return example;
    }
}
module.exports = new ${moduleName}Service();`;
}

function repositoryTemplate(moduleName) {
  return `
const DatabaseFactory = require("../../../config/db")
const logger = require('../../utils/logger')

class ${moduleName}Repository {

    // Método de Exemplo
    async findExampleById(id) {
        try {
            const result = await DatabaseFactory.sql.query('SELECT * FROM pg_catalog.pg_statistic where stakind1 = $1', [id])
            return result.rows[0]
        } catch (error) {
            
            //logger.error("["+this.constructor.name+"][]:", error.stack)
            throw new Error(\`Não foi possível encontrar o exmplo pelo id informado:\`, error.message)
        }
    }

}
module.exports = new ${moduleName}Repository();
`;
}

function controllerTemplate(moduleName) {
  return `
const ${moduleName}Service = require('../../../services/${moduleName}Service');
const ResponseFormatter = require('../../../utils/ResponseFormatter');

class ${moduleName}Controller {
    async example(req, res) {
            try {
            const example = await ${moduleName}Service.example(req.params.id)
            res.status(200).json(ResponseFormatter.success(example))
        } catch (error) {
            ResponseFormatter.responseError(res, error)
        }
    }
}
module.exports = new ${moduleName}Controller();
`;
}

function routesTemplate(moduleName) {
  return `const express = require('express');
const router = express.Router();
const ${moduleName}Controller = require('../controllers/${moduleName}Controller')
const AuthMiddleware = require('../../../middlewares/authMiddleware')
const CacheMiddleware = require('../../../middlewares/cacheMiddleware')

router.post('/test', ${moduleName}Controller.example)
router.get('/test/:id', CacheMiddleware.cached(60), ${moduleName}Controller.example) // Cache com 60 segundos
//router.post('/test/login', AuthMiddleware.auth, ${moduleName}Controller.login)

module.exports = router;`;
}

function routeIndexTemplate(moduleName) {
  return `const express = require('express')
        const router = express.Router()
        const ${moduleName}Routes = require('./routes/${moduleName}Routes');

        router.use('/${moduleName.toLowerCase()}', ${moduleName}Routes)

        module.exports = router;`;
}

// Executar script
const moduleName = process.argv[2];
const version = process.argv[3];
const isNoSql = process.argv[4];

if (!moduleName) {
  console.error("Por favor, forneça um nome para o módulo.");
  process.exit(1);
} else if (!version) {
  console.error(
    'Por favor, forneça a versão do serviço, exmplo: v1, v2, v3... "generate nameModulo version"'
  );
  process.exit(1);
}

generateBoilerplate(moduleName, version.toLocaleLowerCase(), isNoSql);
