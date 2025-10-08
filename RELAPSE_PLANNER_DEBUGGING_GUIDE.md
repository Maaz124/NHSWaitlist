# RelapsePlanner Data Persistence Debugging Guide

## 🎯 **Issue Fixed**
The "Relapse Prevention Plan" in Week 6 was not saving data properly when users marked the activity as complete. This was due to the debounced auto-save mechanism being cleared before execution.

## ✅ **Solution Implemented**
1. **Added Data Getter Callback**: RelapsePlanner now exposes its current state to the parent component
2. **Enhanced Activity Completion**: When the activity is marked complete, it automatically saves all current data
3. **Comprehensive Logging**: Added debug messages to track the save process

## 🧪 **How to Test**

### Step 1: Navigate to Week 6
- Go to Anxiety Track → Week 6: Relapse Prevention & NHS Transition
- Find the "Relapse Prevention Plan" activity

### Step 2: Fill in Data
- Select checkboxes in various sections
- Add text to input fields
- Fill out support contact information
- Add personal goals and plans

### Step 3: Mark Activity Complete
- Check the completion checkbox ✅
- Watch console for these debug messages:

```
📋 Relapse Planner data getter registered
🎯 Marking relapse-prevention-plan as complete - ensuring data is saved
💾 Getting current relapse data from component: {...}
💾 Relapse data found, ensuring it's saved before completion
🎯 Activity completion update: {...}
```

### Step 4: Verify Persistence
- Refresh the page
- Navigate away and come back
- Your data should persist!

## 🔍 **Expected Console Output**

### When Component Loads:
```
📋 Relapse Planner data getter registered
```

### When Activity is Marked Complete:
```
🎯 Marking relapse-prevention-plan as complete - ensuring data is saved
💾 Getting current relapse data from component: {
  highRiskSituations: [...],
  warningSigns: {...},
  actionPlans: {...},
  supportContacts: [...],
  longTermGoals: [...],
  resilienceHabits: [...],
  personalizedPlan: {...}
}
💾 Relapse data found, ensuring it's saved before completion
🎯 Activity completion update: {
  moduleId: "...",
  updates: {
    userProgress: {
      "relapse-prevention-plan": {
        completed: true,
        completedAt: "2024-...",
        worksheetData: {...},
        lastUpdated: "2024-..."
      }
    }
  }
}
```

## 🛠️ **Technical Details**

### Files Modified:
1. **`client/src/components/RelapsePlanner.tsx`**:
   - Added `onGetCurrentData` prop to interface
   - Added useEffect to expose current data to parent

2. **`client/src/pages/module-detail.tsx`**:
   - Added `relapseDataGetter` state
   - Enhanced `handleActivityComplete` to handle relapse-prevention-plan
   - Updated RelapsePlanner component call with data getter callback

### Data Flow:
1. User fills in RelapsePlanner data
2. Component exposes current data via `onGetCurrentData` callback
3. When activity completion checkbox is clicked:
   - `handleActivityComplete` is called
   - Gets current data from component using `relapseDataGetter`
   - Ensures data is saved before marking complete
   - Updates module progress with latest data

## 🚨 **Troubleshooting**

### If Data Still Not Saving:
1. Check console for error messages
2. Verify the data getter is registered (should see "📋 Relapse Planner data getter registered")
3. Check if the completion handler is being called (should see "🎯 Marking relapse-prevention-plan as complete")
4. Verify API calls are successful (check Network tab)

### If Console Messages Missing:
1. Make sure you're on the correct activity (relapse-prevention-plan)
2. Check that the component is properly mounted
3. Verify no JavaScript errors are blocking execution

## 🎉 **Success Indicators**
- ✅ Console shows all expected debug messages
- ✅ Data persists after page refresh
- ✅ Activity shows as completed
- ✅ No JavaScript errors in console
- ✅ API calls return success (200 status)

## 📝 **Notes**
- The fix ensures data is saved immediately when the activity is marked complete
- No manual save button needed - it's integrated into the completion checkbox
- Works alongside the existing debounced auto-save for real-time saving
- Same pattern as ToolkitBuilder for consistency
