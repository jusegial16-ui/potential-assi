import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Text, TextInput, View } from 'react-native';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';
import { goalSchema } from '@/validators/forms';

export default function GoalsScreen() {
  const { goals, addGoal, updateGoalProgress } = useAppStore();
  const { register, setValue, handleSubmit, watch } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: { title: '', description: '', category: 'personal', targetValue: undefined, unit: 'progreso', targetDate: '' }
  });
  register('title');
  register('description');
  register('category');
  register('targetDate');

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Nueva meta</Text>
        <TextInput placeholder="Nombre" value={watch('title')} onChangeText={(v) => setValue('title', v)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Categoría" value={watch('category')} onChangeText={(v) => setValue('category', v)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Valor objetivo" value={String(watch('targetValue') ?? '')} onChangeText={(v) => setValue('targetValue', Number(v) || undefined)} keyboardType="numeric" style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Unidad (USD, sesiones...)" value={watch('unit')} onChangeText={(v) => setValue('unit', v)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <Button title="Agregar meta" onPress={handleSubmit(async (values) => { await addGoal(values); })} />
      </Card>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Metas</Text>
        {goals.map((goal) => {
          const percent = goal.targetValue ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
          return (
            <View key={goal.id} style={{ gap: 6 }}>
              <Text>{goal.title} ({goal.currentValue}/{goal.targetValue || '-'} {goal.unit})</Text>
              <View style={{ height: 8, backgroundColor: '#e5e7eb', borderRadius: 8 }}>
                <View style={{ width: `${percent}%`, height: 8, backgroundColor: '#5B7CFA', borderRadius: 8 }} />
              </View>
              <Button title="+1 progreso" onPress={async () => { await updateGoalProgress(goal.id, goal.currentValue + 1); }} />
            </View>
          );
        })}
      </Card>
    </AppContainer>
  );
}
