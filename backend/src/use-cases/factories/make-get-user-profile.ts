import { MongoUsersRepository } from '@/repositories/mongo/users-respository.js'
import { GetUserProfileUseCase } from '../get-user-profile.js'

export function makeGetUserProfile() {
  const usersRepository = new MongoUsersRepository()
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)

  return getUserProfileUseCase
}
