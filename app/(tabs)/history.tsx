import { Link } from 'expo-router';
import { Text } from 'react-native';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';

export default function HistoryScreen() {
  const { entries, tasks, reminders } = useAppStore();

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Calendario mensual (vista simple)</Text>
        <Text>Mes actual: {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</Text>
        <Text>Días con entradas: {[...new Set(entries.map((e) => new Date(e.date).getDate()))].join(', ') || 'ninguno'}</Text>
      </Card>
      {entries.map((entry) => (
        <Card key={entry.id}>
          <Text>{new Date(entry.date).toLocaleDateString('es-ES')}</Text>
          <Text numberOfLines={2}>{entry.summary}</Text>
          <Text>Tareas relacionadas: {tasks.filter((t) => t.relatedEntryId === entry.id).length}</Text>
          <Text>Recordatorios relacionados: {reminders.filter((r) => r.relatedEntryId === entry.id).length}</Text>
          <Link href={`/entry/${entry.id}` as any}>Abrir día</Link>
        </Card>
      ))}
    </AppContainer>
  );
}
