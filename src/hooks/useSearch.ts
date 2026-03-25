import { Goal, JournalEntry, Reminder, Task } from '@/types';

export function useSearch(query: string, entries: JournalEntry[], tasks: Task[], reminders: Reminder[], goals: Goal[]) {
  const q = query.toLowerCase().trim();
  if (!q) return { entries: [], tasks: [], reminders: [], goals: [] };

  return {
    entries: entries.filter((e) => `${e.rawText} ${e.summary} ${e.tags.join(' ')}`.toLowerCase().includes(q)),
    tasks: tasks.filter((t) => `${t.title} ${t.description || ''}`.toLowerCase().includes(q)),
    reminders: reminders.filter((r) => `${r.title} ${r.description || ''}`.toLowerCase().includes(q)),
    goals: goals.filter((g) => `${g.title} ${g.description || ''} ${g.category}`.toLowerCase().includes(q))
  };
}
