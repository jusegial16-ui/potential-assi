import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerTitleAlign: 'center'
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <FontAwesome5 name="home" color={color} size={16} /> }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tareas', tabBarIcon: ({ color }) => <FontAwesome5 name="check-circle" color={color} size={16} /> }} />
      <Tabs.Screen name="reminders" options={{ title: 'Recordatorios', tabBarIcon: ({ color }) => <FontAwesome5 name="bell" color={color} size={16} /> }} />
      <Tabs.Screen name="goals" options={{ title: 'Metas', tabBarIcon: ({ color }) => <FontAwesome5 name="bullseye" color={color} size={16} /> }} />
      <Tabs.Screen name="history" options={{ title: 'Historial', tabBarIcon: ({ color }) => <FontAwesome5 name="calendar" color={color} size={16} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes', tabBarIcon: ({ color }) => <FontAwesome5 name="cog" color={color} size={16} /> }} />
    </Tabs>
  );
}
