export type Priority = 'low' | 'medium' | 'high';
export type RepeatType = 'once' | 'daily' | 'weekly' | 'monthly';
export type GoalStatus = 'active' | 'completed' | 'paused';

export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  rawText: string;
  summary: string;
  mood?: string;
  tags: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  priority: Priority;
  relatedEntryId?: string;
  relatedGoalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  remindAt: string;
  repeatType: RepeatType;
  priority: Priority;
  completed: boolean;
  relatedEntryId?: string;
  notificationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  targetValue?: number;
  currentValue: number;
  unit: string;
  targetDate?: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  onboardingDone: boolean;
  pinEnabled: boolean;
  pinCode?: string;
}

export interface ParsedEntry {
  summary: string;
  tags: string[];
  tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>[];
  reminders: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'completed'>[];
  goals: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'currentValue' | 'status'>[];
}
