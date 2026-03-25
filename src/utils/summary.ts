import { Goal, JournalEntry, Reminder, Task } from '@/types';

export function getWeeklySummary(entries: JournalEntry[], tasks: Task[], goals: Goal[]): string {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekEntries = entries.filter((entry) => new Date(entry.createdAt) >= weekAgo);
  const weekTasks = tasks.filter((task) => new Date(task.createdAt) >= weekAgo);
  const completed = weekTasks.filter((task) => task.completed).length;

  const tags = weekEntries.flatMap((entry) => entry.tags);
  const topTag = mode(tags);
  const goalProgress = goals
    .filter((goal) => goal.status === 'active' && goal.targetValue)
    .map((goal) => `${goal.title}: ${Math.round((goal.currentValue / (goal.targetValue || 1)) * 100)}%`)
    .slice(0, 2)
    .join(', ');

  return `Esta semana registraste ${weekEntries.length} entradas, completaste ${completed} tareas y tu foco principal fue ${topTag || 'personal'}${goalProgress ? `. Progreso: ${goalProgress}` : ''}.`;
}

export function getDailySummary(entries: JournalEntry[], tasks: Task[], reminders: Reminder[]): string {
  const today = new Date().toDateString();
  const todayEntry = entries.find((entry) => new Date(entry.date).toDateString() === today);
  const todayTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate).toDateString() === today && !task.completed).length;
  const todayReminders = reminders.filter((reminder) => new Date(reminder.remindAt).toDateString() === today && !reminder.completed).length;

  if (!todayEntry) {
    return `Hoy tienes ${todayTasks} tareas y ${todayReminders} recordatorios pendientes.`;
  }

  return `${todayEntry.summary} Hoy quedan ${todayTasks} tareas y ${todayReminders} recordatorios.`;
}

function mode(items: string[]): string | undefined {
  const count = new Map<string, number>();
  items.forEach((item) => count.set(item, (count.get(item) || 0) + 1));
  let max = 0;
  let winner: string | undefined;
  count.forEach((value, key) => {
    if (value > max) {
      max = value;
      winner = key;
    }
  });
  return winner;
}
