import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Button, Text, TextInput, View } from 'react-native';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';
import { parseJournalText } from '@/utils/textParser';

export default function NewEntryScreen() {
  const addJournalWithParsed = useAppStore((s) => s.addJournalWithParsed);
  const [rawText, setRawText] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const parsed = useMemo(() => parseJournalText(rawText), [rawText]);

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Cuéntame tu día</Text>
        <TextInput
          multiline
          placeholder="Escribe en lenguaje natural..."
          value={rawText}
          onChangeText={setRawText}
          style={{ borderWidth: 1, borderRadius: 8, minHeight: 120, padding: 12, textAlignVertical: 'top' }}
        />
      </Card>

      <Card>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Detección automática (editable)</Text>
        <Text>Resumen: {parsed.summary}</Text>
        <Text>Tareas: {parsed.tasks.length}</Text>
        {parsed.tasks.map((task, i) => (
          <TextInput key={i} value={task.title} onChangeText={(v) => (parsed.tasks[i].title = v)} style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} />
        ))}
        <Text>Recordatorios: {parsed.reminders.length}</Text>
        {parsed.reminders.map((reminder, i) => (
          <TextInput key={i} value={reminder.title} onChangeText={(v) => (parsed.reminders[i].title = v)} style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} />
        ))}
        <Text>Metas: {parsed.goals.length}</Text>
        {parsed.goals.map((goal, i) => (
          <TextInput key={i} value={goal.title} onChangeText={(v) => (parsed.goals[i].title = v)} style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} />
        ))}
      </Card>

      <View style={{ gap: 8 }}>
        <Button title="Confirmar detección" onPress={() => setConfirmed(true)} />
        <Button
          title="Guardar entrada"
          disabled={!confirmed || rawText.length < 3}
          onPress={async () => {
            const id = await addJournalWithParsed(rawText, parsed);
            router.replace(`/entry/${id}` as any);
          }}
        />
      </View>
    </AppContainer>
  );
}
