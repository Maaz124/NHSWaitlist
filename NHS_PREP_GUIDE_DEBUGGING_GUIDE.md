# NHS Prep Guide Data Persistence Debugging Guide

## 🎯 **Issue Fixed**
The "Preparing for NHS Mental Health Services" activity in Week 6 had **no data persistence at all**. Users could fill in extensive preparation data including:
- Document preparation checklists
- Program summary information
- Assessment preparation data
- Treatment knowledge
- Ongoing preparation plans
- NHS readiness scores
- Advocacy preparation

But all this data was lost when users refreshed the page or navigated away.

## ✅ **Solution Implemented**
1. **Added Data Persistence Props**: NhsPrepGuide now accepts `initialData`, `onDataChange`, `onSave`, and `onGetCurrentData` props
2. **Enhanced Data Loading**: Component now loads saved data when returning to the page
3. **Auto-Save Integration**: Real-time saving with debounced API calls
4. **Activity Completion Integration**: Data is automatically saved when activity is marked complete
5. **Comprehensive Logging**: Added debug messages to track the save process

## 🧪 **How to Test**

### Step 1: Navigate to Week 6
- Go to Anxiety Track → Week 6: Relapse Prevention & NHS Transition
- Find the "Preparing for NHS Mental Health Services" activity

### Step 2: Fill in Data
The component has multiple tabs with extensive data collection:
- **Documents Tab**: Checkboxes for GP referral, medication list, etc.
- **Program Summary Tab**: Text areas for helpful techniques, successful situations
- **Assessment Prep Tab**: Lists of symptoms, triggers, coping strategies
- **Treatment Knowledge Tab**: Understanding of CBT, medication questions
- **Ongoing Prep Tab**: Daily practices, social connections, learning resources
- **Readiness Tab**: Slider ratings for various readiness aspects
- **Advocacy Tab**: Treatment preferences, previous experiences, concerns

### Step 3: Mark Activity Complete
- Check the completion checkbox ✅
- Watch console for these debug messages:

```
📋 NHS Prep Guide data getter registered
🎯 Marking nhs-transition-prep as complete - ensuring data is saved
💾 Getting current NHS data from component: {...}
💾 NHS data found, ensuring it's saved before completion
🎯 Activity completion update: {...}
```

### Step 4: Verify Persistence
- Refresh the page
- Navigate away and come back
- All your NHS preparation data should persist!

## 🔍 **Expected Console Output**

### When Component Loads:
```
📋 NHS Prep Guide data getter registered
```

