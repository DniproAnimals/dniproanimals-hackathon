FROM node:22-alpine

WORKDIR /app

# Redis
RUN apk add --no-cache redis

# Копируем весь monorepo
COPY . .

# Устанавливаем зависимости всех npm workspaces
RUN npm ci

# Render будет передавать PORT через environment
ENV PORT=10000
EXPOSE 10000

# Запускаем Redis и Fastify
CMD ["sh", "-c", "redis-server --daemonize yes && npm run start --workspace=@dniproanimals/server"]