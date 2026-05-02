import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useSettingsStore, THEMES } from '../store/settingsStore';
import { useI18n } from '../lib/i18n';
import { rollDie, getModifier } from '../lib/dice';
import { getClassById } from '../data/classes';
import type { Character } from '../types/character';

interface Props {
  visible: boolean;
  character: Character;
  onCancel: () => void;
  onConfirm: (diceSpent: number, hpGained: number) => void;
}

export default function ShortRestModal({ visible, character, onCancel, onConfirm }: Props) {
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const { t, language } = useI18n();

  const cls = getClassById(character.className);
  const hitDie = cls?.hitDie ?? 8;
  const conMod = getModifier(character.abilityScores.constitution);
  const totalDice = character.level;
  const usedBefore = character.hitDiceUsed ?? 0;
  const availableDice = totalDice - usedBefore;

  const isWarlock = character.className === 'warlock';
  const isMonk = character.className === 'monk';

  const [diceSpent, setDiceSpent] = useState(0);
  const [hpGained, setHpGained] = useState(0);
  const [rollLog, setRollLog] = useState<string[]>([]);
  const [healMode, setHealMode] = useState(true);

  const handleSpendDie = () => {
    const diceLeft = availableDice - diceSpent;
    if (diceLeft <= 0) return;
    const roll = rollDie(hitDie);
    const currentHp = character.hp + hpGained;
    const hpLeft = character.maxHp - currentHp;
    const gain = Math.max(0, Math.min(roll + conMod, hpLeft));
    const logEntry = t.shortRestHealResult(roll, conMod, gain);
    setDiceSpent((d) => d + 1);
    setHpGained((h) => h + gain);
    setRollLog((l) => [...l, logEntry]);
  };

  const handleConfirm = () => {
    onConfirm(healMode ? diceSpent : 0, healMode ? hpGained : 0);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const reset = () => {
    setDiceSpent(0);
    setHpGained(0);
    setRollLog([]);
    setHealMode(true);
  };

  const diceLeft = availableDice - diceSpent;
  const hpFull = character.hp >= character.maxHp;

  const styles = StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: '#000000bb',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    box: {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      borderWidth: 1,
      borderColor: c.border,
    },
    title: {
      color: c.accent,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: 'center',
    },
    hint: {
      color: c.subtext,
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 16,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    statLabel: {
      color: c.subtext,
      fontSize: 14,
    },
    statValue: {
      color: c.text,
      fontSize: 14,
      fontWeight: '600',
    },
    hpGain: {
      color: '#4caf50',
      fontSize: 14,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: 12,
    },
    recoverBanner: {
      backgroundColor: c.accent + '22',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      gap: 4,
    },
    recoverText: {
      color: c.accent,
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center',
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      paddingHorizontal: 4,
    },
    toggleLabel: {
      color: c.text,
      fontSize: 14,
      fontWeight: '600',
    },
    spendBtn: {
      backgroundColor: c.accent,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 8,
    },
    spendBtnDisabled: {
      opacity: 0.4,
    },
    spendBtnText: {
      color: c.bg,
      fontWeight: '700',
      fontSize: 15,
    },
    logContainer: {
      maxHeight: 100,
      marginBottom: 12,
    },
    logEntry: {
      color: c.subtext,
      fontSize: 12,
      lineHeight: 20,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'flex-end',
    },
    cancelBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    cancelText: {
      color: c.subtext,
      fontWeight: '600',
    },
    confirmBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: c.accent,
    },
    confirmText: {
      color: c.bg,
      fontWeight: '700',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleCancel}>
        <TouchableOpacity activeOpacity={1} style={styles.box}>
          <Text style={styles.title}>{t.shortRestTitle}</Text>
          <Text style={styles.hint}>
            {language === 'en'
              ? 'Take a breather. Class features recover automatically.'
              : 'Descanse um momento. Habilidades de classe recuperam automaticamente.'}
          </Text>

          {/* What recovers automatically */}
          {(isWarlock || isMonk) && (
            <View style={styles.recoverBanner}>
              {isWarlock && (
                <Text style={styles.recoverText}>
                  🔮 {language === 'en' ? 'Pact Magic slots recover' : 'Slots de Magia do Pacto recuperam'}
                </Text>
              )}
              {isMonk && (
                <Text style={styles.recoverText}>
                  🌀 {language === 'en'
                    ? `Ki points recover (${character.kiPoints?.total ?? character.level}/${character.kiPoints?.total ?? character.level})`
                    : `Pontos de Ki recuperam (${character.kiPoints?.total ?? character.level}/${character.kiPoints?.total ?? character.level})`}
                </Text>
              )}
            </View>
          )}

          {/* Heal toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {language === 'en' ? '❤️ Recover HP with Hit Dice' : '❤️ Recuperar HP com Dado de Vida'}
            </Text>
            <Switch
              value={healMode}
              onValueChange={setHealMode}
              thumbColor={healMode ? c.accent : c.subtext}
              trackColor={{ false: c.border, true: c.accent + '88' }}
            />
          </View>

          {healMode && (
            <>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>{t.shortRestHitDie(hitDie)}</Text>
                <Text style={styles.statValue}>
                  {conMod >= 0 ? `+${conMod}` : `${conMod}`} CON
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>{t.shortRestDice(usedBefore + diceSpent, totalDice)}</Text>
                <Text style={styles.statValue}>{diceLeft} {language === 'en' ? 'left' : 'restantes'}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>HP</Text>
                <Text style={styles.hpGain}>
                  {character.hp + hpGained}/{character.maxHp}
                  {hpGained > 0 ? ` (+${hpGained})` : ''}
                </Text>
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={[styles.spendBtn, (diceLeft <= 0 || hpFull) && styles.spendBtnDisabled]}
                onPress={handleSpendDie}
                disabled={diceLeft <= 0 || hpFull}
              >
                <Text style={styles.spendBtnText}>
                  {diceLeft <= 0
                    ? t.shortRestNoDice
                    : hpFull
                      ? (language === 'en' ? '❤️ HP Full' : '❤️ HP Cheio')
                      : t.shortRestRoll}
                </Text>
              </TouchableOpacity>

              {rollLog.length > 0 && (
                <ScrollView style={styles.logContainer}>
                  {rollLog.map((entry, i) => (
                    <Text key={i} style={styles.logEntry}>• {entry}</Text>
                  ))}
                </ScrollView>
              )}
            </>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>{t.shortRestClose}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
