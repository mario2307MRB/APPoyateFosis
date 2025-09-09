
export interface User {
  id: string;
  email: string;
  password?: string; // Not stored in production, just for mock auth
}

export interface Project {
  id: string;
  code: string;
  executorName: string;
  startDate: string;
  endDate: string;
  contractEndDate: string;
  amount: number;
  complianceGuaranteeAmount: number;
  complianceGuaranteeDueDate: string;
  advanceGuaranteeAmount?: number;
  advanceGuaranteeEndDate?: string;
  isFosisLaw: boolean;
  createdAt: string;
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
