# Values Assessment Worksheet Debugging Guide

## 🎯 **ISSUE**
The Values Assessment Worksheet from Week 5 (Behavioral Activation module) is not being stored properly.

## 🔍 **INVESTIGATION FINDINGS**

### ✅ **Data Structure Analysis**
The expected data structure is correct:
```json
{
  "values-assessment": {
    "worksheetData": {
      "lifeAreas": [...],
      "top3Values": [...],
      "valuesInAction": {...},
      "completionStatements": {...},
      "actionPlan": {...}
    },
    "lastUpdated": "timestamp"
  }
}
```

### ❌ **Current Database State**
```sql
SELECT id, week_number, title, user_progress FROM anxiety_modules WHERE week_number = 5;
-- Result: user_progress column is empty (NULL) for all Week 5 modules
```

## 🔧 **DEBUGGING STEPS IMPLEMENTED**

### ✅ **1. Frontend Debugging Added**
- **Values Worksheet Component**: Added console logging for data changes
- **Module Detail Page**: Added detailed logging for save operations
- **Mutation Handler**: Added success/error logging

### ✅ **2. Backend Debugging Added**
- **Postgres Storage**: Added logging for update operations
- **API Route**: Already has error handling

### ✅ **3. Data Flow Tracking**
```javascript
// Frontend: Values Worksheet data change
console.log('🔍 Values Worksheet data changed:', valuesData);

// Frontend: onDataChange callback
console.log('💾 Values Worksheet onDataChange called with:', data);

// Frontend: Mutation call
console.log('🚀 updateModuleMutation called with:', { moduleId, updates });

// Backend: Storage update
console.log('🔧 updateAnxietyModule called with:', { id, updates });
```

## 🧪 **TESTING INSTRUCTIONS**

### **Step 1: Access Week 5 Module**
1. Go to Anxiety Track → Week 5: Behavioral Activation
2. Navigate to the "Values Assessment Worksheet" activity
3. Open browser Developer Tools → Console tab

### **Step 2: Test Data Entry**
1. Fill in some data in the worksheet (any field)
2. Watch console for debug messages:
   ```
   🔍 Values Worksheet data changed: {...}
   💾 Values Worksheet onDataChange called with: {...}
   💾 Updated userProgress structure: {...}
   💾 Saving Values Worksheet data to module: {moduleId}
   🚀 updateModuleMutation called with: {...}
   ```

### **Step 3: Check Backend Logs**
1. Check server console for:
   ```
   🔧 updateAnxietyModule called with: {...}
   🔧 processedUpdates: {...}
   ✅ updateAnxietyModule result: {...}
   ```

### **Step 4: Verify Database**
```sql
SELECT id, user_progress FROM anxiety_modules WHERE week_number = 5;
```

## 🚨 **POTENTIAL ISSUES TO CHECK**

### **1. Authentication Issues**
- User might not be properly authenticated
- Module might not belong to the user

### **2. Data Structure Issues**
- Values Worksheet might not be triggering `onDataChange`
- Mutation might not be called
- API endpoint might be failing

### **3. Database Issues**
- JSONB column might have constraints
- Update operation might be failing silently
- Data might be getting overwritten

### **4. Timing Issues**
- Debounced save (1000ms) might be getting cleared
- Component might be unmounting before save

## 🔧 **MANUAL TEST COMMANDS**

### **Test Database Directly**
```sql
-- Check current state
SELECT id, week_number, title, user_progress FROM anxiety_modules WHERE week_number = 5;

-- Test update with sample data
UPDATE anxiety_modules 
SET user_progress = '{"values-assessment": {"worksheetData": {"test": "data"}}}' 
WHERE week_number = 5 
RETURNING id, user_progress;
```

### **Test API Endpoint**
```bash
# Get a module ID first
curl -X GET "http://localhost:3001/api/modules/{userId}" \
  -H "Cookie: connect.sid=your-session-cookie"

# Test update
curl -X PATCH "http://localhost:3001/api/modules/{moduleId}" \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-cookie" \
  -d '{"userProgress": {"values-assessment": {"worksheetData": {"test": "data"}}}}'
```

## 📋 **NEXT STEPS**

1. **Run the test** with debugging enabled
2. **Check console logs** for where the data flow breaks
3. **Verify database** after attempting to save
4. **Check server logs** for any errors
5. **Test with manual API call** if frontend fails

## 🎯 **EXPECTED OUTCOME**

After debugging, the Values Assessment Worksheet should:
- ✅ Save data when user types in any field
- ✅ Persist data across page reloads
- ✅ Show data in the `user_progress` JSONB column
- ✅ Load saved data when returning to the worksheet

---

**Ready to test!** 🚀 Open Week 5 module and check the console for debug messages.
