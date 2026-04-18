import type { User } from '@/models/user-model.js'
import type { UsersRepository } from '@/repositories/users-repository.js'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error.js'

interface RegisterUserCaseRequest {
  name: string
  email: string
  password: string
  avatar?: string | undefined
  role?: 'admin' | 'employee'
}

interface RegisterUserCaseResponse {
  user: User
}
export class RegisterUserCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    avatar,
    role = 'employee',
  }: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse> {
    const passwordHash = await hash(password, 6)

    const emailExists = await this.userRepository.findByEmail(email)

    if (emailExists) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
      avatar: avatar ?? undefined,
      role,
    })

    return { user }
  }
}
