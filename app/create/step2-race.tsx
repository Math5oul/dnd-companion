import { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { RACES, Race } from '../../src/data/races';
import { AbilityName } from '../../src/types/character';
import { useSettingsStore, THEMES } from '../../src/store/settingsStore';
import { useI18n, translateRaceName } from '../../src/lib/i18n';
import { convertSpeed } from '../../src/lib/units';

export default function Step2Race() {
  const router = useRouter();
  const { draft, setDraftRace } = useCharacterStore();
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const styles = useMemo(() => makeStyles(c), [theme]);
  const { t, language, units } = useI18n();

  const ABILITY_LABELS: Record<AbilityName, string> = useMemo(() => ({
    strength: t.strengthShort,
    dexterity: t.dexterityShort,
    constitution: t.constitutionShort,
    intelligence: t.intelligenceShort,
    wisdom: t.wisdomShort,
    charisma: t.charismaShort,
  }), [language]);

  const renderRace = ({ item }: { item: Race }) => {
    const selected = draft.race === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => setDraftRace(item.id)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.raceName, selected && styles.raceNameSelected]}>
            {translateRaceName(item.id, item.name, language)}
          </Text>
          <Text style={styles.speed}>🏃 {convertSpeed(item.speed, units, language)}</Text>
        </View>
        <Text style={styles.desc}>{language === 'en' ? (item.descriptionEn ?? item.description) : item.description}</Text>

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
          {(language === 'en' ? (item.traitsEn ?? item.traits) : item.traits).map((tr) => (
            <Text key={tr} style={styles.trait}>• {tr}</Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.step}>{t.stepOf(2, 5)}</Text>
      <Text style={styles.title}>{t.step2Title(draft.name)}</Text>
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
        <Text style={styles.btnText}>{t.continueBtn}</Text>
      </TouchableOpacity>
    </View>
  );
}

type ThemeColors = typeof THEMES[keyof typeof THEMES];
const makeStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  step: { color: c.subtext, fontSize: 13, paddingHorizontal: 24, paddingTop: 20 },
  title: { color: c.accent, fontSize: 22, fontWeight: 'bold', padding: 24, paddingBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: c.border,
  },
  cardSelected: { borderColor: c.accent },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  raceName: { fontSize: 18, fontWeight: 'bold', color: c.subtext },
  raceNameSelected: { color: c.accent },
  speed: { color: c.subtext, fontSize: 13 },
  desc: { color: c.subtext, fontSize: 13, marginTop: 4, marginBottom: 8, lineHeight: 18 },
  bonusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  bonusBadge: {
    backgroundColor: '#1a3020',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bonusText: { color: '#50d080', fontSize: 12, fontWeight: '600' },
  traitRow: { gap: 2 },
  trait: { color: c.subtext, fontSize: 12 },
  btn: {
    margin: 16,
    backgroundColor: c.accent,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: c.bg, fontWeight: 'bold', fontSize: 17 },
});

