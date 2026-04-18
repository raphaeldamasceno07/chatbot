import {
  authenticateBodySchema,
  session,
} from '@/http/controllers/sessions/authenticate.js'
import type { FastifyInstance } from 'fastify'
import z from 'zod'

export async function sessionRoutes(app: FastifyInstance) {
  app.post(
    '/sessions',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Authenticate user',
        description: 'Authenticate a user with email and password',
        body: authenticateBodySchema,
        response: {
          200: z.object({
            token: z.string().describe('Authentication token'),
          }),
          400: z.object({
            message: z.string().describe('Validation error'),
          }),
          401: z.object({
            message: z.string().describe('Invalid credentials'),
          }),
        },
      },
    },
    session,
  )

  // app.patch('/token/refresh', refresh)
}
