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

const TOTAL_POINTS = 72;
const MIN_SCORE = 3;
const MAX_SCORE = 20;
const DEFAULT_SCORE = 8; // 6×8 = 48, leaving 24 points to distribute

type Mode = 'dice' | 'points';

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

  // ── Dice mode state ──────────────────────────────────────────────────────
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [indexByAbility, setIndexByAbility] = useState<Partial<Record<AbilityName, number>>>({});

  // ── Points mode state ────────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>('dice');
  const [pointScores, setPointScores] = useState<Record<AbilityName, number>>({
    strength: DEFAULT_SCORE, dexterity: DEFAULT_SCORE, constitution: DEFAULT_SCORE,
    intelligence: DEFAULT_SCORE, wisdom: DEFAULT_SCORE, charisma: DEFAULT_SCORE,
  });

  const race = getRaceById(draft.race);

  const pointsSpent = Object.values(pointScores).reduce((a, b) => a + b, 0);
  const pointsRemaining = TOTAL_POINTS - pointsSpent;

  const adjustPoint = (ability: AbilityName, delta: number) => {
    const cur = pointScores[ability];
    const next = cur + delta;
    if (next < MIN_SCORE || next > MAX_SCORE) return;
    if (delta > 0 && pointsRemaining <= 0) return;
    const updated = { ...pointScores, [ability]: next };
    setPointScores(updated);
    // Keep store in sync so assignedValues reflects points mode
    assignValue(ability, next);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    if (m === 'points') {
      // Reset store assignments to current pointScores
      ABILITY_KEYS.forEach(({ key }) => assignValue(key, pointScores[key]));
    }
    if (m === 'dice') {
      // Clear store assignments
      ABILITY_KEYS.forEach(({ key }) => unassignValue(key));
      setSelectedIndex(null);
      setUsedIndices(new Set());
      setIndexByAbility({});
    }
  };

  const handleRoll = () => {
    const values = rollAbilitySet().sort((a, b) => b - a);
    setRolledValues(values);
    setSelectedIndex(null);
    setUsedIndices(new Set());
    setIndexByAbility({});
    ABILITY_KEYS.forEach(({ key }) => unassignValue(key));
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

  const getFinalScore = (ability: AbilityName, base: number): number =>
    base + getRacialBonus(ability);

  const diceComplete = Object.keys(assignedValues).length === 6;
  const pointsComplete = pointsRemaining === 0;
  const isComplete = mode === 'dice' ? diceComplete : pointsComplete;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.step}>{t.stepOf(4, 5)}</Text>
      <Text style={styles.title}>{t.step4Title}</Text>

      {/* ── Mode selector ── */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'dice' && styles.modeBtnActive]}
          onPress={() => switchMode('dice')}
        >
          <Text style={[styles.modeBtnText, mode === 'dice' && styles.modeBtnTextActive]}>
            🎲 {language === 'en' ? 'Roll' : 'Rolar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'dice' && styles.modeBtnInactive]}
          onPress={() => {
            switchMode('dice');
            setRolledValues([15, 14, 13, 12, 10, 8]);
            setSelectedIndex(null);
            setUsedIndices(new Set());
            setIndexByAbility({});
            ABILITY_KEYS.forEach(({ key }) => unassignValue(key));
          }}
        >
          <Text style={[styles.modeBtnText, { color: c.subtext }]}>
            📋 {language === 'en' ? 'Standard Array' : 'Array Padrão'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'points' && styles.modeBtnActive]}
          onPress={() => switchMode('points')}
        >
          <Text style={[styles.modeBtnText, mode === 'points' && styles.modeBtnTextActive]}>
            ⚖️ {language === 'en' ? '72 pts' : '72 pts'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ══ DICE MODE ══════════════════════════════════════════════════════ */}
      {mode === 'dice' && (
        <>
          <TouchableOpacity style={styles.rollBtn} onPress={handleRoll}>
            <Text style={styles.rollBtnText}>
              🎲 {rolledValues.length > 0 ? t.rerollDice : t.rollDice}
            </Text>
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
                      style={[styles.dieFace, isUsed && styles.dieUsed, isSelected && styles.dieSelected]}
                      onPress={() => !isUsed && handleSelectDie(i)}
                      disabled={isUsed}
                    >
                      <Text style={[styles.dieValue, isUsed && styles.dieValueUsed]}>{v}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selectedIndex === null && !diceComplete && (
                <Text style={styles.selectHint}>
                  {language === 'en' ? '☝️ Tap a value above, then tap an ability below' : '☝️ Toque num valor acima e depois num atributo abaixo'}
                </Text>
              )}
            </View>
          )}

          <View style={styles.section}>
            {ABILITIES.map(({ key, label, icon }) => {
              const base = assignedValues[key];
              const racial = getRacialBonus(key);
              const final = base !== undefined ? getFinalScore(key, base) : null;
              const isActive = selectedIndex !== null && base === undefined;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.abilityRow, isActive && styles.abilityRowActive, base !== undefined && styles.abilityRowFilled]}
                  onPress={() => {
                    if (selectedIndex !== null) {
                      handleSelectAbility(key);
                    } else if (base !== undefined) {
                      const prevIndex = indexByAbility[key];
                      if (prevIndex !== undefined) {
                        setUsedIndices((prev) => { const s = new Set(prev); s.delete(prevIndex); return s; });
                        setIndexByAbility((prev) => { const n = { ...prev }; delete n[key]; return n; });
                      }
                      unassignValue(key);
                    }
                  }}
                >
                  <Text style={styles.abilityIcon}>{icon}</Text>
                  <View style={styles.abilityInfo}>
                    <Text style={styles.abilityLabel}>{label}</Text>
                    {racial > 0 && <Text style={styles.racialBonus}>+{racial} {t.racial}</Text>}
                  </View>
                  <View style={styles.abilityScoreBox}>
                    {base !== undefined ? (
                      <>
                        <Text style={styles.abilityScore}>{final}</Text>
                        <Text style={styles.abilityMod}>{formatModifier(final!)}</Text>
                        {racial > 0 && <Text style={styles.abilityBase}>({base})</Text>}
                      </>
                    ) : (
                      <Text style={styles.abilityEmpty}>—</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* ══ POINTS MODE ════════════════════════════════════════════════════ */}
      {mode === 'points' && (
        <>
          {/* Points counter */}
          <View style={[styles.pointsCounter, pointsRemaining === 0 && styles.pointsCounterDone]}>
            <Text style={[styles.pointsCounterLabel, pointsRemaining === 0 && { color: '#50d080' }]}>
              {language === 'en' ? 'Points remaining' : 'Pontos restantes'}
            </Text>
            <Text style={[styles.pointsCounterValue, pointsRemaining === 0 && { color: '#50d080' }]}>
              {pointsRemaining}
            </Text>
            <Text style={[styles.pointsCounterSub, pointsRemaining === 0 && { color: '#50d080' }]}>
              / {TOTAL_POINTS}
            </Text>
          </View>

          <View style={styles.section}>
            {ABILITIES.map(({ key, label, icon }) => {
              const base = pointScores[key];
              const racial = getRacialBonus(key);
              const final = getFinalScore(key, base);
              const canIncrease = base < MAX_SCORE && pointsRemaining > 0;
              const canDecrease = base > MIN_SCORE;
              return (
                <View key={key} style={styles.abilityRow}>
                  <Text style={styles.abilityIcon}>{icon}</Text>
                  <View style={styles.abilityInfo}>
                    <Text style={styles.abilityLabel}>{label}</Text>
                    {racial > 0 && <Text style={styles.racialBonus}>+{racial} {t.racial}</Text>}
                  </View>
                  <View style={styles.pointsControls}>
                    <TouchableOpacity
                      style={[styles.adjBtn, !canDecrease && styles.adjBtnDisabled]}
                      onPress={() => adjustPoint(key, -1)}
                      disabled={!canDecrease}
                    >
                      <Text style={styles.adjBtnText}>−</Text>
                    </TouchableOpacity>
                    <View style={styles.abilityScoreBox}>
                      <Text style={styles.abilityScore}>{final}</Text>
                      <Text style={styles.abilityMod}>{formatModifier(final)}</Text>
                      {racial > 0 && <Text style={styles.abilityBase}>({base})</Text>}
                    </View>
                    <TouchableOpacity
                      style={[styles.adjBtn, !canIncrease && styles.adjBtnDisabled]}
                      onPress={() => adjustPoint(key, 1)}
                      disabled={!canIncrease}
                    >
                      <Text style={styles.adjBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}

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
  title: { color: c.accent, fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  // Mode selector
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  modeBtn: {
    flex: 1, borderRadius: 10, padding: 10, alignItems: 'center',
    backgroundColor: c.surface, borderWidth: 2, borderColor: c.border,
  },
  modeBtnActive: { borderColor: c.accent, backgroundColor: c.accent + '22' },
  modeBtnInactive: { borderColor: c.border },
  modeBtnText: { color: c.subtext, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  modeBtnTextActive: { color: c.accent },
  // Roll button
  rollBtn: {
    backgroundColor: c.surface, borderWidth: 2, borderColor: c.accent,
    borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 20,
  },
  rollBtnText: { color: c.accent, fontWeight: 'bold', fontSize: 16 },
  section: { marginBottom: 20 },
  sectionLabel: { color: c.subtext, fontSize: 13, marginBottom: 10 },
  selectHint: { color: c.accent, fontSize: 12, marginTop: 8, textAlign: 'center' },
  diceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dieFace: {
    width: 52, height: 52, backgroundColor: c.surface, borderRadius: 8,
    borderWidth: 2, borderColor: c.border, alignItems: 'center', justifyContent: 'center',
  },
  dieSelected: { borderColor: c.accent },
  dieUsed: { opacity: 0.4 },
  dieValue: { color: c.accent, fontSize: 20, fontWeight: 'bold' },
  dieValueUsed: { color: c.subtext },
  // Points counter
  pointsCounter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: c.surface, borderRadius: 12, padding: 14,
    borderWidth: 2, borderColor: c.border, marginBottom: 20,
  },
  pointsCounterDone: { borderColor: '#50d080' },
  pointsCounterLabel: { color: c.subtext, fontSize: 13, flex: 1 },
  pointsCounterValue: { color: c.accent, fontSize: 32, fontWeight: 'bold' },
  pointsCounterSub: { color: c.subtext, fontSize: 13 },
  // Ability rows
  abilityRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface,
    borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: c.border,
  },
  abilityRowActive: { borderColor: c.accent },
  abilityRowFilled: { borderColor: c.border },
  abilityIcon: { fontSize: 22, marginRight: 12 },
  abilityInfo: { flex: 1 },
  abilityLabel: { color: c.accent, fontSize: 15, fontWeight: '600' },
  racialBonus: { color: '#50d080', fontSize: 11, marginTop: 2 },
  abilityScoreBox: { alignItems: 'center', minWidth: 52 },
  abilityScore: { color: c.text, fontSize: 22, fontWeight: 'bold' },
  abilityMod: { color: c.subtext, fontSize: 13 },
  abilityBase: { color: c.subtext, fontSize: 11 },
  abilityEmpty: { color: c.subtext, fontSize: 20 },
  // Points +/- controls
  pointsControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  adjBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: c.accent + '33',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.accent,
  },
  adjBtnDisabled: { opacity: 0.3 },
  adjBtnText: { color: c.accent, fontSize: 20, fontWeight: 'bold', lineHeight: 26 },
  btn: {
    backgroundColor: c.accent, borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 10,
  },
  btnText: { color: c.bg, fontWeight: 'bold', fontSize: 17 },
});
