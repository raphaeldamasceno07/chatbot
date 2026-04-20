import { makeGetUserProfile } from '@/use-cases/factories/make-get-user-profile.js'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfile()

  const { user } = await getUserProfile.execute({ userId: request.user.sub })

  return reply.send({ user: { ...user, password: undefined } })
}
