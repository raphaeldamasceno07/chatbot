import { app } from '@/app.js'
import { connectDatabase, disconnectDatabase } from '@/lib/mongoose.js'
import mongoose from 'mongoose'
import request from 'supertest'

describe('Refresh token (e2e)', () => {
  beforeAll(async () => {
    await connectDatabase()
    await app.ready()
  }, 30000)

  afterAll(async () => {
    await app.close()
    await disconnectDatabase()
  }, 30000)

  afterEach(async () => {
    await mongoose.connection.db?.collection('users').deleteMany({})
  })

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/register').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john.doe@example.com',
      password: 'password123',
    })

    const cookies = authResponse.headers['set-cookie']

    if (!cookies) {
      throw new Error('No cookies set')
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.body).toEqual({ token: expect.any(String) })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
