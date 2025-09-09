
export interface User {
  id: string;
  email: string;
  password?: string; // Not stored in production, just for mock auth
}

export interface Disbursement {
  id: string;
  date: string;
  amount: number;
}

export interface Rendition {
  id: string;
  monthYear: string; // Format YYYY-MM
  approvedAmount: number;
}

export interface SupervisedUser {
  id: string;
  supervisionDate: string;
  name: string;
  commune: string;
  observation: string;
}

export interface Project {
  id: string;
  code: string;
  executorName: string;
  startDate: string;
  endDate: string;
  durationInMonths: number;
  contractEndDate: string;
  amount: number; // Project amount in CLP

  ufValue: number; // UF value for guarantees

  // Compliance Guarantee
  complianceGuaranteeAmountUF: number;
  complianceGuaranteeDueDate: string; // Calculated theoretical due date
  complianceGuaranteeActualDueDate: string; // Real due date from document

  // Advance Guarantee
  advanceGuaranteeAmountUF?: number;
  advanceGuaranteeEndDate?: string; // Calculated theoretical due date
  advanceGuaranteeActualDueDate?: string; // Real due date from document

  isFosisLaw: boolean;
  createdAt: string;

  // Financials
  disbursements: Disbursement[];
  renditions: Rendition[];
  supervisedUsers: SupervisedUser[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum TaskPriority {
  High = 'Alta',
  Medium = 'Media',
  Low = 'Baja',
}

export enum TaskStatus {
    ToDo = 'Por Hacer',
    InProgress = 'En Progreso',
    Done = 'Hecho'
}

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  deadlineDays: number;
  status: TaskStatus;
  createdAt: string;
}

export interface FosisTip {
    id: number;
    title: string;
    content: string;
}

export type AppView = 'welcome' | 'projects' | 'quiz' | 'tasks' | 'consultation';