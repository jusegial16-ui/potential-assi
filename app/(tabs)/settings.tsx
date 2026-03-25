import { useState } from 'react';
import { Button, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsScreen() {
  const { settings, setPin } = useAppStore();
  const [pin, setPinValue] = useState(settings.pinCode || '');

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Privacidad</Text>
        <Text>Bloqueo opcional con PIN local.</Text>
        <TextInput placeholder="PIN (4 dígitos)" value={pin} onChangeText={setPinValue} keyboardType="number-pad" secureTextEntry style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <Button title="Guardar PIN" onPress={async () => { await setPin(pin); }} />
        <Button title="Quitar PIN" onPress={async () => { await setPin(undefined); }} />
      </Card>
      {settings.pinEnabled && <Button title="Probar bloqueo" onPress={() => router.push('/lock')} />}
    </AppContainer>
  );
}
