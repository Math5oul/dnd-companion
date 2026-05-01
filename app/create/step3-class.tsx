import { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { CLASSES, DnDClass } from '../../src/data/classes';
import { useSettingsStore, THEMES } from '../../src/store/settingsStore';
import { useI18n, translateClassName } from '../../src/lib/i18n';

export default function Step3Class() {
  const router = useRouter();
  const { draft, setDraftClass } = useCharacterStore();
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const styles = useMemo(() => makeStyles(c), [theme]);
  const { t, language } = useI18n();

  const renderClass = ({ item }: { item: DnDClass }) => {
    const selected = draft.className === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => setDraftClass(item.id)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.className, selected && styles.classNameSelected]}>
            {translateClassName(item.id, item.name, language)}
          </Text>
          <Text style={styles.hitDie}>d{item.hitDie}</Text>
        </View>
        <Text style={styles.desc}>{language === 'en' ? (item.descriptionEn ?? item.description) : item.description}</Text>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>⚡ {language === 'en' ? (item.primaryAbilityEn ?? item.primaryAbility) : item.primaryAbility}</Text>
          </View>
          {item.spellcaster && (
            <View style={[styles.tag, styles.tagMagic]}>
              <Text style={styles.tagTextMagic}>{t.spellcasterTag}</Text>
            </View>
          )}
        </View>
        <Text style={styles.saves}>
          {t.savesLabel} {(language === 'en' ? (item.savingThrowsEn ?? item.savingThrows) : item.savingThrows).join(' · ')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.step}>{t.stepOf(3, 5)}</Text>
      <Text style={styles.title}>{t.step3Title(draft.name)}</Text>
      <FlatList
        data={CLASSES}
        keyExtractor={(cl) => cl.id}
        renderItem={renderClass}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={[styles.btn, !draft.className && styles.btnDisabled]}
        disabled={!draft.className}
        onPress={() => router.push('/create/step4-abilities')}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  className: { fontSize: 18, fontWeight: 'bold', color: c.subtext },
  classNameSelected: { color: c.accent },
  hitDie: {
    backgroundColor: '#3a0000',
    color: '#ff6060',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
  desc: { color: c.subtext, fontSize: 13, marginTop: 6, marginBottom: 8, lineHeight: 18 },
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
  saves: { color: c.subtext, fontSize: 12 },
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