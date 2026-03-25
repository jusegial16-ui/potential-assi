import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, tasks, reminders } = useAppStore();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return <AppContainer><Text>Entrada no encontrada</Text></AppContainer>;

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{new Date(entry.date).toLocaleDateString('es-ES')}</Text>
        <Text>{entry.rawText}</Text>
      </Card>
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Resumen</Text>
        <Text>{entry.summary}</Text>
        <Text>Etiquetas: {entry.tags.join(', ')}</Text>
      </Card>
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Tareas detectadas</Text>
        {tasks.filter((task) => task.relatedEntryId === id).map((task) => <Text key={task.id}>• {task.title}</Text>)}
      </Card>
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Recordatorios detectados</Text>
        {reminders.filter((reminder) => reminder.relatedEntryId === id).map((reminder) => <Text key={reminder.id}>• {reminder.title}</Text>)}
      </Card>
    </AppContainer>
  );
}
