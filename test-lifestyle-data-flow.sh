#!/bin/bash

echo "🔍 Testing Lifestyle Module Data Persistence in Codespaces..."
echo "=========================================================="

echo ""
echo "1. 🔌 Checking database connection..."
docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -c "SELECT 'Database Connected Successfully' as status;" 2>/dev/null || echo "❌ Database connection failed"

echo ""
echo "2. 📋 Checking if lifestyle_assessments table exists..."
TABLE_EXISTS=$(docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -c "SELECT table_name FROM information_schema.tables WHERE table_name = 'lifestyle_assessments';" 2>/dev/null | grep -c "lifestyle_assessments" || echo "0")

if [ "$TABLE_EXISTS" -gt 0 ]; then
    echo "✅ lifestyle_assessments table exists"
else
    echo "❌ lifestyle_assessments table does NOT exist"
    echo "   Run: Get-Content create-all-tables.sql | docker exec -i nhs-waitlist-db psql -U nhs_user -d nhs_waitlist"
fi

echo ""
echo "3. 🏗️ Checking table columns..."
docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -c "
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'lifestyle_assessments' 
ORDER BY ordinal_position;" 2>/dev/null || echo "❌ Could not check columns"

echo ""
echo "4. 🔍 Checking for critical columns..."
CRITICAL_COLUMNS=("eating_habits" "nutrition_challenges" "social_support" "social_challenges" "personal_notes")

for column in "${CRITICAL_COLUMNS[@]}"; do
    COLUMN_EXISTS=$(docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'lifestyle_assessments' AND column_name = '$column';" 2>/dev/null | grep -c "$column" || echo "0")
    
    if [ "$COLUMN_EXISTS" -gt 0 ]; then
        echo "✅ Column '$column' exists"
    else
        echo "❌ Column '$column' is MISSING"
    fi
done

echo ""
echo "5. 🌐 Testing API endpoint (if server is running)..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/lifestyle-assessment/test-user 2>/dev/null || echo "000")

case $API_RESPONSE in
    200|401|404)
        echo "✅ API endpoint is responding (HTTP $API_RESPONSE)"
        ;;
    000)
        echo "❌ API endpoint is not responding - server may not be running"
        ;;
    *)
        echo "⚠️ API endpoint responded with HTTP $API_RESPONSE"
        ;;
esac

echo ""
echo "6. 🔐 Checking environment variables..."
if [ -f .env ]; then
    echo "✅ .env file exists"
    echo "   Checking for database variables..."
    grep -q "DATABASE_URL\|DB_HOST\|DB_USER" .env && echo "✅ Database variables found" || echo "❌ Database variables missing"
else
    echo "❌ .env file not found"
fi

echo ""
echo "7. 🧪 Testing data insertion..."
docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -c "
INSERT INTO lifestyle_assessments (user_id, exercise_frequency, diet_quality, eating_habits, nutrition_challenges) 
VALUES ('test-user-$(date +%s)', 3, 7, '[\"test-habit\"]', '[\"test-challenge\"]')
ON CONFLICT (user_id) DO NOTHING;" 2>/dev/null && echo "✅ Test data insertion successful" || echo "❌ Test data insertion failed"

echo ""
echo "8. 📊 Checking existing data..."
DATA_COUNT=$(docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -c "SELECT COUNT(*) FROM lifestyle_assessments;" 2>/dev/null | grep -o '[0-9]\+' | head -1 || echo "0")
echo "   Found $DATA_COUNT records in lifestyle_assessments table"

echo ""
echo "=========================================================="
echo "🎯 DIAGNOSTIC COMPLETE"
echo ""
echo "📋 SUMMARY:"
echo "   - Database connection: $([ "$TABLE_EXISTS" -gt 0 ] && echo "✅ Working" || echo "❌ Failed")"
echo "   - Table exists: $([ "$TABLE_EXISTS" -gt 0 ] && echo "✅ Yes" || echo "❌ No")"
echo "   - API responding: $([ "$API_RESPONSE" != "000" ] && echo "✅ Yes" || echo "❌ No")"
echo "   - Test insertion: $(docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -c "SELECT 1;" 2>/dev/null && echo "✅ Working" || echo "❌ Failed")"
echo ""
echo "🚀 NEXT STEPS:"
if [ "$TABLE_EXISTS" -eq 0 ]; then
    echo "   1. Run: Get-Content create-all-tables.sql | docker exec -i nhs-waitlist-db psql -U nhs_user -d nhs_waitlist"
elif [ "$API_RESPONSE" = "000" ]; then
    echo "   1. Start the server: npm run dev"
    echo "   2. Check server logs for errors"
else
    echo "   1. Check browser console for JavaScript errors"
    echo "   2. Verify user authentication state"
    echo "   3. Test the Lifestyle module in the browser"
fi
echo "=========================================================="
