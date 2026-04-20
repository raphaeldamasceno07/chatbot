import { app } from '@/app.js'
import { connectDatabase, disconnectDatabase } from '@/lib/mongoose.js'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'
import mongoose from 'mongoose'
import request from 'supertest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await connectDatabase()
    await app.ready()
  }, 30000)

  afterAll(async () => {
    await app.close()
    await disconnectDatabase()
  }, 30000)

  beforeEach(async () => {
    await mongoose.connection.db?.collection('users').deleteMany({})
  })

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'test@example.com',
      }),
    )
  })
})
