
FROM node:22-alpine

WORKDIR /app

# Ativa pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia só dependências (melhor cache)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copia resto do projeto
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]