### When Activity is Marked Complete:
```
🎯 Marking nhs-transition-prep as complete - ensuring data is saved
💾 Getting current NHS data from component: {
  documentPrep: {
    gpReferral: true,
    medicationList: "List of medications...",
    programSummary: "Summary of 6-week program...",
    personalToolkit: "My personal toolkit...",
    previousRecords: "Previous records...",
    questionsList: ["Question 1", "Question 2"]
  },
  programSummary: {
    helpfulTechniques: ["Breathing", "Mindfulness"],
    successfulSituations: ["Public speaking", "Job interview"],
    supportNeeded: ["Continued therapy", "Medication review"],
    currentFunctioning: "Much improved...",
    treatmentGoals: ["Reduce anxiety", "Build confidence"]
  },
  assessmentPrep: {
    symptoms: ["Panic attacks", "Worry"],
    triggers: ["Work stress", "Social situations"],
    copingStrategies: ["Deep breathing", "Grounding"],
    progressMade: "Significant progress...",
    challenges: "Still working on...",
    values: "Family, career, health",
    supportSystems: "Family, friends, therapist"
  },
  treatmentKnowledge: {
    cbtUnderstanding: "Understanding of CBT...",
    otherTherapies: ["ACT", "Mindfulness"],
    medicationQuestions: ["Side effects?", "Duration?"],
    groupTherapyInterest: "Interested in group therapy",
    treatmentPreferences: "Prefer individual therapy"
  },
  ongoingPrep: {
    dailyPractices: ["Morning routine", "Exercise"],
    socialConnections: ["Family time", "Friends"],
    learningResources: ["Books", "Apps"],
    progressMonitoring: "Daily journal"
  },
  nhsReadiness: {
    independentTools: 8,
    handleSetbacks: 7,
    maintainProgress: 8,
    transitionReadiness: 9,
    continueJourney: 8,
    confidence: "Feeling confident about NHS transition"
  },
  advocacyPrep: {
    treatmentPreferences: "Prefer evidence-based approaches",
    previousExperiences: "Previous therapy experience...",
    concerns: "Worried about wait times",
    supportPerson: "Partner will attend appointments",
    questions: ["How long is wait?", "What treatments available?"]
  }
}
💾 NHS data found, ensuring it's saved before completion
🎯 Activity completion update: {
  moduleId: "...",
  updates: {
    userProgress: {
      "nhs-transition-prep": {
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
1. **`client/src/components/NhsPrepGuide.tsx`**:
   - Added `NhsPrepGuideProps` interface with data persistence props
   - Added `useEffect` imports
   - Added initial data loading logic
   - Added auto-save with debounced API calls
   - Added data getter callback for activity completion

2. **`client/src/pages/module-detail.tsx`**:
   - Added `nhsDataGetter` state
   - Enhanced `handleActivityComplete` to handle `nhs-transition-prep`
   - Updated NhsPrepGuide component call with data persistence props

### Data Structure:
The component collects extensive data across 7 main categories:
- `documentPrep`: Document preparation checklists
- `programSummary`: 6-week program summary information
- `assessmentPrep`: Assessment preparation data
- `treatmentKnowledge`: Treatment knowledge and preferences
- `ongoingPrep`: Ongoing preparation plans
- `nhsReadiness`: Readiness scores (1-10 scales)
- `advocacyPrep`: Advocacy and self-advocacy preparation

### Data Flow:
1. User fills in NHS preparation data across multiple tabs
2. Component auto-saves data with 1-second debounce
3. When activity completion checkbox is clicked:
   - `handleActivityComplete` is called
   - Gets current data from component using `nhsDataGetter`
   - Ensures data is saved before marking complete
   - Updates module progress with latest data

## 🚨 **Troubleshooting**

### If Data Still Not Saving:
1. Check console for error messages
2. Verify the data getter is registered (should see "📋 NHS Prep Guide data getter registered")
3. Check if the completion handler is being called (should see "🎯 Marking nhs-transition-prep as complete")
4. Verify API calls are successful (check Network tab)

### If Console Messages Missing:
1. Make sure you're on the correct activity (nhs-transition-prep)
2. Check that the component is properly mounted
3. Verify no JavaScript errors are blocking execution

### If Specific Tabs Not Saving:
1. Check if you're switching between tabs (data should auto-save)
2. Verify the specific tab data is included in the console output
3. Check if there are any validation errors preventing saves

## 🎉 **Success Indicators**
- ✅ Console shows all expected debug messages
- ✅ Data persists after page refresh across all tabs
- ✅ Activity shows as completed
- ✅ No JavaScript errors in console
- ✅ API calls return success (200 status)
- ✅ All 7 data categories are saved and loaded correctly

## 📝 **Notes**
- The fix ensures all NHS preparation data is saved immediately when the activity is marked complete
- Works alongside the existing debounced auto-save for real-time saving
- Same pattern as ToolkitBuilder and RelapsePlanner for consistency
- Comprehensive data collection across multiple tabs and categories
- Ready for NHS transition with all preparation data preserved

## 🏥 **NHS Preparation Benefits**
With data persistence now working, users can:
- Build a comprehensive NHS preparation document over time
- Track their readiness scores and progress
- Prepare detailed questions for their NHS assessment
- Document their 6-week program achievements
- Create a personalized advocacy plan
- Maintain all preparation data for their NHS transition
