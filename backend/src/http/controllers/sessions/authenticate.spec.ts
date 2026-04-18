import { app } from '@/app.js'
import { connectDatabase, disconnectDatabase } from '@/lib/mongoose.js'
import mongoose from 'mongoose'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await connectDatabase()
    await app.ready()
  }, 30000)

  afterAll(async () => {
    await app.close()
    await disconnectDatabase()
  }, 30000)

  afterEach(async () => {
    await mongoose.connection.db?.collection('register').deleteMany({})
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/register').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong password', async () => {
    await request(app.server).post('/register').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: 'wrong-password',
    })

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('Invalid credentials.')
  })

  it('should return 400 when password is missing', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'raphael@example.com',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Validation error.')
  })
})
