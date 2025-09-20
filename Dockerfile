# ==============================================================================
# STAGE 1: Build Stage
# ==============================================================================
FROM node:lts-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm prune --prod

# ==============================================================================
# STAGE 2: Production Stage
# ==============================================================================
FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["node", "build/index.js"]
