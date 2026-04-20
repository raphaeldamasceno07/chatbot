import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const registerUserBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.email({ message: 'Formato de e-mail inválido' }),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'employee']).optional().default('employee'),
  avatar: z.preprocess(
    (value) => {
      if (typeof value === 'string' && value.trim() === '') {
        return undefined
      }
      return value
    },
    z.string().url({ message: 'URL de avatar inválida' }).optional(),
  ),
})

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password, role, avatar } = registerUserBodySchema.parse(
    request.body,
  )

  const registerUseCase = makeRegisterUseCase()

  await registerUseCase.execute({
    name,
    email,
    password,
    role,
    avatar,
  })

  return reply.status(201).send({ message: 'User successfully created' })
}
