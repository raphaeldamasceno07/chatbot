import { hash } from 'bcryptjs'
import mongoose from 'mongoose'
import { env } from '../../env/index.js'
import { UserModel } from '../../models/user-model.js' // Importando seu Model

async function runSeed() {
  try {
    console.log('🌱 Conectando ao MongoDB para popular dados...')

    // Conecta usando a URL do seu .env
    await mongoose.connect(env.MONGO_URL)

    // Limpa a collection de usuários para não duplicar se você rodar o seed 2x
    await UserModel.deleteMany({})
    console.log('🧹 Collection de usuários limpa.')

    // Criptografa a senha
    const passwordHash = await hash('admin123', 6)

    // Cria o usuário diretamente pelo Model
    const user = await UserModel.create({
      name: 'Raphael Admin',
      email: 'admin@teste.com',
      password: passwordHash,
      isOnline: false,
    })

    console.log('✅ Usuário criado com sucesso!')
    console.table({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error('❌ Erro ao rodar o seed:', error)
  } finally {
    await mongoose.connection.close()
    console.log('👋 Conexão encerrada.')
    process.exit(0)
  }
}

runSeed()
