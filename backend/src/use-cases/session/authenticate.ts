import type { IUser } from '@/models/user-model.js'
import type { UsersRepository } from '@/repositories/users-repository.js'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error.js'

interface AuthenticationUseCaseRequest {
  email: string
  password: string
}

interface AuthenticationUseCaseResponse {
  user: IUser
}

export class AuthenticationUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticationUseCaseRequest): Promise<AuthenticationUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatch = await compare(password, user.password)

    if (!doesPasswordMatch) throw new InvalidCredentialsError()

    return { user }
  }
}
