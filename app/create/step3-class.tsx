import { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { CLASSES, DnDClass } from '../../src/data/classes';
import { SKILLS, CLASS_SKILL_OPTIONS, CLASS_SKILL_COUNT } from '../../src/data/skills';
import { useSettingsStore, THEMES } from '../../src/store/settingsStore';
import { useI18n, translateClassName } from '../../src/lib/i18n';

export default function Step3Class() {
  const router = useRouter();
  const { draft, setDraftClass, setDraftSkillProficiencies } = useCharacterStore();
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const styles = useMemo(() => makeStyles(c), [theme]);
  const { t, language } = useI18n();
  const [skillModalOpen, setSkillModalOpen] = useState(false);

  const requiredSkillCount = draft.className ? (CLASS_SKILL_COUNT[draft.className] ?? 0) : 0;
  const availableSkillIds = useMemo(() => {
    if (!draft.className) return [];
    const fromClass = CLASS_SKILL_OPTIONS[draft.className] ?? [];
    return fromClass.length > 0 ? fromClass : SKILLS.map((s) => s.id);
  }, [draft.className]);
  const selectedSkills = draft.skillProficiencies ?? [];

  const toggleSkill = (skillId: string) => {
    const selected = selectedSkills.includes(skillId);
    if (selected) {
      setDraftSkillProficiencies(selectedSkills.filter((id) => id !== skillId));
      return;
    }
    if (selectedSkills.length >= requiredSkillCount) return;
    setDraftSkillProficiencies([...selectedSkills, skillId]);
  };

  const handleContinue = () => {
    if (!draft.className) return;
    if (requiredSkillCount > 0 && selectedSkills.length !== requiredSkillCount) {
      setSkillModalOpen(true);
      return;
    }
    router.push('/create/step4-abilities');
  };

  const renderClass = ({ item }: { item: DnDClass }) => {
    const selected = draft.className === item.id;
    const classSkillCount = CLASS_SKILL_COUNT[item.id] ?? 0;
    const selectedSkillNames = selected
      ? selectedSkills
          .map((sid) => SKILLS.find((s) => s.id === sid))
          .filter((s): s is (typeof SKILLS)[number] => !!s)
          .map((s) => language === 'en' ? s.nameEn : s.name)
      : [];
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => {
          setDraftClass(item.id);
          setDraftSkillProficiencies([]);
        }}
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
        {selected && classSkillCount > 0 && (
          <View style={styles.skillSummaryBox}>
            <View style={styles.skillSummaryHeader}>
              <Text style={styles.skillSummaryTitle}>
                {language === 'en' ? 'Class Skills' : 'Perícias da Classe'}
              </Text>
              <Text style={styles.skillSummaryCount}>{selectedSkills.length}/{classSkillCount}</Text>
            </View>
            {selectedSkillNames.length > 0 ? (
              <View style={styles.skillChipRow}>
                {selectedSkillNames.map((name) => (
                  <View key={name} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>✓ {name}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.skillSummaryHint}>
                {language === 'en' ? 'No skills selected yet.' : 'Nenhuma perícia escolhida ainda.'}
              </Text>
            )}
            <TouchableOpacity style={styles.skillSummaryBtn} onPress={() => setSkillModalOpen(true)}>
              <Text style={styles.skillSummaryBtnText}>
                {selectedSkills.length === classSkillCount
                  ? (language === 'en' ? 'Edit skills' : 'Editar perícias')
                  : (language === 'en' ? 'Choose skills' : 'Escolher perícias')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
        onPress={handleContinue}
      >
        <Text style={styles.btnText}>{t.continueBtn}</Text>
      </TouchableOpacity>

      <Modal visible={skillModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {language === 'en' ? 'Choose Skill Proficiencies' : 'Escolha as Proficiências de Perícia'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {language === 'en'
                ? `${selectedSkills.length}/${requiredSkillCount} selected`
                : `${selectedSkills.length}/${requiredSkillCount} escolhidas`}
            </Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {availableSkillIds.map((sid) => {
                const skill = SKILLS.find((s) => s.id === sid);
                if (!skill) return null;
                const selected = selectedSkills.includes(sid);
                return (
                  <TouchableOpacity
                    key={sid}
                    style={[styles.skillRow, selected && styles.skillRowSelected]}
                    onPress={() => toggleSkill(sid)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.skillText, selected && styles.skillTextSelected]}>
                      {selected ? '✓ ' : ''}{language === 'en' ? skill.nameEn : skill.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setSkillModalOpen(false)}>
                <Text style={styles.cancelBtnText}>{language === 'en' ? 'Cancel' : 'Cancelar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, selectedSkills.length !== requiredSkillCount && styles.confirmBtnDisabled]}
                onPress={() => {
                  if (selectedSkills.length !== requiredSkillCount) return;
                  setSkillModalOpen(false);
                  router.push('/create/step4-abilities');
                }}
              >
                <Text style={styles.confirmBtnText}>{language === 'en' ? 'Confirm' : 'Confirmar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: c.bg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
  },
  modalTitle: { color: c.accent, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  modalSubtitle: { color: c.subtext, fontSize: 12, marginBottom: 10 },
  skillRow: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
  },
  skillRowSelected: { borderColor: c.accent },
  skillText: { color: c.text, fontSize: 14 },
  skillTextSelected: { color: c.accent, fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  cancelBtnText: { color: c.subtext, fontWeight: '600' },
  confirmBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: c.accent,
  },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmBtnText: { color: c.bg, fontWeight: '700' },

  skillSummaryBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    backgroundColor: c.bg,
    padding: 10,
  },
  skillSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillSummaryTitle: { color: c.text, fontSize: 12, fontWeight: '700' },
  skillSummaryCount: { color: c.accent, fontSize: 12, fontWeight: '700' },
  skillSummaryHint: { color: c.subtext, fontSize: 12, marginBottom: 8 },
  skillChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  skillChip: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  skillChipText: { color: c.text, fontSize: 11, fontWeight: '600' },
  skillSummaryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: c.accent,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skillSummaryBtnText: { color: c.bg, fontSize: 12, fontWeight: '700' },
});