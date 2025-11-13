import jsPDF from 'jspdf';
import type { User, OnboardingResponse, WeeklyAssessment, AnxietyModule, MoodEntry } from '@shared/schema';
import type { ModuleSummary, ModuleActivitySummary } from './moduleSummary';

interface ReportData {
  user: User;
  onboarding: OnboardingResponse;
  assessments: WeeklyAssessment[];
  modules: AnxietyModule[];
  generatedAt: Date | string;
}

export function generateProgressReport(data: ReportData): jsPDF {
  try {
    
    // Validate required data
    if (!data.user) {
      throw new Error("User data is required for report generation");
    }
    if (!data.onboarding) {
      throw new Error("Onboarding data is required for report generation");
    }
    
    const doc = new jsPDF();
    let yPos = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Waitlist Companion™ Progress Report', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Interim Care Support - Clinical Handoff Document', 20, yPos);
  yPos += 20;
  
  // Patient Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.user.firstName} ${data.user.lastName}`, 20, yPos);
  yPos += 6;
  doc.text(`Email: ${data.user.email}`, 20, yPos);
  yPos += 6;
  if (data.user.nhsNumber) {
    doc.text(`NHS Number: ${data.user.nhsNumber}`, 20, yPos);
    yPos += 6;
  }
  doc.text(`Report Generated: ${new Date(data.generatedAt).toLocaleDateString('en-GB')}`, 20, yPos);
  yPos += 15;
  
  // Baseline Assessment
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Baseline Assessment', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Initial Risk Score: ${data.onboarding.riskScore}/15`, 20, yPos);
  yPos += 6;
  doc.text(`Baseline Anxiety Level: ${data.onboarding.baselineAnxietyLevel}`, 20, yPos);
  yPos += 6;
  doc.text(`Completed: ${data.onboarding.completedAt ? new Date(data.onboarding.completedAt).toLocaleDateString('en-GB') : 'Not completed'}`, 20, yPos);
  yPos += 15;
  
  // Weekly Assessments
  if (data.assessments.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Risk Assessments', 20, yPos);
    yPos += 10;
    
    data.assessments.forEach((assessment, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Week ${assessment.weekNumber}: Risk Score ${assessment.riskScore}/15 (${assessment.riskLevel})`, 20, yPos);
      yPos += 6;
      doc.text(`Completed: ${assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString('en-GB') : 'Not completed'}`, 25, yPos);
      yPos += 8;
    });
    yPos += 10;
  }
  
  // Module Progress
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('6-Week Anxiety Support Track Progress', 20, yPos);
  yPos += 10;
  
  if (data.modules && data.modules.length > 0) {
    const completedModules = data.modules.filter(m => m.completedAt);
    const totalMinutes = data.modules.reduce((sum, m) => sum + (m.minutesCompleted || 0), 0);
    const totalEstimatedMinutes = data.modules.reduce((sum, m) => sum + (m.estimatedMinutes || 0), 0);
    const completionRate = totalEstimatedMinutes > 0 ? Math.round((totalMinutes / totalEstimatedMinutes) * 100) : 0;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Overall Completion: ${completionRate}% (${totalMinutes}/${totalEstimatedMinutes} minutes)`, 20, yPos);
    yPos += 6;
    doc.text(`Modules Completed: ${completedModules.length}/${data.modules.length}`, 20, yPos);
    yPos += 10;
    
    data.modules.forEach((module, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(`Week ${module.weekNumber}: ${module.title}`, 20, yPos);
      yPos += 6;
      const status = module.completedAt ? 'Completed' : module.isLocked ? 'Locked' : 'In Progress';
      doc.text(`Status: ${status} | Progress: ${module.minutesCompleted || 0}/${module.estimatedMinutes || 0} min`, 25, yPos);
      yPos += 8;
    });
  } else {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Module Progress: No modules started yet', 20, yPos);
    yPos += 6;
    doc.text('Patient has completed initial assessment but not yet started the 6-week program', 20, yPos);
    yPos += 10;
  }
  
  // Clinical Recommendations
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }
  
  yPos += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Clinical Recommendations', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const latestRisk = data.assessments && data.assessments.length > 0 ? data.assessments[0]?.riskLevel : data.onboarding.baselineAnxietyLevel;
  
  if (latestRisk === "crisis" || latestRisk === "high") {
    doc.text('• URGENT: High risk profile requires immediate clinical assessment', 20, yPos);
    yPos += 6;
    doc.text('• Consider expedited appointment or crisis intervention', 20, yPos);
    yPos += 6;
  } else if (latestRisk === "moderate") {
    doc.text('• Moderate risk profile suitable for standard IAPT referral', 20, yPos);
    yPos += 6;
    doc.text('• Patient has engaged well with interim support materials', 20, yPos);
    yPos += 6;
  } else {
    doc.text('• Low risk profile with good engagement in self-help materials', 20, yPos);
    yPos += 6;
    doc.text('• Consider group therapy or lower intensity interventions', 20, yPos);
    yPos += 6;
  }
  
  doc.text('• Patient demonstrates commitment to recovery through app engagement', 20, yPos);
  yPos += 6;
  doc.text('• Recommend continuity of cognitive-behavioral approaches', 20, yPos);
  
  if (!data.modules || data.modules.length === 0) {
    doc.text('• Patient has completed initial assessment - recommend starting 6-week program', 20, yPos);
    yPos += 6;
    doc.text('• Consider guided introduction to anxiety management techniques', 20, yPos);
    yPos += 6;
  } else if (data.assessments && data.assessments.length === 0) {
    doc.text('• Patient has started 6-week program - monitor progress with weekly assessments', 20, yPos);
    yPos += 6;
  }
  
  return doc;
  
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

interface MoodEntriesReportData {
  user: User;
  entries: MoodEntry[];
  generatedAt: Date;
}

export function generateMoodEntriesReport(data: MoodEntriesReportData): jsPDF {
  const doc = new jsPDF();
  let yPos = 20;
  let pageCount = 1;
  
  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPos + requiredSpace > 280) {
      doc.addPage();
      pageCount++;
      yPos = 20;
      // Add header to new page
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Mood Tracker Report - Page ${pageCount}`, 20, 10);
      doc.text(`${data.user.firstName} ${data.user.lastName}`, 160, 10);
    }
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Mood Tracker Report', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Daily Mood & Wellbeing Tracking', 20, yPos);
  yPos += 20;
  
  // Patient Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.user.firstName} ${data.user.lastName}`, 20, yPos);
  yPos += 6;
  doc.text(`Email: ${data.user.email}`, 20, yPos);
  yPos += 6;
  doc.text(`Report Generated: ${data.generatedAt.toLocaleDateString('en-GB')}`, 20, yPos);
  yPos += 6;
  doc.text(`Total Entries: ${data.entries.length}`, 20, yPos);
  yPos += 15;

  // Summary Statistics
  if (data.entries.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', 20, yPos);
    yPos += 10;
    
    const avgMood = (data.entries.reduce((sum, e) => sum + e.mood, 0) / data.entries.length).toFixed(1);
    const avgEnergy = (data.entries.reduce((sum, e) => sum + e.energy, 0) / data.entries.length).toFixed(1);
    const avgAnxiety = (data.entries.reduce((sum, e) => sum + e.anxiety, 0) / data.entries.length).toFixed(1);
    const avgSleep = (data.entries.reduce((sum, e) => sum + e.sleep, 0) / data.entries.length).toFixed(1);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Average Mood: ${avgMood}/10`, 20, yPos);
    yPos += 6;
    doc.text(`Average Energy: ${avgEnergy}/10`, 20, yPos);
    yPos += 6;
    doc.text(`Average Anxiety: ${avgAnxiety}/10`, 20, yPos);
    yPos += 6;
    doc.text(`Average Sleep: ${avgSleep}/10`, 20, yPos);
    yPos += 15;
  }

  // Individual Entries
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Daily Entries', 20, yPos);
  yPos += 10;

  // Sort entries by date (newest first)
  const sortedEntries = [...data.entries].sort((a, b) => 
    new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
  );

  sortedEntries.forEach((entry, index) => {
    checkPageBreak(60); // Check if we need a new page
    
    // Entry header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const entryDate = new Date(entry.entryDate).toLocaleDateString('en-GB');
    doc.text(`Entry ${index + 1} - ${entryDate}`, 20, yPos);
    yPos += 8;
    
    // Mood scores in a table-like format
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Mood Scores:', 20, yPos);
    yPos += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Mood: ${entry.mood}/10`, 30, yPos);
    doc.text(`Energy: ${entry.energy}/10`, 80, yPos);
    doc.text(`Anxiety: ${entry.anxiety}/10`, 130, yPos);
    doc.text(`Sleep: ${entry.sleep}/10`, 180, yPos);
    yPos += 8;
    
    // Emotions
    if (entry.emotions && entry.emotions.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Emotions:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const emotionsText = entry.emotions.join(', ');
      const emotionsLines = doc.splitTextToSize(emotionsText, 170);
      doc.text(emotionsLines, 30, yPos);
      yPos += emotionsLines.length * 4 + 4;
    }
    
    // Activities
    if (entry.activities && entry.activities.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Activities:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const activitiesText = entry.activities.join(', ');
      const activitiesLines = doc.splitTextToSize(activitiesText, 170);
      doc.text(activitiesLines, 30, yPos);
      yPos += activitiesLines.length * 4 + 4;
    }
    
    // Thoughts
    if (entry.thoughts && entry.thoughts.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.text('Key Thoughts:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const thoughtsLines = doc.splitTextToSize(entry.thoughts, 170);
      doc.text(thoughtsLines, 30, yPos);
      yPos += thoughtsLines.length * 4 + 4;
    }
    
    // Gratitude
    if (entry.gratitude && entry.gratitude.length > 0 && entry.gratitude.some(g => g.trim())) {
      doc.setFont('helvetica', 'bold');
      doc.text('Gratitude:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const gratitudeItems = entry.gratitude.filter(g => g.trim());
      gratitudeItems.forEach((item, i) => {
        doc.text(`• ${item}`, 30, yPos);
        yPos += 4;
      });
      yPos += 4;
    }
    
    // Challenges
    if (entry.challenges && entry.challenges.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.text('Challenges:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const challengesLines = doc.splitTextToSize(entry.challenges, 170);
      doc.text(challengesLines, 30, yPos);
      yPos += challengesLines.length * 4 + 4;
    }
    
    // Wins
    if (entry.wins && entry.wins.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.text('Wins:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const winsLines = doc.splitTextToSize(entry.wins, 170);
      doc.text(winsLines, 30, yPos);
      yPos += winsLines.length * 4 + 4;
    }
    
    // Notes
    if (entry.notes && entry.notes.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Notes:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(entry.notes, 170);
      doc.text(notesLines, 30, yPos);
      yPos += notesLines.length * 4 + 4;
    }
    
    yPos += 10; // Space between entries
  });

  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Waitlist Companion™', 20, 285);
  doc.text(`Page ${pageCount}`, 160, 285);
  
  return doc;
}

interface NhsPrepData {
  documentPrep: any;
  programSummary: any;
  assessmentPrep: any;
  treatmentKnowledge: any;
  ongoingPrep: any;
  nhsReadiness: any;
  advocacyPrep: any;
  overallReadiness: number;
  completeness: number;
  createdDate: string;
  version: string;
}

export function generateNhsPrepReport(data: NhsPrepData): jsPDF {
  try {
    
    const doc = new jsPDF();
    let yPos = 20;
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number = 20) => {
      if (yPos + requiredSpace > 280) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('NHS Mental Health Services Preparation Guide', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Complete Transition Preparation Document', 20, yPos);
    yPos += 15;
    
    // Overview Stats
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Preparation Overview', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Overall Preparation Complete: ${data.completeness}%`, 20, yPos);
    yPos += 6;
    doc.text(`NHS Readiness Score: ${data.overallReadiness}%`, 20, yPos);
    yPos += 6;
    doc.text(`Skills & Strategies Collected: ${data.programSummary.helpfulTechniques?.length || 0 + data.assessmentPrep.copingStrategies?.length || 0}`, 20, yPos);
    yPos += 6;
    doc.text(`Report Generated: ${new Date(data.createdDate).toLocaleDateString('en-GB')}`, 20, yPos);
    yPos += 15;

    // Document Preparation
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Document Preparation Checklist', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    if (data.documentPrep.gpReferral) doc.text('✓ GP referral letter ready', 25, yPos);
    else doc.text('☐ GP referral letter needed', 25, yPos);
    yPos += 6;
    
    if (data.documentPrep.medicationList) doc.text('✓ Current medication list prepared', 25, yPos);
    else doc.text('☐ Current medication list needed', 25, yPos);
    yPos += 6;
    
    if (data.documentPrep.programSummary) doc.text('✓ 6-week program summary completed', 25, yPos);
    else doc.text('☐ 6-week program summary needed', 25, yPos);
    yPos += 6;
    
    if (data.documentPrep.personalToolkit) doc.text('✓ Personal anxiety toolkit documented', 25, yPos);
    else doc.text('☐ Personal anxiety toolkit needed', 25, yPos);
    yPos += 6;
    
    if (data.documentPrep.previousRecords) doc.text('✓ Previous mental health records gathered', 25, yPos);
    else doc.text('☐ Previous mental health records needed', 25, yPos);
    yPos += 6;
    
    if (data.documentPrep.questionsList?.length > 0) doc.text(`✓ ${data.documentPrep.questionsList.length} questions prepared for assessment`, 25, yPos);
    else doc.text('☐ Questions for assessment needed', 25, yPos);
    yPos += 15;

    // Program Summary
    checkPageBreak(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('6-Week Program Summary', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (data.programSummary.helpfulTechniques?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Most Helpful Techniques:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.programSummary.helpfulTechniques.forEach((technique: string) => {
        doc.text(`• ${technique}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    
    if (data.programSummary.successfulSituations?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Successfully Managed Situations:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.programSummary.successfulSituations.forEach((situation: string) => {
        doc.text(`• ${situation}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    
    if (data.programSummary.supportNeeded?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Areas Still Needing Support:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.programSummary.supportNeeded.forEach((area: string) => {
        doc.text(`• ${area}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    
    if (data.programSummary.currentFunctioning) {
      doc.setFont('helvetica', 'bold');
      doc.text('Current Functioning Level:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const functioningLines = doc.splitTextToSize(data.programSummary.currentFunctioning, 170);
      doc.text(functioningLines, 25, yPos);
      yPos += functioningLines.length * 4 + 5;
    }
    
    if (data.programSummary.treatmentGoals?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Treatment Goals:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.programSummary.treatmentGoals.forEach((goal: string) => {
        doc.text(`• ${goal}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    yPos += 10;

    // Assessment Preparation
    checkPageBreak(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Preparation', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (data.assessmentPrep.symptoms?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Current Symptoms:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.assessmentPrep.symptoms.forEach((symptom: string) => {
        doc.text(`• ${symptom}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    
    if (data.assessmentPrep.triggers?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Identified Triggers:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.assessmentPrep.triggers.forEach((trigger: string) => {
        doc.text(`• ${trigger}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    
    if (data.assessmentPrep.copingStrategies?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Effective Coping Strategies:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.assessmentPrep.copingStrategies.forEach((strategy: string) => {
        doc.text(`• ${strategy}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    
    if (data.assessmentPrep.progressMade) {
      doc.setFont('helvetica', 'bold');
      doc.text('Progress Made:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const progressLines = doc.splitTextToSize(data.assessmentPrep.progressMade, 170);
      doc.text(progressLines, 25, yPos);
      yPos += progressLines.length * 4 + 5;
    }
    
    if (data.assessmentPrep.challenges) {
      doc.setFont('helvetica', 'bold');
      doc.text('Current Challenges:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const challengesLines = doc.splitTextToSize(data.assessmentPrep.challenges, 170);
      doc.text(challengesLines, 25, yPos);
      yPos += challengesLines.length * 4 + 5;
    }
    
    if (data.assessmentPrep.values) {
      doc.setFont('helvetica', 'bold');
      doc.text('Personal Values:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const valuesLines = doc.splitTextToSize(data.assessmentPrep.values, 170);
      doc.text(valuesLines, 25, yPos);
      yPos += valuesLines.length * 4 + 5;
    }
    
    if (data.assessmentPrep.supportSystems) {
      doc.setFont('helvetica', 'bold');
      doc.text('Support Systems:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const supportLines = doc.splitTextToSize(data.assessmentPrep.supportSystems, 170);
      doc.text(supportLines, 25, yPos);
      yPos += supportLines.length * 4 + 5;
    }
    yPos += 10;

    // NHS Readiness Scores
    checkPageBreak(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NHS Transition Readiness Assessment', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Independent Tool Usage: ${data.nhsReadiness.independentTools}/10`, 20, yPos);
    yPos += 6;
    doc.text(`Handling Setbacks: ${data.nhsReadiness.handleSetbacks}/10`, 20, yPos);
    yPos += 6;
    doc.text(`Maintaining Progress: ${data.nhsReadiness.maintainProgress}/10`, 20, yPos);
    yPos += 6;
    doc.text(`Transition Readiness: ${data.nhsReadiness.transitionReadiness}/10`, 20, yPos);
    yPos += 6;
    doc.text(`Continuing Journey: ${data.nhsReadiness.continueJourney}/10`, 20, yPos);
    yPos += 6;
    
    if (data.nhsReadiness.confidence) {
      doc.setFont('helvetica', 'bold');
      doc.text('Confidence Notes:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const confidenceLines = doc.splitTextToSize(data.nhsReadiness.confidence, 170);
      doc.text(confidenceLines, 25, yPos);
      yPos += confidenceLines.length * 4 + 5;
    }
    yPos += 10;

    // Treatment Knowledge
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Treatment Knowledge & Preferences', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (data.treatmentKnowledge.cbtUnderstanding) {
      doc.setFont('helvetica', 'bold');
      doc.text('CBT Understanding:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const cbtLines = doc.splitTextToSize(data.treatmentKnowledge.cbtUnderstanding, 170);
      doc.text(cbtLines, 25, yPos);
      yPos += cbtLines.length * 4 + 5;
    }
    
    if (data.treatmentKnowledge.otherTherapies?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Interest in Other Therapies:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.treatmentKnowledge.otherTherapies.forEach((therapy: string) => {
        doc.text(`• ${therapy}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    
    if (data.treatmentKnowledge.medicationQuestions?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Medication Questions:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.treatmentKnowledge.medicationQuestions.forEach((question: string) => {
        doc.text(`• ${question}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    
    if (data.treatmentKnowledge.groupTherapyInterest) {
      doc.setFont('helvetica', 'bold');
      doc.text('Group Therapy Interest:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const groupLines = doc.splitTextToSize(data.treatmentKnowledge.groupTherapyInterest, 170);
      doc.text(groupLines, 25, yPos);
      yPos += groupLines.length * 4 + 5;
    }
    
    if (data.treatmentKnowledge.treatmentPreferences) {
      doc.setFont('helvetica', 'bold');
      doc.text('Treatment Preferences:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const prefLines = doc.splitTextToSize(data.treatmentKnowledge.treatmentPreferences, 170);
      doc.text(prefLines, 25, yPos);
      yPos += prefLines.length * 4 + 5;
    }
    yPos += 10;

    // Advocacy Preparation
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Advocacy & Self-Advocacy Preparation', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (data.advocacyPrep.treatmentPreferences) {
      doc.setFont('helvetica', 'bold');
      doc.text('Treatment Preferences:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const prefLines = doc.splitTextToSize(data.advocacyPrep.treatmentPreferences, 170);
      doc.text(prefLines, 25, yPos);
      yPos += prefLines.length * 4 + 5;
    }
    
    if (data.advocacyPrep.previousExperiences) {
      doc.setFont('helvetica', 'bold');
      doc.text('Previous Mental Health Experiences:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const expLines = doc.splitTextToSize(data.advocacyPrep.previousExperiences, 170);
      doc.text(expLines, 25, yPos);
      yPos += expLines.length * 4 + 5;
    }
    
    if (data.advocacyPrep.concerns) {
      doc.setFont('helvetica', 'bold');
      doc.text('Concerns About NHS Services:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const concernLines = doc.splitTextToSize(data.advocacyPrep.concerns, 170);
      doc.text(concernLines, 25, yPos);
      yPos += concernLines.length * 4 + 5;
    }
    
    if (data.advocacyPrep.supportPerson) {
      doc.setFont('helvetica', 'bold');
      doc.text('Support Person for Appointments:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const supportLines = doc.splitTextToSize(data.advocacyPrep.supportPerson, 170);
      doc.text(supportLines, 25, yPos);
      yPos += supportLines.length * 4 + 5;
    }
    
    if (data.advocacyPrep.questions?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Questions for Assessment:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      data.advocacyPrep.questions.forEach((question: string) => {
        doc.text(`• ${question}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }
    yPos += 10;

    // Footer
    checkPageBreak(20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Waitlist Companion™ NHS Preparation Guide', 20, 285);
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, 160, 285);
    
    return doc;
    
  } catch (error) {
    throw new Error(`NHS Prep PDF generation failed: ${error.message}`);
  }
}

// --- Module Progress Reporting Helpers ---

type ModuleProgressPayload = {
  user: User;
  module: any;
  summary: ModuleSummary;
  notes?: string;
};

type ModuleCollectionPayload = {
  user: User;
  modules: Array<{
    module: any;
    summary: ModuleSummary;
    notes?: string;
  }>;
};

type PdfWriter = {
  doc: jsPDF;
  margin: number;
  lineHeight: number;
  pageHeight: number;
  pageWidth: number;
  getY: () => number;
  setY: (value: number) => void;
  ensureSpace: (height?: number) => void;
  addGap: (height?: number) => void;
  addText: (text: string, options?: { bold?: boolean; indent?: number; fontSize?: number }) => void;
};

const formatKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return formatDateValue(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === "string" || typeof entry === "number")) {
      return value.join(", ");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
};

const formatDateValue = (value: string | Date): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatActivityType = (type?: string) => {
  if (!type) return "Activity";
  switch (type) {
    case "reading":
      return "Reading";
    case "worksheet":
      return "Worksheet";
    case "reflection":
      return "Reflection";
    case "exercise":
      return "Exercise";
    case "breathing":
      return "Breathing";
    case "assessment":
      return "Assessment";
    default:
      return formatKey(type);
  }
};

const createWriter = (doc: jsPDF): PdfWriter => {
  const margin = 20;
  const lineHeight = 6;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableHeight = doc.internal.pageSize.getHeight() - margin;
  let y = margin;

  const ensureSpace = (height = lineHeight) => {
    if (y + height > usableHeight) {
      doc.addPage();
      y = margin;
    }
  };

  const addGap = (height = lineHeight) => {
    ensureSpace(height);
    y += height;
  };

  const addText = (
    text: string,
    { bold = false, indent = 0, fontSize = 11 }: { bold?: boolean; indent?: number; fontSize?: number } = {}
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    const indentOffset = indent * 4;
    const maxWidth = pageWidth - margin - indentOffset;
    const lines = doc.splitTextToSize(text, maxWidth);
    const lineAdvance = fontSize > 11 ? lineHeight * (fontSize / 11) : lineHeight;

    lines.forEach((line) => {
      ensureSpace(lineAdvance);
      doc.text(line, margin + indentOffset, y);
      y += lineAdvance;
    });
  };

  return {
    doc,
    margin,
    lineHeight,
    pageHeight: usableHeight,
    pageWidth,
    getY: () => y,
    setY: (value: number) => {
      y = value;
    },
    ensureSpace,
    addGap,
    addText,
  };
};

const renderKeyValue = (writer: PdfWriter, data: any, indent = 0) => {
  if (data === null || data === undefined) {
    return;
  }

  if (typeof data !== "object" || data instanceof Date) {
    writer.addText(formatValue(data), { indent });
    return;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      writer.addText("None", { indent });
      return;
    }
    data.forEach((entry, index) => {
      if (typeof entry === "object" && entry !== null) {
        writer.addText(`- Item ${index + 1}`, { indent });
        renderKeyValue(writer, entry, indent + 1);
      } else {
        writer.addText(`- ${formatValue(entry)}`, { indent });
      }
    });
    return;
  }

  const entries = Object.entries(data as Record<string, any>);
  if (entries.length === 0) {
    writer.addText("None", { indent });
    return;
  }

  entries.forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === "string" && value.trim() === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return;

    if (typeof value === "object" && value !== null) {
      writer.addText(`${formatKey(key)}:`, { indent, bold: false });
      renderKeyValue(writer, value, indent + 1);
    } else {
      writer.addText(`${formatKey(key)}: ${formatValue(value)}`, { indent });
    }
  });
};

const renderProgressDetails = (writer: PdfWriter, progress: any) => {
  if (!progress || typeof progress !== "object") {
    writer.addText("No user responses recorded yet.", { indent: 1 });
    return;
  }

  const handled = new Set<string>();
  if (typeof progress.completed !== "undefined") {
    writer.addText(`Completed: ${progress.completed ? "Yes" : "No"}`, { indent: 1 });
    handled.add("completed");
  }
  if (progress.completedAt) {
    writer.addText(`Completed At: ${formatDateValue(progress.completedAt)}`, { indent: 1 });
    handled.add("completedAt");
  }
  if (progress.lastUpdated) {
    writer.addText(`Last Updated: ${formatDateValue(progress.lastUpdated)}`, { indent: 1 });
    handled.add("lastUpdated");
  }
  if (progress.notes) {
    writer.addText(`Notes: ${formatValue(progress.notes)}`, { indent: 1 });
    handled.add("notes");
  }

  if (progress.reflectionData && Object.keys(progress.reflectionData).length > 0) {
    writer.addText("Reflections:", { indent: 1, bold: true });
    renderKeyValue(writer, progress.reflectionData, 2);
    handled.add("reflectionData");
  }

  if (progress.worksheetData && Object.keys(progress.worksheetData).length > 0) {
    writer.addText("Worksheet Responses:", { indent: 1, bold: true });
    renderKeyValue(writer, progress.worksheetData, 2);
    handled.add("worksheetData");
  }

  Object.entries(progress).forEach(([key, value]) => {
    if (handled.has(key)) return;
    if (value === null || value === undefined) return;
    if (typeof value === "string" && value.trim() === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return;

    if (typeof value === "object") {
      writer.addText(`${formatKey(key)}:`, { indent: 1, bold: true });
      renderKeyValue(writer, value, 2);
    } else {
      writer.addText(`${formatKey(key)}: ${formatValue(value)}`, { indent: 1 });
    }
  });
};

const renderModuleSection = (
  writer: PdfWriter,
  payload: { module: any; summary: ModuleSummary; notes?: string },
  options: { includeObjectives?: boolean } = {}
) => {
  const { module, summary, notes } = payload;
  const includeObjectives = options.includeObjectives !== false;
  const userProgress = module?.userProgress || {};
  const handledActivityKeys = new Set<string>();

  writer.doc.setFont("helvetica", "bold");
  writer.doc.setFontSize(14);
  writer.ensureSpace(10);
  writer.doc.text(`Week ${summary.weekNumber}: ${summary.title}`, writer.margin, writer.getY());
  writer.setY(writer.getY() + writer.lineHeight);
  writer.doc.setFont("helvetica", "normal");
  writer.doc.setFontSize(11);

  writer.addText(summary.description);

  if (typeof module.estimatedMinutes !== "undefined") {
    writer.addText(`Estimated Minutes: ${module.estimatedMinutes}`);
  }
  if (typeof module.activitiesCompleted !== "undefined") {
    const totalActivities = summary.activities.length || module.activitiesTotal || "—";
    writer.addText(`Activities Completed: ${module.activitiesCompleted}/${totalActivities}`);
  }
  if (typeof module.minutesCompleted !== "undefined") {
    writer.addText(`Minutes Logged: ${module.minutesCompleted}`);
  }
  if (module.completedAt) {
    writer.addText(`Module Completed: ${formatDateValue(module.completedAt)}`);
  }
  writer.addGap();

  if (includeObjectives && summary.objectives.length > 0) {
    writer.addText("Learning Objectives", { bold: true });
    summary.objectives.forEach((objective) => {
      writer.addText(`• ${objective}`, { indent: 1 });
    });
    writer.addGap();
  }

  summary.activities.forEach((activity: ModuleActivitySummary) => {
    writer.addText(activity.title, { bold: true });
    writer.addText(`Type: ${formatActivityType(activity.type)} • Estimated: ${activity.estimatedMinutes} min`, { indent: 1 });
    if (activity.description) {
      writer.addText(activity.description, { indent: 1 });
    }

    const progress = userProgress[activity.id];
    handledActivityKeys.add(activity.id);

    if (progress) {
      renderProgressDetails(writer, progress);
    } else {
      writer.addText("No user responses recorded yet.", { indent: 1 });
    }

    writer.addGap();
  });

  const moduleNotes = typeof notes === "string" && notes.trim().length > 0
    ? notes.trim()
    : typeof userProgress.moduleNotes === "string"
      ? userProgress.moduleNotes.trim()
      : "";

  const additionalKeys = Object.keys(userProgress).filter(
    (key) => !handledActivityKeys.has(key) && key !== "moduleNotes"
  );

  if (additionalKeys.length > 0) {
    writer.addText("Additional Data", { bold: true });
    additionalKeys.forEach((key) => {
      const value = userProgress[key];
      if (value === null || value === undefined) {
        return;
      }
      if (typeof value === "object" && Object.keys(value).length === 0) {
        return;
      }
      if (typeof value === "string" && value.trim() === "") {
        return;
      }

      writer.addText(formatKey(key), { indent: 1, bold: true });
      if (typeof value === "object") {
        renderKeyValue(writer, value, 2);
      } else {
        writer.addText(formatValue(value), { indent: 2 });
      }
    });
    writer.addGap();
  }

  if (moduleNotes) {
    writer.addText("Personal Notes", { bold: true });
    writer.addText(moduleNotes, { indent: 1 });
    writer.addGap();
  }
};

const renderReportHeader = (writer: PdfWriter, user: User, title: string) => {
  writer.doc.setFont("helvetica", "bold");
  writer.doc.setFontSize(18);
  writer.ensureSpace(12);
  writer.doc.text(title, writer.margin, writer.getY());
  writer.setY(writer.getY() + 10);

  writer.doc.setFont("helvetica", "normal");
  writer.doc.setFontSize(11);
  writer.addText(`Generated: ${formatDateValue(new Date())}`);
  writer.addGap();

  writer.addText("User Information", { bold: true });
  writer.addText(`Name: ${user.firstName} ${user.lastName}`, { indent: 1 });
  writer.addText(`Email: ${user.email}`, { indent: 1 });
  writer.addText(`User ID: ${user.id}`, { indent: 1 });
  if (user.nhsNumber) {
    writer.addText(`NHS Number: ${user.nhsNumber}`, { indent: 1 });
  }
  writer.addGap();
};

export function generateModuleProgressPdf(payload: ModuleProgressPayload): jsPDF {
  const doc = new jsPDF();
  const writer = createWriter(doc);

  renderReportHeader(writer, payload.user, "Module Progress Report");
  renderModuleSection(writer, { module: payload.module, summary: payload.summary, notes: payload.notes }, { includeObjectives: true });

  return doc;
}

export function generateAllModulesReportPdf(payload: ModuleCollectionPayload): jsPDF {
  const doc = new jsPDF();
  const writer = createWriter(doc);

  renderReportHeader(writer, payload.user, "Comprehensive Module Progress Report");
  writer.addText(`Modules Included: ${payload.modules.length}`);
  writer.addGap();

  payload.modules.forEach((entry, index) => {
    if (index > 0) {
      doc.addPage();
      writer.setY(writer.margin);
    }
    renderModuleSection(writer, entry, { includeObjectives: true });
    writer.addGap();
  });

  return doc;
}
