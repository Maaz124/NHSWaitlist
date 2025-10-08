# Toolkit Builder Debugging Guide

## 🎯 **ISSUE**
The "Creating Your Personal Anxiety Toolkit" from Week 6 is not storing or displaying data properly.

## 🔍 **INVESTIGATION FINDINGS**

### ✅ **Component Structure**
- **Component**: `ToolkitBuilder` in `client/src/components/ToolkitBuilder.tsx`
- **Location**: Week 6 module, activity ID: `personal-toolkit`
- **Type**: Worksheet activity
- **Data Flow**: Frontend → API → Database

### ✅ **Data Structure**
The Toolkit Builder expects this data structure:
```json
{
  "emergency_techniques": {
    "breathing": [],
    "grounding": [],
    "relaxation": [],
    "selected": []
  },
  "daily_practices": {
    "morning": [],
    "throughout_day": [],
    "evening": [],
    "weekly": []
  },
  "thought_tools": {
    "identifying": [],
    "challenging": [],
    "balancing": [],
    "quick_questions": []
  },
  "behavioral_strategies": {
    "exposure_goal": "",
    "values_activity": "",
    "social_goal": "",
    "physical_plan": ""
  },
  "warning_signs": {
    "physical": [],
    "emotional": [],
    "behavioral": [],
    "personal_top3": []
  },
  "action_plan": {
    "early_signs": [],
    "multiple_signs": [],
    "emergency_contact": ""
  },
  "support_network": {
    "trusted_friend": "",
    "family_member": "",
    "professional": "",
    "helpful_apps": "",
    "resources": ""
  },
  "quick_reference": {
    "emergency_steps": [],
    "daily_practice": "",
    "emergency_contact": "",
    "reminder_phrases": []
  }
}
```

### ❌ **Current Database State**
```sql
SELECT id, week_number, title, user_progress FROM anxiety_modules WHERE week_number = 6;
-- Result: user_progress column is empty (NULL) for all Week 6 modules
```

## 🔧 **DEBUGGING STEPS IMPLEMENTED**

### ✅ **1. Frontend Debugging Added**
- **ToolkitBuilder Component**: Added console logging for data changes
- **Module Detail Page**: Added detailed logging for save operations
- **Mutation Handler**: Already has success/error logging

### ✅ **2. Backend Debugging Added**
- **Postgres Storage**: Added logging for update operations
- **API Route**: Already has error handling

### ✅ **3. Data Flow Tracking**
```javascript
// Frontend: Toolkit Builder data change
console.log('🔧 Toolkit Builder data changed:', toolkit);

// Frontend: onDataChange callback
console.log('💾 Toolkit Builder onDataChange called with:', data);

// Frontend: Mutation call
console.log('🚀 updateModuleMutation called with:', { moduleId, updates });

// Backend: Storage update
console.log('🔧 updateAnxietyModule called with:', { id, updates });
```

## 🧪 **TESTING INSTRUCTIONS**

### **Step 1: Access Week 6 Module**
1. Go to Anxiety Track → Week 6: Relapse Prevention & NHS Transition
2. Navigate to the "Creating Your Personal Anxiety Toolkit" activity
3. Open browser Developer Tools → Console tab

### **Step 2: Test Data Entry**
1. Fill in some data in the toolkit (any section)
2. Watch console for debug messages:
   ```
   🔧 Toolkit Builder data changed: {...}
   💾 Toolkit Builder onDataChange called with: {...}
   💾 Updated userProgress structure for toolkit: {...}
   💾 Saving Toolkit Builder data to module: {moduleId}
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
SELECT id, user_progress FROM anxiety_modules WHERE week_number = 6;
```

## 🚨 **POTENTIAL ISSUES TO CHECK**

### **1. Authentication Issues**
- User might not be properly authenticated
- Module might not belong to the user

### **2. Data Structure Issues**
- Toolkit Builder might not be triggering `onDataChange`
- Mutation might not be called
- API endpoint might be failing

### **3. Database Issues**
- JSONB column might have constraints
- Update operation might be failing silently
- Data might be getting overwritten

### **4. Timing Issues**
- Debounced save (1000ms) might be getting cleared
- Component might be unmounting before save

### **5. Week 6 Specific Issues**
- Week 6 module might not be properly initialized
- Module ID might be incorrect
- Activity ID mismatch

## 🔧 **MANUAL TEST COMMANDS**

### **Test Database Directly**
```sql
-- Check current state
SELECT id, week_number, title, user_progress FROM anxiety_modules WHERE week_number = 6;

-- Test update with sample data
UPDATE anxiety_modules 
SET user_progress = '{"personal-toolkit": {"worksheetData": {"test": "data"}}}' 
WHERE week_number = 6 
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
  -d '{"userProgress": {"personal-toolkit": {"worksheetData": {"test": "data"}}}}'
```

## 📋 **NEXT STEPS**

1. **Run the test** with debugging enabled
2. **Check console logs** for where the data flow breaks
3. **Verify database** after attempting to save
4. **Check server logs** for any errors
5. **Test with manual API call** if frontend fails

## 🎯 **EXPECTED OUTCOME**

After debugging, the Toolkit Builder should:
- ✅ Save data when user interacts with any section
- ✅ Persist data across page reloads
- ✅ Show data in the `user_progress` JSONB column
- ✅ Load saved data when returning to the toolkit

---

**Ready to test!** 🚀 Open Week 6 module and check the console for debug messages.

