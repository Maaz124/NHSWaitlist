#!/bin/bash

# Script to clear database tables using Docker exec
# This connects to the running PostgreSQL container and clears all tables

echo "🧹 Clearing database tables..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Execute the clear tables SQL script
docker exec -i nhs-waitlist-db psql -U nhs_user -d nhs_waitlist < clear-tables.sql

echo "✅ Database tables cleared successfully!"
echo "📊 You can now start fresh with clean data."
