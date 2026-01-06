# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Install openssl and libc6-compat for Prisma compatibility on Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client for the Linux environment
RUN npm ci
RUN npx prisma generate

# Copy source code and build the NestJS app
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# 2. Re-install bash and required Prisma libraries in the final image
RUN apk add --no-cache bash openssl libc6-compat

# Copy built assets and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Copy the start.sh script and make it executable
COPY start.sh ./
RUN chmod +x start.sh

# 3. Ensure the data directory exists for your SQLite persistence
RUN mkdir -p /app/data

# Expose the port (Railway typically uses 8080 as seen in your logs)
EXPOSE 8080

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Run the start script
CMD ["./start.sh"]