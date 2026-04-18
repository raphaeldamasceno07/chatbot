import { MongoUsersRepository } from '@/repositories/mongo/users-respository.js'
import { RegisterUserCase } from '../user/register.js'

export function makeRegisterUseCase() {
  const usersRepository = new MongoUsersRepository()
  const registerUseCase = new RegisterUserCase(usersRepository)

  return registerUseCase
}
