export interface CriticalDate {
  date: string;
  description: string;
}

export interface CaseLog {
  date: string;
  action: string;
}

export interface LegalCase {
  id: string;
  title: string;
  client: string;
  opposingParty: string;
  status: string;
  judge: string;
  court: string;
  nextHearing: string;
  criticalDates: CriticalDate[];
  riskScore: number;
  riskFactors: string[];
  summary: string;
  logs: CaseLog[];
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  type: string;
}

export interface LawFile {
  name: string;
  length: number;
  filename?: string;
}

export interface AlertItem {
  id: number;
  text: string;
  date: string;
  type: string;
  law: string;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "bot" | "client" | "system";
  text: string;
  time: string;
  encrypted?: boolean;
}

export interface KPIStats {
  totalCases: number;
  activeCases: number;
  negotiationsCount: number;
  settlementsCount: number;
  winRate: number;
  averageRiskScore: number;
  billableHoursThisMonth: number;
  activeClients: number;
  monthlyProgress: {
    month: string;
    часови: number;
    предмети: number;
  }[];
  courtWinDistribution: {
    name: string;
    вредност: number;
  }[];
}

export interface ContractAnalysis {
  contractType: string;
  parties: string[];
  subject: string;
  value: string;
  riskScore: number;
  riskRating: string;
  risks: {
    title: string;
    description: string;
    severity: string;
  }[];
  recommendations: string[];
  rephrasedClauses: {
    original: string;
    suggested: string;
  }[];
}
