import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';
import { taskSchema } from '@/validators/forms';

export default function TasksScreen() {
  const { tasks, addTask, toggleTask } = useAppStore();
  const pending = tasks.filter((t) => !t.completed);

  const { register, setValue, handleSubmit, watch } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', description: '', priority: 'medium', dueDate: '' }
  });

  register('title');
  register('description');

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Nueva tarea</Text>
        <TextInput placeholder="Título" value={watch('title')} onChangeText={(v) => setValue('title', v)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Descripción" value={watch('description')} onChangeText={(v) => setValue('description', v)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <Picker selectedValue={watch('priority')} onValueChange={(v) => setValue('priority', v)}>
          <Picker.Item label="Baja" value="low" />
          <Picker.Item label="Media" value="medium" />
          <Picker.Item label="Alta" value="high" />
        </Picker>
        <Button title="Agregar tarea" onPress={handleSubmit(async (values) => { await addTask({ ...values, dueDate: values.dueDate || undefined }); })} />
      </Card>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Pendientes ({pending.length})</Text>
        {tasks.map((task) => (
          <View key={task.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ textDecorationLine: task.completed ? 'line-through' : 'none', flex: 1 }}>{task.title}</Text>
            <Button title={task.completed ? 'Reabrir' : 'Completar'} onPress={async () => { await toggleTask(task.id); }} />
          </View>
        ))}
      </Card>
    </AppContainer>
  );
}
