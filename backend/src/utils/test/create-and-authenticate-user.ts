import { UserModel } from '@/models/user-model.js'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await UserModel.deleteOne({ email: 'test@example.com' })

  const passwordHash = await hash('test123', 6)

  const user = await UserModel.create({
    name: 'Test User',
    email: 'test@example.com',
    password: passwordHash,
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'test@example.com',
    password: 'test123',
  })

  const { token } = authResponse.body

  await UserModel.findOne({ email: 'test@example.com' })

  return {
    token,
    id: user._id,
  }
}
