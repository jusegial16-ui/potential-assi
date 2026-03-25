import { Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: theme.colors.text }
});
