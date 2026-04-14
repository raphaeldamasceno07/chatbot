import { app } from "./app.js";
import { env } from "./env/index.js";
import { connectDatabase } from "./lib/mongoose.js";

const DOC_LINK = `http://localhost:${env.PORT}/docs`;

async function bootstrap() {
  try {
    await connectDatabase();

    await app.listen({
      host: "0.0.0.0",
      port: env.PORT,
    });

    if (env.NODE_ENV === "dev") {
      console.log(`[DEV] Documentação disponível em: ${DOC_LINK}`);
    } else {
      console.log(`[PROD] Server is running on port ${env.PORT}`);
    }

    console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
}

bootstrap();
