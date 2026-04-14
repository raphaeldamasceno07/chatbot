backend/
├── src/
│ ├── @types/ # Tipagens globais e extensões de módulos
│ ├── config/ # Parâmetros de configuração (upload, auth, cors)
│ │ └── upload.ts # Definição de limites e tipos de arquivos (Multer/Multipart)
│ ├── database/ # Scripts de banco de dados
│ │ └── seeds/ # Scripts para popular o banco (seed.ts)
│ ├── env/ # Validação de variáveis de ambiente
│ ├── http/ # Camada de entrada (Controllers e Routes)
│ │ ├── controllers/ # Lógica de extração de dados da Request
│ │ ├── middlewares/ # Validação de JWT, tratamento de uploads
│ │ └── routes/ # Definição dos endpoints
│ ├── lib/ # Clientes e instâncias (mongoose.ts, socket.ts)
│ ├── models/ # Schemas do Mongoose (user-model.ts, message-model.ts)
│ ├── providers/ # Serviços de infraestrutura (Storage, Mail, etc)
│ │ └── StorageProvider/
│ │ ├── IStorageProvider.ts # Interface (contrato)
│ │ └── DiskStorageProvider.ts # Implementação salvando no HD
│ ├── socket/ # Handlers e eventos do Socket.io
│ ├── use-cases/ # Lógica de negócio pura (RegisterUser, UploadAvatar)
│ ├── app.ts # Configuração do Fastify (plugins, registers)
│ └── server.ts # Boot do servidor e conexão com o banco
├── uploads/ # <-- PASTA DE ARQUIVOS (Ignorada no Git)
│ ├── avatars/ # Fotos de perfil dos usuários
│ └── chat/ # Imagens e documentos enviados nas conversas
├── Dockerfile
├── biome.json
├── package.json
└── tsconfig.json
