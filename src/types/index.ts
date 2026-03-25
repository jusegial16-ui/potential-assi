// Type definitions for Journal Entry, Task, Reminder, Goal, Tag, Extracted Data, and App Settings

// Journal Entry Definition
interface JournalEntry {
    id: string;
    title: string;
    content: string;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}

// Task Definition
interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    dueDate?: Date;
    journalEntryId?: string;
}

// Reminder Definition
interface Reminder {
    id: string;
    message: string;
    triggerDate: Date;
    isRecurring: boolean;
}

// Goal Definition
interface Goal {
    id: string;
    title: string;
    description: string;
    targetDate?: Date;
    isAchieved: boolean;
}

// Tag Definition
interface Tag {
    id: string;
    name: string;
}

// Extracted Data Definition
interface ExtractedData {
    journalEntries: JournalEntry[];
    tasks: Task[];
    reminders: Reminder[];
    goals: Goal[];
    tags: Tag[];
}

// App Settings Definition
interface AppSettings {
    theme: 'light' | 'dark';
    language: string;
    notificationsEnabled: boolean;
}