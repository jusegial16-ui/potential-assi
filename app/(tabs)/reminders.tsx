import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';
import { reminderSchema } from '@/validators/forms';

export default function RemindersScreen() {
  const { reminders, addReminder, toggleReminder } = useAppStore();
  const { register, setValue, handleSubmit, watch } = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues: { title: '', description: '', remindAt: new Date(Date.now() + 3600000).toISOString(), repeatType: 'once', priority: 'medium' }
  });
  register('title');
  register('description');
  register('remindAt');

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Nuevo recordatorio</Text>
        <TextInput placeholder="Título" value={watch('title')} onChangeText={(v) => setValue('title', v)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Descripción" value={watch('description')} onChangeText={(v) => setValue('description', v)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="ISO Fecha (2026-03-26T09:00:00.000Z)" value={watch('remindAt')} onChangeText={(v) => setValue('remindAt', v)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <Picker selectedValue={watch('repeatType')} onValueChange={(v) => setValue('repeatType', v)}>
          <Picker.Item label="Una vez" value="once" />
          <Picker.Item label="Diario" value="daily" />
          <Picker.Item label="Semanal" value="weekly" />
          <Picker.Item label="Mensual" value="monthly" />
        </Picker>
        <Button title="Agregar recordatorio" onPress={handleSubmit(async (values) => addReminder(values))} />
      </Card>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Lista</Text>
        {reminders.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ flex: 1 }}>{item.title}</Text>
            <Button title={item.completed ? 'Pendiente' : 'Completar'} onPress={async () => { await toggleReminder(item.id); }} />
          </View>
        ))}
      </Card>
    </AppContainer>
  );
}
