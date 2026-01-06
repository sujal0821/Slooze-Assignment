#!/bin/bash
set -e

# 1. Configuration & Default Fallbacks
# Exporting ensures subsequent 'npx prisma' commands can see the variable
export DATABASE_URL="${DATABASE_URL:-file:/app/data/dev.db}"
export PORT="${PORT:-4000}"

DB_FILE="/app/data/dev.db"
SEED_MARKER="/app/data/.seeded"

echo "🚀 Starting Slooze Backend..."
echo "📍 Database Path: $DATABASE_URL"
echo "🌐 Port: $PORT"

# 2. Ensure the persistent data directory exists
# This must match your Railway Volume mount path
mkdir -p /app/data

# 3. Sync Database Status
if [ ! -f "$DB_FILE" ]; then
    echo "📦 No database found. A fresh database will be created."
    IS_NEW_DB=true
else
    echo "✅ Existing database found at $DB_FILE"
    IS_NEW_DB=false
fi

# 4. Generate Prisma Client
# This ensures the client is built for the current Linux environment
echo "🏗️  Generating Prisma Client..."
npx prisma generate

# 5. Run Prisma migrations
# This sets up the tables for Users, Restaurants, and Orders
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

# 6. Seed the database 
# Required to create Nick Fury (Admin), Captain Marvel (India), etc.
if [ "$IS_NEW_DB" = true ] || [ ! -f "$SEED_MARKER" ]; then
    echo "🌱 Seeding initial roles and regional data..."
    npx prisma db seed
    touch "$SEED_MARKER"
    echo "✅ Database seeded successfully!"
else
    echo "⏭️  Database already seeded (Marker found), skipping..."
fi

# 7. Start the production server
# Using 'exec' allows the process to handle OS signals (for graceful shutdowns)
echo "🎯 Starting production server..."
exec node dist/main.js