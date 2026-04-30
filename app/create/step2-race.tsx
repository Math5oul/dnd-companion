import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { RACES, Race } from '../../src/data/races';
import { AbilityName } from '../../src/types/character';

const ABILITY_LABELS: Record<AbilityName, string> = {
  strength: 'FOR',
  dexterity: 'DES',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'SAB',
  charisma: 'CAR',
};

export default function Step2Race() {
  const router = useRouter();
  const { draft, setDraftRace } = useCharacterStore();

  const renderRace = ({ item }: { item: Race }) => {
    const selected = draft.race === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => setDraftRace(item.id)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.raceName, selected && styles.raceNameSelected]}>
            {item.name}
          </Text>
          <Text style={styles.speed}>🏃 {item.speed}ft</Text>
        </View>
        <Text style={styles.desc}>{item.description}</Text>

        <View style={styles.bonusRow}>
          {item.bonuses.map((b) => (
            <View key={b.ability} style={styles.bonusBadge}>
              <Text style={styles.bonusText}>
                {ABILITY_LABELS[b.ability]} +{b.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.traitRow}>
          {item.traits.map((t) => (
            <Text key={t} style={styles.trait}>• {t}</Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Passo 2 de 5</Text>
      <Text style={styles.title}>Escolha a raça de {'\n'}{useCharacterStore.getState().draft.name}</Text>
      <FlatList
        data={RACES}
        keyExtractor={(r) => r.id}
        renderItem={renderRace}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={[styles.btn, !draft.race && styles.btnDisabled]}
        disabled={!draft.race}
        onPress={() => router.push('/create/step3-class')}
      >
        <Text style={styles.btnText}>Continuar →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  step: { color: '#a07030', fontSize: 13, paddingHorizontal: 24, paddingTop: 20 },
  title: { color: '#c9a84c', fontSize: 22, fontWeight: 'bold', padding: 24, paddingBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#2d1a00',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c9a84c22',
  },
  cardSelected: { borderColor: '#c9a84c', backgroundColor: '#3d2500' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  raceName: { fontSize: 18, fontWeight: 'bold', color: '#a07030' },
  raceNameSelected: { color: '#c9a84c' },
  speed: { color: '#8a7060', fontSize: 13 },
  desc: { color: '#9a8070', fontSize: 13, marginTop: 4, marginBottom: 8, lineHeight: 18 },
  bonusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  bonusBadge: {
    backgroundColor: '#1a3020',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bonusText: { color: '#50d080', fontSize: 12, fontWeight: '600' },
  traitRow: { gap: 2 },
  trait: { color: '#8a7060', fontSize: 12 },
  btn: {
    margin: 16,
    backgroundColor: '#c9a84c',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#5a4020', opacity: 0.6 },
  btnText: { color: '#1a0a00', fontWeight: 'bold', fontSize: 17 },
});
