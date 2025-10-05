import jsPDF from 'jspdf';
import type { User, OnboardingResponse, WeeklyAssessment, AnxietyModule, MoodEntry } from '@shared/schema';

interface ReportData {
  user: User;
  onboarding: OnboardingResponse;
  assessments: WeeklyAssessment[];
  modules: AnxietyModule[];
  generatedAt: Date;
}

export function generateProgressReport(data: ReportData): jsPDF {
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
  doc.text(`Report Generated: ${data.generatedAt.toLocaleDateString('en-GB')}`, 20, yPos);
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
  doc.text(`Completed: ${data.onboarding.completedAt?.toLocaleDateString('en-GB')}`, 20, yPos);
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
      doc.text(`Completed: ${assessment.completedAt?.toLocaleDateString('en-GB')}`, 25, yPos);
      yPos += 8;
    });
    yPos += 10;
  }
  
  // Module Progress
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('6-Week Anxiety Support Track Progress', 20, yPos);
  yPos += 10;
  
  const completedModules = data.modules.filter(m => m.completedAt);
  const totalMinutes = data.modules.reduce((sum, m) => sum + (m.minutesCompleted || 0), 0);
  const totalEstimatedMinutes = data.modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);
  const completionRate = totalEstimatedMinutes > 0 ? Math.round((totalMinutes / totalEstimatedMinutes) * 100) : 0;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Overall Completion: ${completionRate}% (${totalMinutes}/${totalEstimatedMinutes} minutes)`, 20, yPos);
  yPos += 6;
  doc.text(`Modules Completed: ${completedModules.length}/6`, 20, yPos);
  yPos += 10;
  
  data.modules.forEach((module, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(`Week ${module.weekNumber}: ${module.title}`, 20, yPos);
    yPos += 6;
    const status = module.completedAt ? 'Completed' : module.isLocked ? 'Locked' : 'In Progress';
    doc.text(`Status: ${status} | Progress: ${module.minutesCompleted}/${module.estimatedMinutes} min`, 25, yPos);
    yPos += 8;
  });
  
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
  
  const latestRisk = data.assessments[0]?.riskLevel || data.onboarding.baselineAnxietyLevel;
  
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
  
  return doc;
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
