import { type IUserSafe } from "@/models/user-model.js";
import type { UsersRepository } from "@/repositories/users-repository.js";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";

interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string | undefined;
}

interface RegisterUserCaseResponse {
  user: IUserSafe;
}

export class RegisterUserCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    avatar,
  }: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse> {
    const passwordHash = await hash(password, 6);

    const emailExists = await this.userRepository.findByEmail(email);
    if (emailExists) throw new UserAlreadyExistsError();

    // Agora o objeto literal abaixo bate EXATAMENTE com o UserCreateInput literal
    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
      avatar: avatar ?? undefined,
      role: role ?? "employee",
    });

    return { user };
  }
}
