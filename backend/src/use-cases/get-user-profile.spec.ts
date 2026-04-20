import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.ts.js'
import { GetUserProfileUseCase } from './get-user-profile.js'

let userRepository: InMemoryUsersRepository
let sut = new GetUserProfileUseCase(userRepository)

describe('Get User Profile', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should return the user profile when the user exists', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
      role: 'employee',
    })

    const userProfile = await sut.execute({ userId: user.id })

    expect(userProfile).toEqual({ user })
  })

  it('should throw an error when the user does not exist', async () => {
    await expect(
      sut.execute({ userId: 'non-existing-user-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
