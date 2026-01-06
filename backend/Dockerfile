# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies like ts-node)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code and build the NestJS app
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Re-install required Prisma libraries and bash
RUN apk add --no-cache bash openssl libc6-compat

# Copy built assets and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# --- CRITICAL FIX FOR SEEDING ---
# We need ts-node and typescript available in production to run the seed.ts file
RUN npm install -g ts-node typescript
# -------------------------------

# Copy the start.sh script and make it executable
COPY start.sh ./
RUN chmod +x start.sh

# Ensure the data directory exists for SQLite persistence
RUN mkdir -p /app/data

# Railway usually uses 8080 as seen in your previous logs
EXPOSE 8080

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Run the start script
CMD ["./start.sh"]