import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { CLASSES, DnDClass } from '../../src/data/classes';

export default function Step3Class() {
  const router = useRouter();
  const { draft, setDraftClass } = useCharacterStore();

  const renderClass = ({ item }: { item: DnDClass }) => {
    const selected = draft.className === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => setDraftClass(item.id)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.className, selected && styles.classNameSelected]}>
            {item.name}
          </Text>
          <Text style={styles.hitDie}>d{item.hitDie}</Text>
        </View>
        <Text style={styles.desc}>{item.description}</Text>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>⚡ {item.primaryAbility}</Text>
          </View>
          {item.spellcaster && (
            <View style={[styles.tag, styles.tagMagic]}>
              <Text style={styles.tagTextMagic}>✨ Conjurador</Text>
            </View>
          )}
        </View>
        <Text style={styles.saves}>
          Saves: {item.savingThrows.join(' · ')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Passo 3 de 5</Text>
      <Text style={styles.title}>Qual é a classe de {'\n'}{draft.name}?</Text>
      <FlatList
        data={CLASSES}
        keyExtractor={(c) => c.id}
        renderItem={renderClass}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={[styles.btn, !draft.className && styles.btnDisabled]}
        disabled={!draft.className}
        onPress={() => router.push('/create/step4-abilities')}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  className: { fontSize: 18, fontWeight: 'bold', color: '#a07030' },
  classNameSelected: { color: '#c9a84c' },
  hitDie: {
    backgroundColor: '#3a0000',
    color: '#ff6060',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
  desc: { color: '#9a8070', fontSize: 13, marginTop: 6, marginBottom: 8, lineHeight: 18 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  tag: {
    backgroundColor: '#2a2000',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagMagic: { backgroundColor: '#1a0a2a' },
  tagText: { color: '#e0a030', fontSize: 12 },
  tagTextMagic: { color: '#c090ff', fontSize: 12 },
  saves: { color: '#6a5040', fontSize: 12 },
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
