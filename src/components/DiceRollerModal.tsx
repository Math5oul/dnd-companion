import { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSettingsStore, THEMES } from '../store/settingsStore';
import { rollDie } from '../lib/dice';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DiceSides = typeof DICE[number];

interface RollEntry {
  id: number;
  label: string;
  rolls: number[];
  modifier: number;
  total: number;
}

let nextId = 1;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function DiceRollerModal({ visible, onClose }: Props) {
  const { theme } = useSettingsStore();
  const c = THEMES[theme];
  const styles = useMemo(() => makeStyles(c), [theme]);

  const [selectedDie, setSelectedDie] = useState<DiceSides>(20);
  const [quantity, setQuantity] = useState(1);
  const [modRaw, setModRaw] = useState('0');
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [lastEntry, setLastEntry] = useState<RollEntry | null>(null);

  const modifier = parseInt(modRaw) || 0;

  function handleRoll() {
    const rolls = Array.from({ length: quantity }, () => rollDie(selectedDie));
    const sum = rolls.reduce((a, b) => a + b, 0);
    const total = sum + modifier;
    const label = `${quantity}d${selectedDie}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`;
    const entry: RollEntry = { id: nextId++, label, rolls, modifier, total };
    setLastEntry(entry);
    setHistory((prev) => [entry, ...prev].slice(0, 20));
  }

  function handleClear() {
    setHistory([]);
    setLastEntry(null);
  }

  const isCrit = selectedDie === 20 && lastEntry?.rolls[0] === 20 && quantity === 1;
  const isFumble = selectedDie === 20 && lastEntry?.rolls[0] === 1 && quantity === 1;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={[styles.sheet, { backgroundColor: c.surface, borderColor: c.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: c.text }]}>🎲 Rolador de Dados</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[styles.closeX, { color: c.subtext }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Dice selector */}
          <View style={styles.diceRow}>
            {DICE.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.diceBtn,
                  { borderColor: c.border, backgroundColor: c.bg },
                  selectedDie === d && { borderColor: c.accent, backgroundColor: c.accent + '22' },
                ]}
                onPress={() => setSelectedDie(d)}
                activeOpacity={0.75}
              >
                <Text style={[styles.diceBtnText, { color: selectedDie === d ? c.accent : c.text }]}>
                  d{d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Qty + Modifier */}
          <View style={styles.controlRow}>
            {/* Quantity */}
            <View style={styles.controlGroup}>
              <Text style={[styles.controlLabel, { color: c.subtext }]}>Qtd</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={[styles.stepBtn, { borderColor: c.border }]}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Text style={[styles.stepTxt, { color: c.text }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.stepVal, { color: c.text }]}>{quantity}</Text>
                <TouchableOpacity
                  style={[styles.stepBtn, { borderColor: c.border }]}
                  onPress={() => setQuantity((q) => Math.min(20, q + 1))}
                >
                  <Text style={[styles.stepTxt, { color: c.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Modifier */}
            <View style={styles.controlGroup}>
              <Text style={[styles.controlLabel, { color: c.subtext }]}>Mod</Text>
              <TextInput
                style={[styles.modInput, { borderColor: c.border, color: c.text, backgroundColor: c.bg }]}
                value={modRaw}
                onChangeText={(t) => {
                  // allow negative sign and digits only
                  if (/^-?\d{0,3}$/.test(t)) setModRaw(t);
                }}
                keyboardType="numbers-and-punctuation"
                maxLength={4}
                selectTextOnFocus
              />
            </View>
          </View>

          {/* Roll button */}
          <TouchableOpacity
            style={[styles.rollBtn, { backgroundColor: c.accent }]}
            onPress={handleRoll}
            activeOpacity={0.8}
          >
            <Text style={styles.rollBtnText}>
              Rolar {quantity}d{selectedDie}{modifier !== 0 ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}
            </Text>
          </TouchableOpacity>

          {/* Last result banner */}
          {lastEntry && (
            <View style={[
              styles.resultBanner,
              { backgroundColor: isCrit ? '#2a5c2a' : isFumble ? '#5c2a2a' : c.bg, borderColor: isCrit ? '#4caf50' : isFumble ? '#e53935' : c.accent },
            ]}>
              <Text style={[styles.resultLabel, { color: c.subtext }]}>{lastEntry.label}</Text>
              <Text style={[
                styles.resultTotal,
                { color: isCrit ? '#66ff66' : isFumble ? '#ff6666' : c.accent },
              ]}>
                {isCrit ? '⚡ CRÍTICO! ' : isFumble ? '💀 FALHA! ' : ''}{lastEntry.total}
              </Text>
              <Text style={[styles.resultDetail, { color: c.subtext }]}>
                [{lastEntry.rolls.join(', ')}]{lastEntry.modifier !== 0 ? ` ${lastEntry.modifier > 0 ? '+' : ''}${lastEntry.modifier}` : ''}
              </Text>
            </View>
          )}

          {/* History */}
          {history.length > 0 && (
            <>
              <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, { color: c.subtext }]}>Histórico</Text>
                <TouchableOpacity onPress={handleClear}>
                  <Text style={[styles.clearBtn, { color: c.subtext }]}>Limpar</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                {history.map((entry, i) => (
                  <View key={entry.id} style={[styles.historyRow, { borderBottomColor: c.border, opacity: i === 0 ? 1 : 0.65 }]}>
                    <Text style={[styles.historyLabel, { color: c.subtext }]}>{entry.label}</Text>
                    <Text style={[styles.historyDetail, { color: c.subtext }]}>[{entry.rolls.join(', ')}]{entry.modifier !== 0 ? ` ${entry.modifier > 0 ? '+' : ''}${entry.modifier}` : ''}</Text>
                    <Text style={[styles.historyTotal, { color: c.text }]}>{entry.total}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function makeStyles(c: ReturnType<typeof THEMES[keyof typeof THEMES]['bg'] extends string ? () => any : never> | any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: 52,
      paddingRight: 8,
    },
    sheet: {
      width: 320,
      maxHeight: '85%',
      borderRadius: 14,
      borderWidth: 1,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
    },
    closeX: {
      fontSize: 18,
      fontWeight: '700',
    },
    diceRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 14,
    },
    diceBtn: {
      borderWidth: 1.5,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 7,
      minWidth: 44,
      alignItems: 'center',
    },
    diceBtnText: {
      fontSize: 13,
      fontWeight: '700',
    },
    controlRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 14,
      alignItems: 'flex-end',
    },
    controlGroup: {
      alignItems: 'center',
      gap: 4,
    },
    controlLabel: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepBtn: {
      borderWidth: 1,
      borderRadius: 6,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepTxt: {
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 20,
    },
    stepVal: {
      fontSize: 18,
      fontWeight: '700',
      minWidth: 24,
      textAlign: 'center',
    },
    modInput: {
      borderWidth: 1,
      borderRadius: 6,
      width: 64,
      height: 32,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '700',
      paddingHorizontal: 4,
    },
    rollBtn: {
      borderRadius: 10,
      paddingVertical: 13,
      alignItems: 'center',
      marginBottom: 12,
    },
    rollBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 0.3,
    },
    resultBanner: {
      borderWidth: 1.5,
      borderRadius: 10,
      padding: 12,
      alignItems: 'center',
      marginBottom: 12,
      gap: 2,
    },
    resultLabel: {
      fontSize: 12,
      fontWeight: '600',
    },
    resultTotal: {
      fontSize: 40,
      fontWeight: '900',
      lineHeight: 46,
    },
    resultDetail: {
      fontSize: 12,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    historyTitle: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    clearBtn: {
      fontSize: 11,
      fontWeight: '600',
    },
    historyList: {
      maxHeight: 160,
    },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      borderBottomWidth: StyleSheet.hairlineWidth,
      gap: 6,
    },
    historyLabel: {
      fontSize: 12,
      fontWeight: '700',
      width: 64,
    },
    historyDetail: {
      fontSize: 11,
      flex: 1,
    },
    historyTotal: {
      fontSize: 16,
      fontWeight: '800',
      minWidth: 28,
      textAlign: 'right',
    },
  });
}
