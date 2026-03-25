import { DEFAULT_CATEGORIES, ACTIONABLE_VERBS } from '@/constants/categories';
import { ParsedEntry } from '@/types';
import { parseRelativeDate } from './dateParser';

const reminderSignals = ['recuérdame', 'no olvidar', 'acuérdate de'];
const goalSignals = ['quiero', 'mi meta es', 'este año quiero', 'quiero empezar a'];

export function parseJournalText(rawText: string): ParsedEntry {
  const lines = rawText
    .split(/[\.\n]/)
    .map((line) => line.trim())
    .filter(Boolean);

  const tasks: ParsedEntry['tasks'] = [];
  const reminders: ParsedEntry['reminders'] = [];
  const goals: ParsedEntry['goals'] = [];

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    const parsedDate = parseRelativeDate(lower);

    if (reminderSignals.some((signal) => lower.includes(signal))) {
      reminders.push({
        title: cleanLeadWords(line, reminderSignals),
        description: line,
        remindAt: (parsedDate ?? tomorrowAtNine()).toISOString(),
        repeatType: 'once',
        priority: 'medium',
        relatedEntryId: undefined,
        notificationId: undefined
      });
      return;
    }

    if (goalSignals.some((signal) => lower.includes(signal))) {
      goals.push({
        title: line,
        description: line,
        category: inferCategory(line),
        targetValue: inferTargetValue(line),
        unit: inferUnit(line),
        targetDate: parseRelativeDate(line)?.toISOString()
      });
    }

    if (ACTIONABLE_VERBS.some((verb) => lower.includes(verb))) {
      tasks.push({
        title: line,
        description: line,
        dueDate: parsedDate?.toISOString(),
        priority: lower.includes('urgente') ? 'high' : 'medium',
        relatedEntryId: undefined,
        relatedGoalId: undefined
      });
    }
  });

  const tags = DEFAULT_CATEGORIES.filter((category) => rawText.toLowerCase().includes(category));
  const summary = lines.slice(0, 2).join('. ').slice(0, 180) || 'Entrada guardada';

  return { summary, tags: tags.length ? tags : ['personal'], tasks, reminders, goals };
}

function cleanLeadWords(text: string, words: string[]): string {
  let cleaned = text;
  words.forEach((w) => {
    const regex = new RegExp(w, 'i');
    cleaned = cleaned.replace(regex, '').trim();
  });
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function inferCategory(text: string): string {
  const lower = text.toLowerCase();
  return DEFAULT_CATEGORIES.find((item) => lower.includes(item)) ?? 'personal';
}

function inferTargetValue(text: string): number | undefined {
  const match = text.match(/(\d+[\.,]?\d*)/);
  if (!match) return undefined;
  return Number(match[1].replace(',', '.'));
}

function inferUnit(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('dólar') || lower.includes('ahorrar')) return 'USD';
  if (lower.includes('veces') || lower.includes('sesiones')) return 'sesiones';
  if (lower.includes('página')) return 'páginas';
  return 'progreso';
}

function tomorrowAtNine() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
}
