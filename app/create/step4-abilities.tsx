import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { AbilityName } from '../../src/types/character';
import { rollAbilitySet, formatModifier } from '../../src/lib/dice';
import { getRaceById } from '../../src/data/races';

const ABILITIES: { key: AbilityName; label: string; icon: string }[] = [
  { key: 'strength', label: 'Força', icon: '💪' },
  { key: 'dexterity', label: 'Destreza', icon: '🏹' },
  { key: 'constitution', label: 'Constituição', icon: '🛡️' },
  { key: 'intelligence', label: 'Inteligência', icon: '📚' },
  { key: 'wisdom', label: 'Sabedoria', icon: '🔮' },
  { key: 'charisma', label: 'Carisma', icon: '✨' },
];

export default function Step4Abilities() {
  const router = useRouter();
  const { draft, rolledValues, assignedValues, setRolledValues, assignValue, unassignValue } =
    useCharacterStore();

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
      // Libera o dado previamente atribuído a este atributo
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
      <Text style={styles.step}>Passo 4 de 5</Text>
      <Text style={styles.title}>Distribua os Atributos</Text>
      <Text style={styles.subtitle}>
        Role 4d6 (descarta o menor) e atribua cada valor a um atributo.
      </Text>

      {/* Botão de rolar */}
      <TouchableOpacity style={styles.rollBtn} onPress={handleRoll}>
        <Text style={styles.rollBtnText}>🎲 {rolledValues.length > 0 ? 'Rolar Novamente' : 'Rolar Dados'}</Text>
      </TouchableOpacity>

      {/* Valores rolados */}
      {rolledValues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Selecione um valor e depois um atributo:</Text>
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

      {/* Atributos */}
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
                  <Text style={styles.racialBonus}>+{racial} racial</Text>
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
          <Text style={styles.btnText}>Revisar Personagem →</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  content: { padding: 24, paddingBottom: 48 },
  step: { color: '#a07030', fontSize: 13, marginBottom: 6 },
  title: { color: '#c9a84c', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#8a7060', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  rollBtn: {
    backgroundColor: '#3d1a00',
    borderWidth: 2,
    borderColor: '#c9a84c',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  rollBtnText: { color: '#c9a84c', fontWeight: 'bold', fontSize: 17 },
  section: { marginBottom: 20 },
  sectionLabel: { color: '#8a7060', fontSize: 13, marginBottom: 10 },
  diceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dieFace: {
    width: 52,
    height: 52,
    backgroundColor: '#2d1a00',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#c9a84c44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dieSelected: { borderColor: '#c9a84c', backgroundColor: '#4d2a00' },
  dieUsed: { borderColor: '#3a2a1a', backgroundColor: '#1a0f00', opacity: 0.5 },
  dieValue: { color: '#c9a84c', fontSize: 20, fontWeight: 'bold' },
  dieValueUsed: { color: '#5a4030' },
  abilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d1a00',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#c9a84c22',
  },
  abilityRowActive: { borderColor: '#c9a84c88', backgroundColor: '#3d2500' },
  abilityRowFilled: { borderColor: '#c9a84c44' },
  abilityIcon: { fontSize: 22, marginRight: 12 },
  abilityInfo: { flex: 1 },
  abilityLabel: { color: '#c9a84c', fontSize: 15, fontWeight: '600' },
  racialBonus: { color: '#50d080', fontSize: 11, marginTop: 2 },
  abilityScoreBox: { alignItems: 'center', minWidth: 60 },
  abilityScore: { color: '#e0c070', fontSize: 22, fontWeight: 'bold' },
  abilityMod: { color: '#a07030', fontSize: 13 },
  abilityBase: { color: '#6a5040', fontSize: 11 },
  abilityEmpty: { color: '#4a3020', fontSize: 20 },
  btn: {
    backgroundColor: '#c9a84c',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#1a0a00', fontWeight: 'bold', fontSize: 17 },
});
