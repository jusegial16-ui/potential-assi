import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Button, Text, TextInput, View } from 'react-native';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';
import { parseJournalText } from '@/utils/textParser';
import { ParsedEntry } from '@/types';

export default function NewEntryScreen() {
  const addJournalWithParsed = useAppStore((s) => s.addJournalWithParsed);
  const [rawText, setRawText] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const parsed = useMemo(() => parseJournalText(rawText), [rawText]);
  const [draft, setDraft] = useState<ParsedEntry>(parsed);

  useEffect(() => {
    setDraft(parsed);
    setConfirmed(false);
  }, [parsed]);

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
        <Text>Resumen: {draft.summary}</Text>
        <Text>Tareas: {draft.tasks.length}</Text>
        {draft.tasks.map((task, i) => (
          <TextInput
            key={i}
            value={task.title}
            onChangeText={(value) => setDraft((prev) => ({ ...prev, tasks: prev.tasks.map((t, idx) => idx === i ? { ...t, title: value } : t) }))}
            style={{ borderWidth: 1, borderRadius: 8, padding: 8 }}
          />
        ))}
        <Text>Recordatorios: {draft.reminders.length}</Text>
        {draft.reminders.map((reminder, i) => (
          <TextInput
            key={i}
            value={reminder.title}
            onChangeText={(value) => setDraft((prev) => ({ ...prev, reminders: prev.reminders.map((r, idx) => idx === i ? { ...r, title: value } : r) }))}
            style={{ borderWidth: 1, borderRadius: 8, padding: 8 }}
          />
        ))}
        <Text>Metas: {draft.goals.length}</Text>
        {draft.goals.map((goal, i) => (
          <TextInput
            key={i}
            value={goal.title}
            onChangeText={(value) => setDraft((prev) => ({ ...prev, goals: prev.goals.map((g, idx) => idx === i ? { ...g, title: value } : g) }))}
            style={{ borderWidth: 1, borderRadius: 8, padding: 8 }}
          />
        ))}
      </Card>

      <View style={{ gap: 8 }}>
        <Button title="Confirmar detección" onPress={() => setConfirmed(true)} />
        <Button
          title="Guardar entrada"
          disabled={!confirmed || rawText.length < 3}
          onPress={async () => {
            const id = await addJournalWithParsed(rawText, draft);
            router.replace(`/entry/${id}` as any);
          }}
        />
      </View>
    </AppContainer>
  );
}
