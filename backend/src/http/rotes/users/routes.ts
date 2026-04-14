import {
  register,
  registerUserBodySchema,
} from "@/http/controllers/users/register.js";
import type { FastifyInstance } from "fastify";
import z from "zod";

export async function userRoutes(app: FastifyInstance) {
  app.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "Create user",
        description: "Create a new user account",
        body: registerUserBodySchema,
        response: {
          201: z.object({
            message: z.string().describe("User successfully created"),
          }),
          400: z.object({
            message: z.string().describe("Validation error"),
          }),
          409: z.object({
            message: z.string().describe("User already exists"),
          }),
        },
      },
    },
    register,
  );
}
