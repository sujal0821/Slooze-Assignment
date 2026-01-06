# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy configuration files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./

# Install all dependencies and generate Prisma Client
RUN npm install
RUN npx prisma generate

# Copy source code and build the NestJS application
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install system dependencies and bash
RUN apk add --no-cache bash openssl libc6-compat

# Copy ONLY the necessary assets from builder to keep the image slim
# We copy the entire dist folder and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Install tsx globally in production for seeding
RUN npm install -g tsx

# Copy the start script and make it executable
COPY start.sh ./
RUN chmod +x start.sh

# Ensure the persistent data directory exists for SQLite
RUN mkdir -p /app/data

# Railway usually uses 8080 as the default port
EXPOSE 8080

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Execute the start script
CMD ["./start.sh"]