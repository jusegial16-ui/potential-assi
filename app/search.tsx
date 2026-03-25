import { useMemo, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useSearch } from '@/hooks/useSearch';
import { useAppStore } from '@/store/useAppStore';

export default function SearchScreen() {
  const { entries, tasks, reminders, goals } = useAppStore();
  const [query, setQuery] = useState('');
  const result = useMemo(() => useSearch(query, entries, tasks, reminders, goals), [query, entries, tasks, reminders, goals]);

  return (
    <AppContainer>
      <Card>
        <TextInput
          placeholder="Buscar: mamá, gimnasio, tarjeta, marzo..."
          value={query}
          onChangeText={setQuery}
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
        />
      </Card>
      <Card>
        <Text>Entradas: {result.entries.length}</Text>
        <Text>Tareas: {result.tasks.length}</Text>
        <Text>Recordatorios: {result.reminders.length}</Text>
        <Text>Metas: {result.goals.length}</Text>
      </Card>
    </AppContainer>
  );
}
