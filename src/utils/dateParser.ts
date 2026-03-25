const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export function parseRelativeDate(text: string, baseDate = new Date()): Date | undefined {
  const lower = text.toLowerCase();
  const result = new Date(baseDate);
  result.setSeconds(0, 0);

  if (lower.includes('pasado mañana')) {
    result.setDate(result.getDate() + 2);
    result.setHours(9, 0, 0, 0);
    return result;
  }
  if (lower.includes('mañana')) {
    result.setDate(result.getDate() + 1);
    result.setHours(9, 0, 0, 0);
    return result;
  }
  if (lower.includes('hoy')) {
    result.setHours(Math.max(result.getHours() + 1, 9), 0, 0, 0);
    return result;
  }

  for (let index = 0; index < WEEKDAYS.length; index++) {
    const day = WEEKDAYS[index];
    if (lower.includes(`el ${day}`) || lower.includes(`este ${day}`) || lower.includes(`próximo ${day}`)) {
      const delta = (index - result.getDay() + 7) % 7 || 7;
      result.setDate(result.getDate() + delta);
      result.setHours(9, 0, 0, 0);
      return result;
    }
  }

  if (lower.includes('próxima semana')) {
    result.setDate(result.getDate() + 7);
    result.setHours(9, 0, 0, 0);
    return result;
  }

  return undefined;
}

export function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return date.toDateString() === now.toDateString();
}
