import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../../src/store/characterStore';
import { getSpellsByClassAndMaxLevel, getSpellById, Spell, SCHOOL_ICON, SCHOOL_COLOR } from '../../../src/data/spells';
import { getClassById } from '../../../src/data/classes';

const LEVEL_LABELS = ['Truque', '1°', '2°', '3°', '4°', '5°'];

export default function SpellSelection() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { characters, toggleSpell } = useCharacterStore();

  const char = characters.find((c) => c.id === id);
  const cls = getClassById(char?.className ?? '');

  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);

  const knownSpells = new Set(char?.spells ?? []);

  // Limites por nível do personagem
  const levelIndex = (char?.level ?? 1) - 1;
  const maxCantrips = cls?.knownCantrips?.[levelIndex] ?? Infinity;
  const maxSpells   = cls?.knownSpells?.[levelIndex]   ?? Infinity;

  // Contagem atual separada por tipo
  const knownCantripCount = [...knownSpells].filter(
    (sid) => (getSpellById(sid)?.level ?? -1) === 0
  ).length;
  const knownSpellCount = [...knownSpells].filter(
    (sid) => (getSpellById(sid)?.level ?? -1) > 0
  ).length;

  // Nível máximo de spell slots disponíveis
  const maxSpellLevel = useMemo(() => {
    if (!char?.spellSlots) return 0;
    const levels = Object.keys(char.spellSlots).map(Number);
    return levels.length > 0 ? Math.max(...levels) : 0;
  }, [char]);

  const spells = useMemo(() => {
    if (!char) return [];
    // cantrips (level 0) + spells até o nível máximo de slot
    return getSpellsByClassAndMaxLevel(char.className, maxSpellLevel);
  }, [char, maxSpellLevel]);

  const filtered = useMemo(() => {
    return spells.filter((s) => {
      const matchLevel = filterLevel === null || s.level === filterLevel;
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [spells, filterLevel, search]);

  // Agrupa por nível para exibição
  const grouped = useMemo(() => {
    const groups: { level: number; label: string; items: Spell[] }[] = [];
    const levels = [...new Set(filtered.map((s) => s.level))].sort((a, b) => a - b);
    levels.forEach((lvl) => {
      groups.push({
        level: lvl,
        label: lvl === 0 ? 'Truques (Cantrips)' : `${LEVEL_LABELS[lvl]} Nível`,
        items: filtered.filter((s) => s.level === lvl),
      });
    });
    return groups;
  }, [filtered]);

  if (!char || !cls?.spellcaster) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          {!char ? 'Personagem não encontrado.' : `${cls?.name ?? 'Esta classe'} não é conjuradora.`}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderSpell = (spell: Spell) => {
    const known = knownSpells.has(spell.id);
    const atLimit = !known && (
      spell.level === 0 ? knownCantripCount >= maxCantrips : knownSpellCount >= maxSpells
    );
    const schoolColor = SCHOOL_COLOR[spell.school];
    return (
      <TouchableOpacity
        key={spell.id}
        style={[styles.spellCard, known && styles.spellCardKnown, atLimit && styles.spellCardDisabled]}
        onPress={() => !atLimit && toggleSpell(char.id, spell.id)}
        activeOpacity={atLimit ? 1 : 0.75}
      >
        {atLimit && (
          <Text style={styles.limitTag}>
            {spell.level === 0 ? 'Limite de truques atingido' : 'Limite de magias atingido'}
          </Text>
        )}
        <View style={styles.spellLeft}>
          <View style={[styles.schoolBadge, { borderColor: schoolColor }]}>
            <Text style={styles.schoolIcon}>{SCHOOL_ICON[spell.school]}</Text>
          </View>
          <View style={styles.spellInfo}>
            <View style={styles.spellNameRow}>
              <Text style={[styles.spellName, known && styles.spellNameKnown]}>{spell.name}</Text>
              {known && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.schoolLabel, { color: schoolColor }]}>{spell.school}</Text>
            <Text style={styles.spellDesc} numberOfLines={2}>{spell.description}</Text>
            <View style={styles.spellMeta}>
              <Text style={styles.metaTag}>⏱ {spell.castingTime}</Text>
              <Text style={styles.metaTag}>📍 {spell.range}</Text>
              <Text style={styles.metaTag}>⌛ {spell.duration}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📖 Grimório de {char.name}</Text>
        <Text style={styles.subtitle}>
          {cls.name} · Nível {char.level}
        </Text>
        <View style={styles.limitsRow}>
          <Text style={[styles.limitBadge, knownCantripCount >= maxCantrips && styles.limitBadgeFull]}>
            ✨ {knownCantripCount}/{maxCantrips === Infinity ? '∞' : maxCantrips} truques
          </Text>
          <Text style={[styles.limitBadge, knownSpellCount >= maxSpells && styles.limitBadgeFull]}>
            📚 {knownSpellCount}/{maxSpells === Infinity ? '∞' : maxSpells} magias
          </Text>
        </View>
      </View>

      {/* Busca */}
      <TextInput
        style={styles.search}
        placeholder="Buscar magia..."
        placeholderTextColor="#6a5040"
        value={search}
        onChangeText={setSearch}
      />

      {/* Filtro por nível */}
      <View style={styles.levelFilter}>
        <TouchableOpacity
          style={[styles.levelBtn, filterLevel === null && styles.levelBtnActive]}
          onPress={() => setFilterLevel(null)}
        >
          <Text style={[styles.levelBtnText, filterLevel === null && styles.levelBtnTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        {[...new Set(spells.map((s) => s.level))].sort((a, b) => a - b).map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.levelBtn, filterLevel === lvl && styles.levelBtnActive]}
            onPress={() => setFilterLevel(filterLevel === lvl ? null : lvl)}
          >
            <Text style={[styles.levelBtnText, filterLevel === lvl && styles.levelBtnTextActive]}>
              {LEVEL_LABELS[lvl]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={grouped}
        keyExtractor={(item) => `group-${item.level}`}
        contentContainerStyle={styles.list}
        renderItem={({ item: group }) => (
          <View>
            <Text style={styles.groupHeader}>{group.label}</Text>
            {group.items.map(renderSpell)}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma magia encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  center: { flex: 1, backgroundColor: '#1a0a00', alignItems: 'center', justifyContent: 'center' },

  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  title: { color: '#c9a84c', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#a07030', fontSize: 13, marginTop: 2 },
  limitsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  limitBadge: {
    color: '#a07030',
    fontSize: 12,
    backgroundColor: '#2d1a00',
    borderWidth: 1,
    borderColor: '#c9a84c44',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  limitBadgeFull: { borderColor: '#c9a84c', color: '#c9a84c' },

  search: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#2d1a00',
    borderWidth: 1,
    borderColor: '#c9a84c44',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#e0c070',
    fontSize: 15,
  },

  levelFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  levelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2d1a00',
    borderWidth: 1,
    borderColor: '#c9a84c33',
  },
  levelBtnActive: { backgroundColor: '#c9a84c', borderColor: '#c9a84c' },
  levelBtnText: { color: '#a07030', fontSize: 12, fontWeight: '600' },
  levelBtnTextActive: { color: '#1a0a00' },

  list: { paddingHorizontal: 16, paddingBottom: 40 },

  groupHeader: {
    color: '#c9a84c',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 4,
  },

  spellCard: {
    backgroundColor: '#2d1a00',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#c9a84c22',
  },
  spellCardKnown: {
    borderColor: '#c9a84c88',
    backgroundColor: '#3a2200',
  },
  spellCardDisabled: {
    opacity: 0.4,
  },
  limitTag: {
    color: '#c9a84c',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  spellLeft: { flexDirection: 'row', gap: 10 },
  schoolBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  schoolIcon: { fontSize: 18 },
  spellInfo: { flex: 1 },
  spellNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  spellName: { color: '#a07030', fontSize: 15, fontWeight: '700' },
  spellNameKnown: { color: '#c9a84c' },
  checkmark: { color: '#50d080', fontSize: 14, fontWeight: 'bold' },
  schoolLabel: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  spellDesc: { color: '#8a7060', fontSize: 12, lineHeight: 17, marginBottom: 6 },
  spellMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaTag: {
    backgroundColor: '#1a0f00',
    color: '#6a5040',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  emptyText: { color: '#6a5040', textAlign: 'center', marginTop: 40, fontSize: 15 },
  backLink: { color: '#a07030', fontSize: 16, marginTop: 12 },
});
