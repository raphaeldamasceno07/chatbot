import { profile } from '@/http/controllers/users/profile.js'
import {
  register,
  registerUserBodySchema,
} from '@/http/controllers/users/register.js'
import { verifyJWT } from '@/http/middleware/verify-jwt.js'
import type { FastifyInstance } from 'fastify'
import z from 'zod'

const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'employee']),
  avatar: z.string().url().optional().nullable(),
  is_online: z.boolean(),
  created_at: z.date().or(z.string()), // O Mongo retorna Date, mas o JSON vira String
})

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        tags: ['Users'],
        summary: '/register',
        description: 'Create a new user account',
        body: registerUserBodySchema,
        response: {
          201: z.object({
            message: z.string().describe('User successfully created'),
          }),
          400: z.object({
            message: z.string().describe('Validation error'),
          }),
          409: z.object({
            message: z.string().describe('User already exists'),
          }),
        },
      },
    },
    register,
  )

  app.get(
    '/me',
    {
      schema: {
        tags: ['Users'],
        summary: '/me',
        description: 'Get the profile of the authenticated user',
        response: {
          200: z.object({
            user: userResponseSchema, // Aqui ele garante que o retorno terá essa cara
          }),
          401: z.object({
            message: z.string().describe('Unauthorized'),
          }),
        },
      },
      onRequest: [verifyJWT],
    },
    profile,
  )
}
