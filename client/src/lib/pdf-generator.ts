import jsPDF from 'jspdf';
import type { User, OnboardingResponse, WeeklyAssessment, AnxietyModule } from '@shared/schema';

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
