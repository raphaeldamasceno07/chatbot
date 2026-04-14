import cors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { env } from "./env/index.js";
import { userRoutes } from "./http/rotes/users/routes.js";
import { customTransform } from "./lib/custom-transform.js";
import { AppError } from "./use-cases/errors/app-error.js";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "*",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Chatbot API",
      description: "API documentation for the Chatbot backend",
      version: "1.0.0",
    },
  },
  transform: customTransform,
});

app.register(scalarApiReference, {
  routePrefix: "/docs",
  configuration: {
    theme: "dark",
    layout: "modern",
    showSidebar: true,
  },
});

app.register(userRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  if (error instanceof AppError) {
    if (env.NODE_ENV !== "prod") {
      console.warn(`⚠️ [Business Error]: ${error.message}`);
    }

    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  if (env.NODE_ENV !== "prod") {
    console.error("❌ [Internal Error]:", error);
  } else {
    // Quando tiver Sentry/DataDog, o código entra aqui
  }

  return reply.status(500).send({
    message: "Internal server error.",
  });
});
