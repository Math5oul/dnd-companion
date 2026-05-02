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
import { useTabStore } from '../src/store/tabStore';
import { useSettingsStore, THEMES } from '../src/store/settingsStore';
import { useI18n, translateRaceName, translateClassName } from '../src/lib/i18n';
import { getRaceById } from '../src/data/races';
import { getClassById } from '../src/data/classes';
import { Character } from '../src/types/character';
import { formatModifier } from '../src/lib/dice';

export default function HomeScreen() {
  const router = useRouter();
  const { characters, loading, fetchCharacters, deleteCharacter } = useCharacterStore();
  const { openTab } = useTabStore();
  const { theme } = useSettingsStore();
  const colors = THEMES[theme];
  const { t, language } = useI18n();

  useFocusEffect(
    useCallback(() => {
      fetchCharacters();
    }, [])
  );

  const handleOpen = (item: Character) => {
    openTab(item.id, item.name);
    router.push(`/character/${item.id}` as any);
  };

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
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => handleOpen(item)}
      onLongPress={() => confirmDelete(item)}
      activeOpacity={0.75}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.charName, { color: colors.accent }]}>{item.name}</Text>
        <Text style={[styles.charLevel, { color: colors.subtext }]}>Nível {item.level}</Text>
      </View>
      <Text style={[styles.charSub, { color: colors.subtext }]}>
        {translateRaceName(item.race, getRaceById(item.race)?.name ?? item.race, language)} · {translateClassName(item.className, getClassById(item.className)?.name ?? item.className, language)}
      </Text>
      <View style={styles.cardStats}>
        <Text style={[styles.statBadge, { backgroundColor: colors.bg, color: '#e05555' }]}>
          ❤️ {item.hp}/{item.maxHp}
        </Text>
        {(item.gold ?? 0) > 0 && (
          <Text style={[styles.statBadge, { backgroundColor: colors.bg, color: '#d4a017' }]}>
            🪙 {item.gold ?? 0} gp
          </Text>
        )}
      </View>
      <View style={[styles.cardStats, { marginTop: 4 }]}>
        <Text style={[styles.statBadge, styles.abilityBadge, { backgroundColor: colors.bg, color: colors.text }]}>
          💪 {formatModifier(item.abilityScores.strength)}
        </Text>
        <Text style={[styles.statBadge, styles.abilityBadge, { backgroundColor: colors.bg, color: colors.text }]}>
          🏃 {formatModifier(item.abilityScores.dexterity)}
        </Text>
        <Text style={[styles.statBadge, styles.abilityBadge, { backgroundColor: colors.bg, color: colors.text }]}>
          🛡️ {formatModifier(item.abilityScores.constitution)}
        </Text>
        <Text style={[styles.statBadge, styles.abilityBadge, { backgroundColor: colors.bg, color: colors.text }]}>
          🧠 {formatModifier(item.abilityScores.intelligence)}
        </Text>
        <Text style={[styles.statBadge, styles.abilityBadge, { backgroundColor: colors.bg, color: colors.text }]}>
          🦉 {formatModifier(item.abilityScores.wisdom)}
        </Text>
        <Text style={[styles.statBadge, styles.abilityBadge, { backgroundColor: colors.bg, color: colors.text }]}>
          ✨ {formatModifier(item.abilityScores.charisma)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {loading ? (
        <ActivityIndicator color={colors.accent} size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={[styles.title, { color: colors.accent }]}>{t.yourChars}</Text>
          }
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.subtext }]}>{t.noCharsYet}</Text>
          }
        />
      )}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/create/step1-name')}
      >
        <Text style={[styles.fabText, { color: colors.bg }]}>{t.newChar}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  list: { padding: 16, paddingBottom: 120 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  charName: { fontSize: 20, fontWeight: 'bold' },
  charLevel: { fontSize: 14, fontWeight: '600' },
  charSub: { fontSize: 14, marginTop: 4 },
  cardStats: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  statBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
  },
  abilityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontSize: 11,
    borderRadius: 6,
  },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 16, lineHeight: 26 },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  fabText: { fontWeight: 'bold', fontSize: 16 },
});
