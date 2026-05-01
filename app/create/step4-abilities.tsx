import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { AbilityName } from '../../src/types/character';
import { rollAbilitySet, formatModifier } from '../../src/lib/dice';
import { getRaceById } from '../../src/data/races';
import { useSettingsStore, THEMES } from '../../src/store/settingsStore';
import { useI18n } from '../../src/lib/i18n';

const ABILITY_KEYS: { key: AbilityName; icon: string }[] = [
  { key: 'strength', icon: '💪' },
  { key: 'dexterity', icon: '🏹' },
  { key: 'constitution', icon: '🛡️' },
  { key: 'intelligence', icon: '📚' },
  { key: 'wisdom', icon: '🔮' },
  { key: 'charisma', icon: '✨' },
];

export default function Step4Abilities() {
  const router = useRouter();
  const { draft, rolledValues, assignedValues, setRolledValues, assignValue, unassignValue } =
    useCharacterStore();
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const styles = useMemo(() => makeStyles(c), [theme]);
  const { t, language } = useI18n();

  const ABILITIES = useMemo(() => ABILITY_KEYS.map(({ key, icon }) => ({
    key,
    icon,
    label: t[`${key}` as keyof typeof t] as string,
  })), [language]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [indexByAbility, setIndexByAbility] = useState<Partial<Record<AbilityName, number>>>({});

  const race = getRaceById(draft.race);

  const handleRoll = () => {
    const values = rollAbilitySet().sort((a, b) => b - a);
    setRolledValues(values);
    setSelectedIndex(null);
    setUsedIndices(new Set());
    setIndexByAbility({});
  };

  const handleSelectDie = (index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  const handleSelectAbility = (ability: AbilityName) => {
    if (selectedIndex === null) return;
    const value = rolledValues[selectedIndex];

    if (assignedValues[ability] !== undefined) {
      const prevIndex = indexByAbility[ability];
      if (prevIndex !== undefined) {
        setUsedIndices((prev) => { const s = new Set(prev); s.delete(prevIndex); return s; });
        setIndexByAbility((prev) => { const n = { ...prev }; delete n[ability]; return n; });
      }
      unassignValue(ability);
    }
    assignValue(ability, value);
    setUsedIndices((prev) => new Set(prev).add(selectedIndex));
    setIndexByAbility((prev) => ({ ...prev, [ability]: selectedIndex }));
    setSelectedIndex(null);
  };

  const getRacialBonus = (ability: AbilityName): number => {
    if (!race) return 0;
    return race.bonuses.filter((b) => b.ability === ability).reduce((s, b) => s + b.value, 0);
  };

  const getFinalScore = (ability: AbilityName): number => {
    const base = assignedValues[ability] ?? 0;
    return base + getRacialBonus(ability);
  };

  const isComplete = Object.keys(assignedValues).length === 6;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.step}>{t.stepOf(4, 5)}</Text>
      <Text style={styles.title}>{t.step4Title}</Text>
      <Text style={styles.subtitle}>{t.step4Subtitle}</Text>

      <TouchableOpacity style={styles.rollBtn} onPress={handleRoll}>
        <Text style={styles.rollBtnText}>🎲 {rolledValues.length > 0 ? t.rerollDice : t.rollDice}</Text>
      </TouchableOpacity>

      {rolledValues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.selectValueHint}</Text>
          <View style={styles.diceRow}>
            {rolledValues.map((v, i) => {
              const isUsed = usedIndices.has(i);
              const isSelected = selectedIndex === i;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dieFace,
                    isUsed && styles.dieUsed,
                    isSelected && styles.dieSelected,
                  ]}
                  onPress={() => !isUsed && handleSelectDie(i)}
                  disabled={isUsed}
                >
                  <Text style={[styles.dieValue, isUsed && styles.dieValueUsed]}>{v}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.section}>
        {ABILITIES.map(({ key, label, icon }) => {
          const base = assignedValues[key];
          const racial = getRacialBonus(key);
          const final = base !== undefined ? getFinalScore(key) : null;
          const isActive = selectedIndex !== null && base === undefined;

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.abilityRow,
                isActive && styles.abilityRowActive,
                base !== undefined && styles.abilityRowFilled,
              ]}
              onPress={() => handleSelectAbility(key)}
              disabled={selectedIndex === null}
            >
              <Text style={styles.abilityIcon}>{icon}</Text>
              <View style={styles.abilityInfo}>
                <Text style={styles.abilityLabel}>{label}</Text>
                {racial > 0 && (
                  <Text style={styles.racialBonus}>+{racial} {t.racial}</Text>
                )}
              </View>
              <View style={styles.abilityScoreBox}>
                {base !== undefined ? (
                  <>
                    <Text style={styles.abilityScore}>{final}</Text>
                    <Text style={styles.abilityMod}>{formatModifier(final!)}</Text>
                    {racial > 0 && (
                      <Text style={styles.abilityBase}>({base})</Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.abilityEmpty}>—</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {isComplete && (
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/create/step5-review')}>
          <Text style={styles.btnText}>{t.reviewBtn}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

type ThemeColors = typeof THEMES[keyof typeof THEMES];
const makeStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { padding: 24, paddingBottom: 48 },
  step: { color: c.subtext, fontSize: 13, marginBottom: 6 },
  title: { color: c.accent, fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: c.subtext, fontSize: 14, marginBottom: 20, lineHeight: 20 },
  rollBtn: {
    backgroundColor: c.surface,
    borderWidth: 2,
    borderColor: c.accent,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  rollBtnText: { color: c.accent, fontWeight: 'bold', fontSize: 17 },
  section: { marginBottom: 20 },
  sectionLabel: { color: c.subtext, fontSize: 13, marginBottom: 10 },
  diceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dieFace: {
    width: 52,
    height: 52,
    backgroundColor: c.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: c.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dieSelected: { borderColor: c.accent },
  dieUsed: { opacity: 0.4 },
  dieValue: { color: c.accent, fontSize: 20, fontWeight: 'bold' },
  dieValueUsed: { color: c.subtext },
  abilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  abilityRowActive: { borderColor: c.accent },
  abilityRowFilled: { borderColor: c.border },
  abilityIcon: { fontSize: 22, marginRight: 12 },
  abilityInfo: { flex: 1 },
  abilityLabel: { color: c.accent, fontSize: 15, fontWeight: '600' },
  racialBonus: { color: '#50d080', fontSize: 11, marginTop: 2 },
  abilityScoreBox: { alignItems: 'center', minWidth: 60 },
  abilityScore: { color: c.text, fontSize: 22, fontWeight: 'bold' },
  abilityMod: { color: c.subtext, fontSize: 13 },
  abilityBase: { color: c.subtext, fontSize: 11 },
  abilityEmpty: { color: c.subtext, fontSize: 20 },
  btn: {
    backgroundColor: c.accent,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: c.bg, fontWeight: 'bold', fontSize: 17 },
});const ABILITIES: { key: AbilityName; label: string; icon: string }[] = [
  { key: 'strength', label: 'Força', icon: '💪' },
  { key: 'dexterity', label: 'Destreza', icon: '🏹' },
  { key: 'constitution', label: 'Constituição', icon: '🛡️' },
  { key: 'intelligence', label: 'Inteligência', icon: '📚' },
  { key: 'wisdom', label: 'Sabedoria', icon: '🔮' },
  { key: 'charisma', label: 'Carisma', icon: '✨' },
];

