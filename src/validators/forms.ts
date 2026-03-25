import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(2, 'Título requerido'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'])
});

export const reminderSchema = z.object({
  title: z.string().min(2, 'Título requerido'),
  description: z.string().optional(),
  remindAt: z.string().min(1, 'Fecha requerida'),
  repeatType: z.enum(['once', 'daily', 'weekly', 'monthly']),
  priority: z.enum(['low', 'medium', 'high'])
});

export const goalSchema = z.object({
  title: z.string().min(2, 'Título requerido'),
  description: z.string().optional(),
  category: z.string().min(2),
  targetValue: z.coerce.number().optional(),
  unit: z.string().min(1),
  targetDate: z.string().optional()
});
