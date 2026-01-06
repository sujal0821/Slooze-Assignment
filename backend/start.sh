#!/bin/bash
set -e

# Configuration
# Railway volumes are typically mounted to /app/data if specified in settings
DB_PATH="${DATABASE_URL:-file:/app/data/dev.db}"
DB_FILE="/app/data/dev.db"
SEED_MARKER="/app/data/.seeded"

echo "🚀 Starting Slooze Backend..."

# 1. Ensure the persistent data directory exists
# This directory must match your Railway Volume mount path
mkdir -p /app/data

# 2. Sync Database Status
if [ ! -f "$DB_FILE" ]; then
    echo "📦 No database found. Creating fresh database..."
    IS_NEW_DB=true
else
    echo "✅ Existing database found at $DB_FILE"
    IS_NEW_DB=false
fi

# 3. Generate Prisma Client (Crucial for production environments)
echo "🏗️  Generating Prisma Client..."
npx prisma generate

# 4. Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

# 5. Seed the database (Nick Fury, Captain Marvel, etc.)
# Only run if it's a new DB or the marker is missing
if [ "$IS_NEW_DB" = true ] || [ ! -f "$SEED_MARKER" ]; then
    echo "🌱 Seeding database with employees and restaurants..."
    npx prisma db seed
    touch "$SEED_MARKER"
    echo "✅ Database seeded successfully!"
else
    echo "⏭️  Database already seeded, skipping..."
fi

# 6. Start the production server
# Using 'exec' ensures the process receives termination signals correctly
echo "🎯 Starting production server on port ${PORT:-4000}..."
exec node dist/main.js