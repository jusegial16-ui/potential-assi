import { Link } from 'expo-router';
import { Button, Text } from 'react-native';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { SectionTitle } from '@/components/SectionTitle';
import { getDailySummary, getWeeklySummary } from '@/utils/summary';
import { isToday } from '@/utils/dateParser';
import { useAppStore } from '@/store/useAppStore';

export default function DashboardScreen() {
  const { entries, reminders, tasks, goals } = useAppStore();
  const todayReminders = reminders.filter((r) => isToday(r.remindAt) && !r.completed).slice(0, 3);
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 4);
  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 3);
  const latestEntry = entries[0];

  return (
    <AppContainer>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>Hola 👋</Text>
      <Card>
        <SectionTitle title="Resumen del día" />
        <Text>{getDailySummary(entries, tasks, reminders)}</Text>
      </Card>
      <Card>
        <SectionTitle title="Recordatorios de hoy" />
        {todayReminders.map((r) => <Text key={r.id}>• {r.title}</Text>)}
      </Card>
      <Card>
        <SectionTitle title="Tareas pendientes" />
        {pendingTasks.map((task) => <Text key={task.id}>• {task.title}</Text>)}
      </Card>
      <Card>
        <SectionTitle title="Metas activas" />
        {activeGoals.map((goal) => <Text key={goal.id}>• {goal.title}</Text>)}
      </Card>
      {!!latestEntry && (
        <Card>
          <SectionTitle title="Última entrada" />
          <Text numberOfLines={2}>{latestEntry.rawText}</Text>
          <Link href={`/entry/${latestEntry.id}` as any}>Ver detalle</Link>
        </Card>
      )}
      <Card>
        <SectionTitle title="Progreso semanal" />
        <Text>{getWeeklySummary(entries, tasks, goals)}</Text>
      </Card>
      <Link href="/entry/new" asChild>
        <Button title="Contar mi día" />
      </Link>
      <Link href="/search" asChild>
        <Button title="Buscar" />
      </Link>
    </AppContainer>
  );
}
