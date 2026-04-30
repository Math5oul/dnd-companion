import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';

export default function Step1Name() {
  const router = useRouter();
  const { draft, setDraftName } = useCharacterStore();

  const canContinue = draft.name.trim().length >= 2;

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Passo 1 de 5</Text>
      <Text style={styles.title}>Como se chama seu personagem?</Text>
      <Text style={styles.subtitle}>
        Escolha um nome que ecoe pelos salões da taverna.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Arathorn, Elspeth, Zuko..."
        placeholderTextColor="#6a5040"
        value={draft.name}
        onChangeText={setDraftName}
        autoFocus
        maxLength={40}
      />
      <TouchableOpacity
        style={[styles.btn, !canContinue && styles.btnDisabled]}
        disabled={!canContinue}
        onPress={() => router.push('/create/step2-race')}
      >
        <Text style={styles.btnText}>Continuar →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00', padding: 24, paddingTop: 48 },
  step: { color: '#a07030', fontSize: 13, marginBottom: 8 },
  title: { color: '#c9a84c', fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#8a7060', fontSize: 15, marginBottom: 32, lineHeight: 22 },
  input: {
    backgroundColor: '#2d1a00',
    borderWidth: 1,
    borderColor: '#c9a84c55',
    borderRadius: 10,
    padding: 16,
    color: '#e0c070',
    fontSize: 18,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: '#c9a84c',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#5a4020', opacity: 0.6 },
  btnText: { color: '#1a0a00', fontWeight: 'bold', fontSize: 17 },
});
