import type { IUser } from '@/models/user-model.js'
import type { UsersRepository } from '@/repositories/users-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts.js'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: IUser
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) throw new ResourceNotFoundError()

    return { user }
  }
}
