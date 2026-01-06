# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install bash for the start script
RUN apk add --no-cache bash

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Expose port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Run start script
CMD ["./start.sh"]
