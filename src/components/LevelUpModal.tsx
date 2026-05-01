import { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getFeaturesForLevel, getOptionNameMapForClass, ClassFeature } from '../data/classFeatures';
import { useI18n } from '../lib/i18n';
import { localizeFeatureName, localizeFeatureDesc } from '../lib/translations';

interface Props {
  visible: boolean;
  characterName: string;
  classId: string;
  currentLevel: number;
  existingTraits?: string[];
  onCancel: () => void;
  onConfirm: (selectedTraits: string[]) => void;
}

export default function LevelUpModal({
  visible,
  characterName,
  classId,
  currentLevel,
  existingTraits = [],
  onCancel,
  onConfirm,
}: Props) {
  const newLevel = currentLevel + 1;
  const features = useMemo(() => getFeaturesForLevel(classId, newLevel), [classId, newLevel]);
  const { language } = useI18n();

  // choices: featureId -> selectedOptionId
  const [choices, setChoices] = useState<Record<string, string>>({});

  const choiceFeatures = features.filter((f) => f.type === 'choice');
  const autoFeatures = features.filter((f) => f.type === 'auto');

  const allChoicesMade = choiceFeatures.every((f) => choices[f.id]);

  // Names of options the character has already chosen in previous level-ups
  const previouslyChosenNames = useMemo(() => {
    const optionNameMap = getOptionNameMapForClass(classId);
    const names = new Set<string>();
    existingTraits.forEach((traitId) => {
      const name = optionNameMap.get(traitId);
      if (name) names.add(name);
    });
    return names;
  }, [classId, existingTraits]);

  // For each choice feature, compute which option *names* are already taken
  // by a sibling choice at this same level OR by a previous level-up
  const takenNamesByFeatureId = useMemo(() => {
    const result: Record<string, Set<string>> = {};
    choiceFeatures.forEach((f) => {
      const taken = new Set<string>(previouslyChosenNames);
      choiceFeatures.forEach((other) => {
        if (other.id !== f.id && choices[other.id]) {
          const selectedOpt = other.options?.find((o) => o.id === choices[other.id]);
          if (selectedOpt) taken.add(selectedOpt.name);
        }
      });
      result[f.id] = taken;
    });
    return result;
  }, [choices, choiceFeatures, previouslyChosenNames]);

  const handleConfirm = () => {
    // Collect all trait IDs: auto features + chosen options
    const traitIds: string[] = [];
    autoFeatures.forEach((f) => traitIds.push(f.id));
    choiceFeatures.forEach((f) => {
      if (choices[f.id]) traitIds.push(choices[f.id]);
    });
    setChoices({});
    onConfirm(traitIds);
  };

  const handleCancel = () => {
    setChoices({});
    onCancel();
  };

  const hasFeatures = features.length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Text style={styles.emoji}>⬆️</Text>
            <Text style={styles.title}>Level Up!</Text>
            <Text style={styles.subtitle}>
              {characterName} está subindo para o{'\n'}
              <Text style={styles.levelHighlight}>Nível {newLevel}</Text>
            </Text>

            {/* Auto features */}
            {autoFeatures.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>✨ Novas Habilidades</Text>
                {autoFeatures.map((f) => (
                  <FeatureCard key={f.id} feature={f} language={language} />
                ))}
              </View>
            )}

            {/* Choice features */}
            {choiceFeatures.map((f) => (
              <View key={f.id} style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 {localizeFeatureName(f.id, f.name, language)}</Text>
                <Text style={styles.choiceDesc}>{f.description}</Text>
                {f.options?.map((opt) => {
                  const selected = choices[f.id] === opt.id;
                  const takenByOther = !selected && (takenNamesByFeatureId[f.id]?.has(opt.name) ?? false);
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.optionCard,
                        selected && styles.optionCardSelected,
                        takenByOther && styles.optionCardDisabled,
                      ]}
                      onPress={takenByOther ? undefined : () => setChoices((prev) => ({ ...prev, [f.id]: opt.id }))}
                      activeOpacity={takenByOther ? 1 : 0.75}
                    >
                      <View style={styles.optionHeader}>
                        <View style={[styles.radio, selected && styles.radioSelected]}>
                          {selected && <View style={styles.radioDot} />}
                        </View>
                        <Text style={[
                          styles.optionName,
                          selected && styles.optionNameSelected,
                          takenByOther && styles.optionNameDisabled,
                        ]}>
                          {localizeFeatureName(opt.id, opt.name, language)}{takenByOther ? ' ✗' : ''}
                        </Text>
                      </View>
                      <Text style={[styles.optionDesc, takenByOther && styles.optionDescDisabled]}>
                        {takenByOther ? 'Já escolhida em outra seleção.' : localizeFeatureDesc(opt.id, opt.description, language)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {!hasFeatures && (
              <View style={styles.section}>
                <Text style={styles.noFeatures}>
                  Nenhuma habilidade especial neste nível.{'\n'}HP e spell slots são atualizados automaticamente.
                </Text>
              </View>
            )}

            <Text style={styles.hpNote}>
              🎲 HP aumenta automaticamente ao confirmar (dado de vida + CON).
            </Text>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, !allChoicesMade && styles.confirmBtnDisabled]}
              onPress={allChoicesMade ? handleConfirm : undefined}
              activeOpacity={allChoicesMade ? 0.8 : 1}
            >
              <Text style={styles.confirmText}>
                {allChoicesMade
                  ? `Subir para Nível ${newLevel} 🎉`
                  : `Faça todas as escolhas`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FeatureCard({ feature, language }: { feature: ClassFeature; language: string }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureName}>{localizeFeatureName(feature.id, feature.name, language as 'pt' | 'en')}</Text>
      <Text style={styles.featureDesc}>{localizeFeatureDesc(feature.id, feature.description, language as 'pt' | 'en')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    width: '100%',
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#7c3aed',
    overflow: 'hidden',
  },
  scroll: {
    padding: 20,
    paddingBottom: 8,
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e0c060',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 16,
  },
  levelHighlight: {
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#7c3aed',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  featureCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#50d080',
  },
  featureName: {
    color: '#e0e0ff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  featureDesc: {
    color: '#9090b0',
    fontSize: 12,
    lineHeight: 18,
  },
  choiceDesc: {
    color: '#9090b0',
    fontSize: 12,
    marginBottom: 8,
  },
  optionCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#2a2a4a',
  },
  optionCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#1e1040',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4a4a6a',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#7c3aed',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7c3aed',
  },
  optionCardDisabled: {
    borderColor: '#1e1e2e',
    backgroundColor: '#111120',
    opacity: 0.5,
  },
  optionName: {
    color: '#c0c0e0',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  optionNameSelected: {
    color: '#e0c060',
  },
  optionNameDisabled: {
    color: '#505060',
  },
  optionDesc: {
    color: '#7878a0',
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 26,
  },
  optionDescDisabled: {
    color: '#404050',
  },
  noFeatures: {
    color: '#9090b0',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingVertical: 8,
  },
  hpNote: {
    color: '#606080',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  buttons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
    padding: 12,
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2a2a4a',
    alignItems: 'center',
  },
  cancelText: {
    color: '#a0a0c0',
    fontWeight: 'bold',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#3a2060',
  },
  confirmText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
