# Dockerfile for Next.js application with Turbopack support
# This Dockerfile is optimized for production use with a multi-stage build process.

# Stage 1: Install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install

# Stage 2: Build the application
FROM node:lts-alpine AS builder
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules

# Ensure the .next directory is created and has the correct permissions
# This is necessary for the build process to cache correctly.
RUN mkdir -p /app/.next/cache && chown nextjs:nodejs /app/.next/cache
VOLUME ["/app/.next/cache"]

COPY . .

RUN npm run build

# Stage 3: Prepare the production image
FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]