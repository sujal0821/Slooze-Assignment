# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies for Prisma engine compatibility
RUN apk add --no-cache openssl libc6-compat

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate the Prisma client
RUN npm install
RUN npx prisma generate

# Copy source code and build the NestJS application
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Re-install bash and essential Prisma/TSX system libraries
RUN apk add --no-cache bash openssl libc6-compat

# Copy built assets and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Copy the start.sh script and make it executable
COPY start.sh ./
RUN chmod +x start.sh

# Ensure the persistent data directory exists for your SQLite volume
RUN mkdir -p /app/data

# Railway typically uses 8080 as the default port
EXPOSE 8080

# Production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Execute the start script to handle migrations, seeding, and server startup
CMD ["./start.sh"]