import { useState } from 'react';
import { Button, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';

export default function LockScreen() {
  const pin = useAppStore((s) => s.settings.pinCode);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Ingresa tu PIN</Text>
        <TextInput value={value} onChangeText={setValue} keyboardType="number-pad" secureTextEntry style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        {!!error && <Text style={{ color: 'red' }}>{error}</Text>}
        <Button
          title="Desbloquear"
          onPress={() => {
            if (value === pin) router.back();
            else setError('PIN incorrecto');
          }}
        />
      </Card>
    </AppContainer>
  );
}
