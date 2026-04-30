import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { formatModifier } from '../../src/lib/dice';
import { getRaceById } from '../../src/data/races';
import { getClassById } from '../../src/data/classes';
import { AbilityName } from '../../src/types/character';

const ABILITIES: { key: AbilityName; label: string; icon: string }[] = [
  { key: 'strength', label: 'Força', icon: '💪' },
  { key: 'dexterity', label: 'Destreza', icon: '🏹' },
  { key: 'constitution', label: 'Constituição', icon: '🛡️' },
  { key: 'intelligence', label: 'Inteligência', icon: '📚' },
  { key: 'wisdom', label: 'Sabedoria', icon: '🔮' },
  { key: 'charisma', label: 'Carisma', icon: '✨' },
];

export default function Step5Review() {
  const router = useRouter();
  const { draft, saveCharacter } = useCharacterStore();
  const [saving, setSaving] = useState(false);

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
      <Text style={styles.step}>Passo 5 de 5</Text>
      <Text style={styles.title}>Revisão Final</Text>

      {/* Header do personagem */}
      <View style={styles.heroCard}>
        <Text style={styles.heroName}>{draft.name}</Text>
        <Text style={styles.heroSub}>
          {race?.name} · {cls?.name} · Nível {draft.level}
        </Text>
      </View>

      {/* Atributos */}
      <Text style={styles.sectionTitle}>Atributos</Text>
      <View style={styles.statsGrid}>
        {ABILITIES.map(({ key, label, icon }) => {
          const score = draft.abilityScores[key];
          return (
            <View key={key} style={styles.statBox}>
              <Text style={styles.statIcon}>{icon}</Text>
              <Text style={styles.statScore}>{score}</Text>
              <Text style={styles.statMod}>{formatModifier(score)}</Text>
              <Text style={styles.statLabel}>{label.slice(0, 3).toUpperCase()}</Text>
            </View>
          );
        })}
      </View>

      {/* Raça */}
      {race && (
        <>
          <Text style={styles.sectionTitle}>Raça: {race.name}</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{race.description}</Text>
            <Text style={styles.infoText}>⚡ Velocidade: {race.speed}ft</Text>
            <Text style={styles.infoText}>
              🎯 Traços: {race.traits.join(', ')}
            </Text>
          </View>
        </>
      )}

      {/* Classe */}
      {cls && (
        <>
          <Text style={styles.sectionTitle}>Classe: {cls.name}</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{cls.description}</Text>
            <Text style={styles.infoText}>❤️ Dado de Vida: d{cls.hitDie}</Text>
            <Text style={styles.infoText}>⚡ Atributo Principal: {cls.primaryAbility}</Text>
            {cls.spellcaster && (
              <Text style={styles.infoTextMagic}>✨ Conjurador de magias</Text>
            )}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#1a0a00" />
        ) : (
          <Text style={styles.btnText}>⚔️ Criar Personagem!</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  content: { padding: 24, paddingBottom: 48 },
  step: { color: '#a07030', fontSize: 13, marginBottom: 6 },
  title: { color: '#c9a84c', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  heroCard: {
    backgroundColor: '#2d1a00',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c9a84c55',
    marginBottom: 24,
  },
  heroName: { color: '#c9a84c', fontSize: 26, fontWeight: 'bold' },
  heroSub: { color: '#a07030', fontSize: 15, marginTop: 6 },
  sectionTitle: { color: '#c9a84c', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  statBox: {
    width: '30%',
    backgroundColor: '#2d1a00',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c9a84c33',
  },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statScore: { color: '#e0c070', fontSize: 22, fontWeight: 'bold' },
  statMod: { color: '#a07030', fontSize: 14, fontWeight: '600' },
  statLabel: { color: '#6a5040', fontSize: 11, marginTop: 2 },
  infoCard: {
    backgroundColor: '#2d1a00',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#c9a84c22',
  },
  infoText: { color: '#9a8070', fontSize: 13, lineHeight: 20 },
  infoTextMagic: { color: '#c090ff', fontSize: 13 },
  btn: {
    backgroundColor: '#c9a84c',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#1a0a00', fontWeight: 'bold', fontSize: 17 },
});
