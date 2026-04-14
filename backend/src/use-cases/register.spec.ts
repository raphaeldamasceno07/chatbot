import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'
import { RegisterUserCase } from './register.js'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserCase

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jhondoe1@example.com',
      password: '123456',
    })

    expect(user.id).toBeDefined()
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'jhondoe1@example.com',
      })
    )
  })

  it('should hash password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jhondoe1@example.com',
      password: '123456',
    })

    expect(user.password).not.toBe('123456')
    const isPasswordCorrectlyHashed = await compare('123456', user.password)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'jhondoe1@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
