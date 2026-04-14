import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error.js";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const registerUserBodySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email({ message: "Formato de e-mail inválido" }),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerUserBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      password,
    });

    return reply.status(201).send({ message: "User successfully created" });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
