import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettingsStore, AppTheme, AppLanguage, UnitSystem, THEMES } from '../store/settingsStore';
import { useI18n } from '../lib/i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: Props) {
  const { theme, language, units, setTheme, setLanguage, setUnits } = useSettingsStore();
  const { t } = useI18n();
  const colors = THEMES[theme];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.accent }]}>{t.settingsTitle}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.close, { color: colors.subtext }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Theme */}
          <Text style={[styles.sectionLabel, { color: colors.subtext }]}>{t.themeLabel}</Text>
          <View style={styles.optionRow}>
            {(['dark', 'sepia', 'abyss'] as AppTheme[]).map((th) => (
              <TouchableOpacity
                key={th}
                style={[
                  styles.optionBtn,
                  { backgroundColor: THEMES[th].surface, borderColor: THEMES[th].accent },
                  theme === th && styles.optionSelected,
                ]}
                onPress={() => setTheme(th)}
              >
                <View style={[styles.themeCircle, { backgroundColor: THEMES[th].bg, borderColor: THEMES[th].accent }]} />
                <Text style={[styles.optionText, { color: THEMES[th].text }]}>
                  {th === 'dark' ? t.themeDark : th === 'sepia' ? t.themeSepia : t.themeAbyss}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.subtext }]}>{t.languageLabel}</Text>
          <View style={styles.optionRow}>
            {(['pt', 'en'] as AppLanguage[]).map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.optionBtn,
                  { backgroundColor: colors.bg, borderColor: colors.border },
                  language === l && { borderColor: colors.accent },
                ]}
                onPress={() => setLanguage(l)}
              >
                <Text style={[styles.optionText, { color: language === l ? colors.accent : colors.text }]}>
                  {l === 'pt' ? t.langPt : t.langEn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.subtext }]}>{t.unitsLabel}</Text>
          <View style={styles.optionRow}>
            {(['metric', 'imperial'] as UnitSystem[]).map((u) => (
              <TouchableOpacity
                key={u}
                style={[
                  styles.optionBtn,
                  { backgroundColor: colors.bg, borderColor: colors.border },
                  units === u && { borderColor: colors.accent },
                ]}
                onPress={() => setUnits(u)}
              >
                <Text style={[styles.optionText, { color: units === u ? colors.accent : colors.text }]}>
                  {u === 'metric' ? t.unitsMetric : t.unitsImperial}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: colors.accent }]}
            onPress={onClose}
          >
            <Text style={[styles.doneBtnText, { color: colors.bg }]}>{t.settingsClose}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000088',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 48,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  close: { fontSize: 22, padding: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
  },
  optionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  optionSelected: { borderWidth: 2.5 },
  themeCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  optionText: { fontSize: 13, fontWeight: '600' },
  doneBtn: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: { fontWeight: 'bold', fontSize: 15 },
});
