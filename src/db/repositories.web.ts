import { AppSettings, Goal, JournalEntry, Reminder, Task } from '@/types';
import type { PersistenceAdapter } from './types';
import { webStorage } from '@/services/storage/storage.web';

const defaultSettings: AppSettings = { onboardingDone: false, pinEnabled: false };

interface WebState {
  entries: JournalEntry[];
  tasks: Task[];
  reminders: Reminder[];
  goals: Goal[];
  settings: AppSettings;
}

const defaultState: WebState = { entries: [], tasks: [], reminders: [], goals: [], settings: defaultSettings };

function readState(): WebState {
  const raw = webStorage.get('state');
  if (!raw) return defaultState;
  try {
    return JSON.parse(raw) as WebState;
  } catch {
    return defaultState;
  }
}

function writeState(state: WebState) {
  webStorage.set('state', JSON.stringify(state));
}

export const repository: PersistenceAdapter = {
  async init() {},
  async seedIfEmpty() {
    const state = readState();
    if (state.entries.length > 0) return;
    const now = new Date().toISOString();
    state.entries = [{ id: 'seed-entry-1', createdAt: now, updatedAt: now, date: now, rawText: 'Hoy hablé con mi supervisor y quedamos en revisar el horario el viernes.', summary: 'Conversación de trabajo para revisar horario.', tags: ['trabajo'] }];
    state.tasks = [{ id: 'seed-task-1', title: 'Revisar horario con supervisor', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), completed: false, priority: 'medium', createdAt: now, updatedAt: now }];
    state.goals = [{ id: 'seed-goal-1', title: 'Ahorrar 3000 dólares', category: 'dinero', targetValue: 3000, currentValue: 400, unit: 'USD', status: 'active', createdAt: now, updatedAt: now }];
    state.settings = defaultSettings;
    writeState(state);
  },
  async getJournalEntries() { return readState().entries; },
  async saveJournalEntry(entry) { const s = readState(); s.entries = [entry, ...s.entries.filter((e) => e.id !== entry.id)]; writeState(s); },
  async getTasks() { return readState().tasks; },
  async saveTask(task) { const s = readState(); s.tasks = [task, ...s.tasks.filter((t) => t.id !== task.id)]; writeState(s); },
  async getReminders() { return readState().reminders; },
  async saveReminder(reminder) { const s = readState(); s.reminders = [reminder, ...s.reminders.filter((r) => r.id !== reminder.id)]; writeState(s); },
  async getGoals() { return readState().goals; },
  async saveGoal(goal) { const s = readState(); s.goals = [goal, ...s.goals.filter((g) => g.id !== goal.id)]; writeState(s); },
  async getSettings() { return readState().settings || defaultSettings; },
  async saveSettings(settings) { const s = readState(); s.settings = settings; writeState(s); }
};
