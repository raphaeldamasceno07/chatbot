import { MongoUsersRepository } from '@/repositories/mongo/users-respository.js'
import { AuthenticationUseCase } from '../session/authenticate.js'

export function makeAuthenticateUseCase() {
  const userRepository = new MongoUsersRepository()
  const authenticateUseCase = new AuthenticationUseCase(userRepository)

  return authenticateUseCase
}
