FROM node:22-alpine

WORKDIR /app

# Redis + Chromium dependencies
RUN apk add --no-cache \
    redis \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Не скачивать Chrome от Puppeteer.
# Используем системный Chromium из Alpine.
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Копируем весь monorepo
COPY . .

# Устанавливаем зависимости всех npm workspaces
RUN npm ci

RUN npx turbo run build --filter=@dniproanimals/server...

ENV PORT=10000

EXPOSE 10000

CMD ["sh", "-c", "redis-server --daemonize yes && npm run start --workspace=@dniproanimals/server"]