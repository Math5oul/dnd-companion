import { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';
import { Character } from '../src/types/character';
import { formatModifier } from '../src/lib/dice';

export default function HomeScreen() {
  const router = useRouter();
  const { characters, loading, fetchCharacters, deleteCharacter } = useCharacterStore();

  // Recarrega sempre que a tela ganha foco (ex: ao voltar da ficha após deletar)
  useFocusEffect(
    useCallback(() => {
      fetchCharacters();
    }, [])
  );

  const confirmDelete = (char: Character) => {
    Alert.alert(
      'Deletar personagem',
      `Tem certeza que deseja deletar ${char.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: () => deleteCharacter(char.id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/character/${item.id}`)}
      onLongPress={() => confirmDelete(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.charName}>{item.name}</Text>
        <Text style={styles.charLevel}>Nível {item.level}</Text>
      </View>
      <Text style={styles.charSub}>
        {item.race} · {item.className}
      </Text>
      <View style={styles.cardStats}>
        <Text style={styles.statBadge}>
          ❤️ {item.hp}/{item.maxHp}
        </Text>
        <Text style={styles.statBadge}>
          💪 FOR {formatModifier(item.abilityScores.strength)}
        </Text>
        <Text style={styles.statBadge}>
          🧠 INT {formatModifier(item.abilityScores.intelligence)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ D&D Companion</Text>
      {loading ? (
        <ActivityIndicator color="#c9a84c" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum personagem ainda.{'\n'}Crie o primeiro!</Text>
          }
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create/step1-name')}>
        <Text style={styles.fabText}>+ Novo Personagem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c9a84c',
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#2d1a00',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c9a84c33',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  charName: { fontSize: 20, fontWeight: 'bold', color: '#c9a84c' },
  charLevel: { fontSize: 14, color: '#a07030', fontWeight: '600' },
  charSub: { fontSize: 14, color: '#8a7060', marginTop: 4 },
  cardStats: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  statBadge: {
    backgroundColor: '#3d2a00',
    color: '#e0c070',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
  },
  empty: { color: '#8a7060', textAlign: 'center', marginTop: 60, fontSize: 16, lineHeight: 26 },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#c9a84c',
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  fabText: { color: '#1a0a00', fontWeight: 'bold', fontSize: 16 },
});
