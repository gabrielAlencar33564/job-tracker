# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
RUN npx prisma generate --schema=prisma/schema

COPY src ./src
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3333

# Run migrations and start the app
CMD npx prisma migrate deploy --schema=prisma/schema && node dist/src/main
