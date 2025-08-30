export function calculateRiskScore(responses: Record<string, any>): number {
  let score = 0;
  
  // PHQ-4 questions (0-3 each)
  if (responses.anxietyFrequency !== undefined) score += parseInt(responses.anxietyFrequency);
  if (responses.worryFrequency !== undefined) score += parseInt(responses.worryFrequency);
  if (responses.depressionFrequency !== undefined) score += parseInt(responses.depressionFrequency);
  if (responses.anhedoniaFrequency !== undefined) score += parseInt(responses.anhedoniaFrequency);
  
  // Additional risk factors
  if (responses.sleepQuality === "poor") score += 1;
  if (responses.suicidalThoughts === "yes") score += 5;
  if (responses.selfHarm === "yes") score += 3;
  if (responses.substanceUse === "increased") score += 2;
  if (responses.socialWithdrawal === "significant") score += 1;
  if (responses.functioningImpairment === "severe") score += 2;
  
  return Math.min(score, 15);
}

export function determineRiskLevel(score: number): string {
  if (score >= 12) return "crisis";
  if (score >= 8) return "high";
  if (score >= 5) return "moderate";
  return "low";
}

export function shouldEscalate(riskLevel: string): boolean {
  return riskLevel === "crisis" || riskLevel === "high";
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case "crisis": return "destructive";
    case "high": return "destructive";
    case "moderate": return "primary";
    case "low": return "accent";
    default: return "muted";
  }
}
