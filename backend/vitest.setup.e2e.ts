import {
  MongoDBContainer,
  type StartedMongoDBContainer,
} from '@testcontainers/mongodb'

let container: StartedMongoDBContainer

export async function setup() {
  console.log('\n🚀 Starting MongoDB Testcontainer...')

  container = await new MongoDBContainer('mongo:6.0').start()
  let uri = container.getConnectionString()

  // Se o MongoDB estiver em replicaset, o driver pode tentar resolver o hostname interno do
  // container. Forçamos conexão direta para evitar o problema EAI_AGAIN.
  if (uri.includes('?')) {
    uri += '&directConnection=true'
  } else {
    uri += '?directConnection=true'
  }

  // 1. Injeta no process.env PRIMEIRO
  process.env.MONGO_URL = uri
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET_TEST = 'test-jwt-secret-key-for-testing-purposes'

  // 2. Só agora importa o seu validador de env (Zod ou similar)
  // Isso garante que quando o 'env' for carregado, ele já leia o MONGO_URL correto
  const { env } = await import('@/env/index.js')

  // Opcional: atualizar o objeto se ele permitir escrita
  try {
    ;(env as any).MONGO_URL = uri
  } catch (e) {
    // Se for read-only, não tem problema, o process.env já está setado
  }

  console.log(`✅ Test Database ready at: ${uri}`)
}

export async function teardown() {
  if (container) {
    await container.stop()
    console.log('🛑 Testcontainer stopped.')
  }
}
