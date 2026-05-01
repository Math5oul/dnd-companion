import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { formatModifier } from '../../src/lib/dice';
import { getRaceById } from '../../src/data/races';
import { getClassById } from '../../src/data/classes';
import { AbilityName } from '../../src/types/character';
import { useSettingsStore, THEMES } from '../../src/store/settingsStore';
import { useI18n, translateRaceName, translateClassName } from '../../src/lib/i18n';
import { convertSpeed } from '../../src/lib/units';

const ABILITY_KEYS: { key: AbilityName; icon: string }[] = [
  { key: 'strength', icon: '💪' },
  { key: 'dexterity', icon: '🏹' },
  { key: 'constitution', icon: '🛡️' },
  { key: 'intelligence', icon: '📚' },
  { key: 'wisdom', icon: '🔮' },
  { key: 'charisma', icon: '✨' },
];

export default function Step5Review() {
  const router = useRouter();
  const { draft, saveCharacter } = useCharacterStore();
  const [saving, setSaving] = useState(false);
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const styles = useMemo(() => makeStyles(c), [theme]);
  const { t, language, units } = useI18n();

  const ABILITIES = useMemo(() => ABILITY_KEYS.map(({ key, icon }) => ({
    key,
    icon,
    label: t[`${key}Short` as keyof typeof t] as string,
  })), [language]);

  const race = getRaceById(draft.race);
  const cls = getClassById(draft.className);

  const handleSave = async () => {
    setSaving(true);
    const char = await saveCharacter();
    setSaving(false);
    if (char) {
      router.replace(`/character/${char.id}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.step}>{t.stepOf(5, 5)}</Text>
      <Text style={styles.title}>{t.step5Title}</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroName}>{draft.name}</Text>
        <Text style={styles.heroSub}>
          {race ? translateRaceName(race.id, race.name, language) : ''} ·{' '}
          {cls ? translateClassName(cls.id, cls.name, language) : ''} · {t.level} {draft.level}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>{t.attributes}</Text>
      <View style={styles.statsGrid}>
        {ABILITIES.map(({ key, label, icon }) => {
          const score = draft.abilityScores[key];
          return (
            <View key={key} style={styles.statBox}>
              <Text style={styles.statIcon}>{icon}</Text>
              <Text style={styles.statScore}>{score}</Text>
              <Text style={styles.statMod}>{formatModifier(score)}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          );
        })}
      </View>

      {race && (
        <>
          <Text style={styles.sectionTitle}>{t.raceLabel} {translateRaceName(race.id, race.name, language)}</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{language === 'en' ? (race.descriptionEn ?? race.description) : race.description}</Text>
            <Text style={styles.infoText}>⚡ {t.speedLabel(convertSpeed(race.speed, units, language))}</Text>
            <Text style={styles.infoText}>🎯 {t.traitsLabel} {(language === 'en' ? (race.traitsEn ?? race.traits) : race.traits).join(', ')}</Text>
          </View>
        </>
      )}

      {cls && (
        <>
          <Text style={styles.sectionTitle}>{t.classLabel} {translateClassName(cls.id, cls.name, language)}</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{language === 'en' ? (cls.descriptionEn ?? cls.description) : cls.description}</Text>
            <Text style={styles.infoText}>❤️ {t.hitDieLabel(cls.hitDie)}</Text>
            <Text style={styles.infoText}>⚡ {t.primaryAbilityLabel}: {language === 'en' ? (cls.primaryAbilityEn ?? cls.primaryAbility) : cls.primaryAbility}</Text>
            {cls.spellcaster && (
              <Text style={styles.infoTextMagic}>✨ {t.spellcasterLabel}</Text>
            )}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color={c.bg} />
        ) : (
          <Text style={styles.btnText}>{t.createChar}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

type ThemeColors = typeof THEMES[keyof typeof THEMES];
const makeStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { padding: 24, paddingBottom: 48 },
  step: { color: c.subtext, fontSize: 13, marginBottom: 6 },
  title: { color: c.accent, fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  heroCard: {
    backgroundColor: c.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 24,
  },
  heroName: { color: c.accent, fontSize: 26, fontWeight: 'bold' },
  heroSub: { color: c.subtext, fontSize: 15, marginTop: 6 },
  sectionTitle: { color: c.accent, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  statBox: {
    width: '30%',
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.border,
  },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statScore: { color: c.text, fontSize: 22, fontWeight: 'bold' },
  statMod: { color: c.subtext, fontSize: 14, fontWeight: '600' },
  statLabel: { color: c.subtext, fontSize: 11, marginTop: 2 },
  infoCard: {
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: c.border,
  },
  infoText: { color: c.subtext, fontSize: 13, lineHeight: 20 },
  infoTextMagic: { color: '#c090ff', fontSize: 13 },
  btn: {
    backgroundColor: c.accent,
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: c.bg, fontWeight: 'bold', fontSize: 17 },
});

const ABILITIES: { key: AbilityName; label: string; icon: string }[] = [
  { key: 'strength', label: 'Força', icon: '💪' },
  { key: 'dexterity', label: 'Destreza', icon: '🏹' },
  { key: 'constitution', label: 'Constituição', icon: '🛡️' },
  { key: 'intelligence', label: 'Inteligência', icon: '📚' },
  { key: 'wisdom', label: 'Sabedoria', icon: '🔮' },
  { key: 'charisma', label: 'Carisma', icon: '✨' },
];

