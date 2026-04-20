import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error.js'
import { AuthenticationUseCase } from './authenticate.js'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticationUseCase

describe('Authentication Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticationUseCase(usersRepository)
  })

  it('should be able to autheticate', async () => {
    await usersRepository.create({
      name: 'Raphael',
      email: 'raphael@example.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'raphael@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should nor be able to autheticate with wrong email', async () => {
    await usersRepository.create({
      name: 'Raphael',
      email: 'raphael@example.com',
      password: await hash('123456', 6),
    })

    await expect(async () => {
      await sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      })
    }).rejects.instanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Raphael',
      email: 'raphael@example.com',
      password: await hash('123456', 6),
    })

    await expect(async () => {
      await sut.execute({
        email: 'raphael@example.com',
        password: 'wrong-password',
      })
    }).rejects.instanceOf(InvalidCredentialsError)
  })
})
