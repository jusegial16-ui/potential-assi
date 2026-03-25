import { AppSettings, Goal, JournalEntry, Reminder, Task } from '@/types';
import { PersistenceAdapter } from './types';
import { getNativeDb } from '@/services/storage/storage.native';

const defaultSettings: AppSettings = { onboardingDone: false, pinEnabled: false };

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const repository: PersistenceAdapter = {
  async init() {
    const db = await getNativeDb();
    db.execSync(`
      CREATE TABLE IF NOT EXISTS journal_entries (id TEXT PRIMARY KEY NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL, date TEXT NOT NULL, rawText TEXT NOT NULL, summary TEXT NOT NULL, mood TEXT, tags TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT, dueDate TEXT, completed INTEGER NOT NULL, priority TEXT NOT NULL, relatedEntryId TEXT, relatedGoalId TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS reminders (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT, remindAt TEXT NOT NULL, repeatType TEXT NOT NULL, priority TEXT NOT NULL, completed INTEGER NOT NULL, relatedEntryId TEXT, notificationId TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS goals (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT, category TEXT NOT NULL, targetValue REAL, currentValue REAL NOT NULL, unit TEXT NOT NULL, targetDate TEXT, status TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
    `);
  },
  async seedIfEmpty() {
    const db = await getNativeDb();
    const row = db.getFirstSync('SELECT COUNT(*) as count FROM journal_entries') as { count: number };
    if (row.count > 0) return;
    const now = new Date().toISOString();
    await this.saveJournalEntry({ id: 'seed-entry-1', createdAt: now, updatedAt: now, date: now, rawText: 'Hoy hablé con mi supervisor y quedamos en revisar el horario el viernes.', summary: 'Conversación de trabajo para revisar horario.', tags: ['trabajo'] });
    await this.saveTask({ id: 'seed-task-1', title: 'Revisar horario con supervisor', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), completed: false, priority: 'medium', createdAt: now, updatedAt: now });
    await this.saveGoal({ id: 'seed-goal-1', title: 'Ahorrar 3000 dólares', category: 'dinero', targetValue: 3000, currentValue: 400, unit: 'USD', status: 'active', createdAt: now, updatedAt: now });
    await this.saveSettings(defaultSettings);
  },
  async getJournalEntries() {
    const db = await getNativeDb();
    return db.getAllSync('SELECT * FROM journal_entries ORDER BY date DESC').map((row: any) => ({ ...row, tags: parseJson<string[]>(row.tags, []) }));
  },
  async saveJournalEntry(entry) {
    const db = await getNativeDb();
    db.runSync('INSERT OR REPLACE INTO journal_entries (id,createdAt,updatedAt,date,rawText,summary,mood,tags) VALUES (?,?,?,?,?,?,?,?)', [entry.id, entry.createdAt, entry.updatedAt, entry.date, entry.rawText, entry.summary, entry.mood ?? null, JSON.stringify(entry.tags)]);
  },
  async getTasks() {
    const db = await getNativeDb();
    return db.getAllSync('SELECT * FROM tasks ORDER BY createdAt DESC').map((row: any) => ({ ...row, completed: !!row.completed }));
  },
  async saveTask(task) {
    const db = await getNativeDb();
    db.runSync('INSERT OR REPLACE INTO tasks (id,title,description,dueDate,completed,priority,relatedEntryId,relatedGoalId,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)', [task.id, task.title, task.description ?? null, task.dueDate ?? null, task.completed ? 1 : 0, task.priority, task.relatedEntryId ?? null, task.relatedGoalId ?? null, task.createdAt, task.updatedAt]);
  },
  async getReminders() {
    const db = await getNativeDb();
    return db.getAllSync('SELECT * FROM reminders ORDER BY remindAt ASC').map((row: any) => ({ ...row, completed: !!row.completed }));
  },
  async saveReminder(reminder) {
    const db = await getNativeDb();
    db.runSync('INSERT OR REPLACE INTO reminders (id,title,description,remindAt,repeatType,priority,completed,relatedEntryId,notificationId,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [reminder.id, reminder.title, reminder.description ?? null, reminder.remindAt, reminder.repeatType, reminder.priority, reminder.completed ? 1 : 0, reminder.relatedEntryId ?? null, reminder.notificationId ?? null, reminder.createdAt, reminder.updatedAt]);
  },
  async getGoals() {
    const db = await getNativeDb();
    return db.getAllSync('SELECT * FROM goals ORDER BY createdAt DESC') as Goal[];
  },
  async saveGoal(goal) {
    const db = await getNativeDb();
    db.runSync('INSERT OR REPLACE INTO goals (id,title,description,category,targetValue,currentValue,unit,targetDate,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [goal.id, goal.title, goal.description ?? null, goal.category, goal.targetValue ?? null, goal.currentValue, goal.unit, goal.targetDate ?? null, goal.status, goal.createdAt, goal.updatedAt]);
  },
  async getSettings() {
    const db = await getNativeDb();
    const rows = db.getAllSync('SELECT * FROM settings') as { key: string; value: string }[];
    if (!rows.length) return defaultSettings;
    const map = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {} as Record<string, string>);
    return { onboardingDone: map.onboardingDone === 'true', pinEnabled: map.pinEnabled === 'true', pinCode: map.pinCode || undefined };
  },
  async saveSettings(settings) {
    const db = await getNativeDb();
    const values: Record<string, string> = { onboardingDone: String(settings.onboardingDone), pinEnabled: String(settings.pinEnabled), pinCode: settings.pinCode ?? '' };
    Object.entries(values).forEach(([key, value]) => db.runSync('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', [key, value]));
  }
};
