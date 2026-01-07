#!/bin/bash
set -e

# Export configuration for Prisma CLI
export DATABASE_URL="${DATABASE_URL:-file:/app/data/dev.db}"
export PORT="${PORT:-8080}"

DB_FILE="/app/data/dev.db"
SEED_MARKER="/app/data/.seeded"

echo "🚀 Starting Slooze Backend..."
echo "📍 Database Path: $DATABASE_URL"

# 1. Ensure the persistent data directory exists
mkdir -p /app/data

# 2. Check Database Status
if [ ! -f "$DB_FILE" ]; then
    echo "📦 No database found. A fresh database will be created."
    IS_NEW_DB=true
else
    echo "✅ Existing database found at $DB_FILE"
    IS_NEW_DB=false
fi

# 3. Generate Prisma Client (Production)
echo "🏗️  Generating Prisma Client..."
npx prisma generate

# 4. Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

# 5. Seed the database (Nick Fury, Captain Marvel, etc.)
# 5. Seed the database (Always run to ensure data sync)
echo "🌱 Seeding/Updating roles and regional data..."
npx tsx prisma/seed.ts
echo "✅ Database seeded successfully!"

# 6. Start the production server
# Note: NestJS builds typically output to dist/main.js
echo "🎯 Starting production server..."
if [ -f "./dist/main.js" ]; then
    exec node dist/main.js
elif [ -f "./dist/src/main.js" ]; then
    # Fallback if the compiler nesting includes 'src'
    exec node dist/src/main.js
else
    echo "❌ ERROR: Could not find production entry point in ./dist/"
    ls -R ./dist
    exit 1
fi