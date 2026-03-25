import { db } from '@/db';
import { AppSettings, Goal, JournalEntry, Reminder, Task } from '@/types';

const defaultSettings: AppSettings = { onboardingDone: false, pinEnabled: false };

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export const storageService = {
  getJournalEntries(): JournalEntry[] {
    return db.getAllSync('SELECT * FROM journal_entries ORDER BY date DESC').map((row: any) => ({ ...row, tags: parseTags(row.tags) }));
  },
  saveJournalEntry(entry: JournalEntry) {
    db.runSync(
      `INSERT OR REPLACE INTO journal_entries (id,createdAt,updatedAt,date,rawText,summary,mood,tags) VALUES (?,?,?,?,?,?,?,?)`,
      [entry.id, entry.createdAt, entry.updatedAt, entry.date, entry.rawText, entry.summary, entry.mood ?? null, JSON.stringify(entry.tags)]
    );
  },
  getTasks(): Task[] {
    return db.getAllSync('SELECT * FROM tasks ORDER BY createdAt DESC').map((row: any) => ({ ...row, completed: !!row.completed }));
  },
  saveTask(task: Task) {
    db.runSync(
      `INSERT OR REPLACE INTO tasks (id,title,description,dueDate,completed,priority,relatedEntryId,relatedGoalId,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [task.id, task.title, task.description ?? null, task.dueDate ?? null, task.completed ? 1 : 0, task.priority, task.relatedEntryId ?? null, task.relatedGoalId ?? null, task.createdAt, task.updatedAt]
    );
  },
  getReminders(): Reminder[] {
    return db.getAllSync('SELECT * FROM reminders ORDER BY remindAt ASC').map((row: any) => ({ ...row, completed: !!row.completed }));
  },
  saveReminder(reminder: Reminder) {
    db.runSync(
      `INSERT OR REPLACE INTO reminders (id,title,description,remindAt,repeatType,priority,completed,relatedEntryId,notificationId,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [reminder.id, reminder.title, reminder.description ?? null, reminder.remindAt, reminder.repeatType, reminder.priority, reminder.completed ? 1 : 0, reminder.relatedEntryId ?? null, reminder.notificationId ?? null, reminder.createdAt, reminder.updatedAt]
    );
  },
  getGoals(): Goal[] {
    return db.getAllSync('SELECT * FROM goals ORDER BY createdAt DESC') as Goal[];
  },
  saveGoal(goal: Goal) {
    db.runSync(
      `INSERT OR REPLACE INTO goals (id,title,description,category,targetValue,currentValue,unit,targetDate,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [goal.id, goal.title, goal.description ?? null, goal.category, goal.targetValue ?? null, goal.currentValue, goal.unit, goal.targetDate ?? null, goal.status, goal.createdAt, goal.updatedAt]
    );
  },
  getSettings(): AppSettings {
    const rows = db.getAllSync('SELECT * FROM settings') as { key: string; value: string }[];
    const map = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      onboardingDone: map.onboardingDone === 'true',
      pinEnabled: map.pinEnabled === 'true',
      pinCode: map.pinCode
    };
  },
  saveSettings(settings: AppSettings) {
    const values: Record<string, string> = {
      onboardingDone: String(settings.onboardingDone),
      pinEnabled: String(settings.pinEnabled),
      pinCode: settings.pinCode ?? ''
    };

    Object.entries(values).forEach(([key, value]) => {
      db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
    });
  },
  seedIfEmpty() {
    const entriesCount = db.getFirstSync('SELECT COUNT(*) as count FROM journal_entries') as { count: number };
    if (entriesCount.count > 0) return;

    const now = new Date().toISOString();
    this.saveJournalEntry({
      id: 'seed-entry-1',
      createdAt: now,
      updatedAt: now,
      date: now,
      rawText: 'Hoy hablé con mi supervisor y quedamos en revisar el horario el viernes.',
      summary: 'Conversación de trabajo para revisar horario.',
      tags: ['trabajo']
    });

    this.saveTask({
      id: 'seed-task-1',
      title: 'Revisar horario con supervisor',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      completed: false,
      priority: 'medium',
      createdAt: now,
      updatedAt: now
    });

    this.saveGoal({
      id: 'seed-goal-1',
      title: 'Ahorrar 3000 dólares',
      category: 'dinero',
      targetValue: 3000,
      currentValue: 400,
      unit: 'USD',
      status: 'active',
      createdAt: now,
      updatedAt: now
    });

    this.saveSettings(defaultSettings);
  }
};
