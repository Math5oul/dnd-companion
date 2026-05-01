import { useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useSettingsStore, THEMES } from '../../src/store/settingsStore';
import { useI18n } from '../../src/lib/i18n';

export default function Step1Name() {
  const router = useRouter();
  const { draft, setDraftName } = useCharacterStore();
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const styles = useMemo(() => makeStyles(c), [theme]);
  const { t } = useI18n();

  const canContinue = draft.name.trim().length >= 2;

  return (
    <View style={styles.container}>
      <Text style={styles.step}>{t.stepOf(1, 5)}</Text>
      <Text style={styles.title}>{t.step1Title}</Text>
      <Text style={styles.subtitle}>{t.step1Subtitle}</Text>
      <TextInput
        style={styles.input}
        placeholder={t.step1Placeholder}
        placeholderTextColor={c.subtext}
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
        <Text style={styles.btnText}>{t.continueBtn}</Text>
      </TouchableOpacity>
    </View>
  );
}

type ThemeColors = typeof THEMES[keyof typeof THEMES];
const makeStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg, padding: 24, paddingTop: 48 },
  step: { color: c.subtext, fontSize: 13, marginBottom: 8 },
  title: { color: c.accent, fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: c.subtext, fontSize: 15, marginBottom: 32, lineHeight: 22 },
  input: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    padding: 16,
    color: c.text,
    fontSize: 18,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: c.accent,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: c.bg, fontWeight: 'bold', fontSize: 17 },
});
