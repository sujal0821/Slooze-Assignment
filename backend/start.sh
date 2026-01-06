#!/bin/bash
set -e

# Configuration
DB_PATH="${DATABASE_URL:-file:/data/dev.db}"
DB_FILE="/data/dev.db"
SEED_MARKER="/data/.seeded"

echo "🚀 Starting Slooze Backend..."

# Ensure the data directory exists
mkdir -p /data

# Check if this is a fresh database
if [ ! -f "$DB_FILE" ]; then
    echo "📦 No database found. Creating fresh database..."
    IS_NEW_DB=true
else
    echo "✅ Existing database found at $DB_FILE"
    IS_NEW_DB=false
fi

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

# Seed the database only if it's new or hasn't been seeded before
if [ "$IS_NEW_DB" = true ] || [ ! -f "$SEED_MARKER" ]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
    touch "$SEED_MARKER"
    echo "✅ Database seeded successfully!"
else
    echo "⏭️  Database already seeded, skipping..."
fi

# Start the production server
echo "🎯 Starting production server on port ${PORT:-4000}..."
exec node dist/main.js
