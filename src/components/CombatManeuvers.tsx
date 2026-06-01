import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Character } from '../types/character';
import { getProficiencyBonus } from '../data/skills';
import { CLASS_FEATURES } from '../data/classFeatures';

function getModifier(score: number) { return Math.floor((score - 10) / 2); }
function fmtMod(n: number) { return n >= 0 ? `+${n}` : `${n}`; }
function rollD20(adv: 'normal' | 'adv' | 'dis') {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  if (adv === 'adv') return { value: Math.max(a, b), detail: `adv[${a},${b}]` };
  if (adv === 'dis') return { value: Math.min(a, b), detail: `dis[${a},${b}]` };
  return { value: a, detail: `d20:${a}` };
}

type TC = { bg: string; surface: string; accent: string; text: string; subtext: string; border: string };
type ActionCost = 'action' | 'bonus' | 'reaction' | 'none';

const COST_CFG = {
  action:   { symbol: 'A',  icon: '🎯', color: '#e07b39' },
  bonus:    { symbol: 'BA', icon: '⚡', color: '#3da1c8' },
  reaction: { symbol: 'R',  icon: '🛡️', color: '#9c5de0' },
} as const;

interface Props {
  char: Character;
  language: 'pt' | 'en';
  themeColors: TC;
  activeTraitEffects: Set<string>;
  canUseAction?: boolean;
  canUseBonus?: boolean;
  canUseReaction?: boolean;
  onConsumeAction?: (cost: 'action' | 'bonus' | 'reaction') => void;
}

interface Maneuver {
  id: string;
  icon: string;
  namePt: string;
  nameEn: string;
  costPt: string;
  costEn: string;
  actionCost: ActionCost;
  descPt: string;
  descEn: string;
  notePt?: string;
  noteEn?: string;
  rollBonus?: number;
  rollAdv?: 'normal' | 'adv' | 'dis';
  rollLabelPt?: string;
  rollLabelEn?: string;
}

export default function CombatManeuvers({
  char, language, themeColors: c, activeTraitEffects,
  canUseAction = true, canUseBonus = true, canUseReaction = true,
  onConsumeAction,
}: Props) {
  const [results, setResults] = useState<Record<string, { total: number; detail: string }>>({});

  const prof = getProficiencyBonus(char.level);
  const strMod = getModifier(char.abilityScores.strength);
  const dexMod = getModifier(char.abilityScores.dexterity);
  const rageActive = activeTraitEffects.has('rage');
  const kiStepActive = activeTraitEffects.has('ki_step');
  const kiDodgeActive = activeTraitEffects.has('ki_dodge');

  const skillProfSet = new Set<string>(char.skillProficiencies ?? []);
  (char.proficiencies ?? []).forEach((p) => {
    if (p.category === 'skill') skillProfSet.add(p.id);
  });
  const expertiseSet = new Set<string>();
  (char.proficiencies ?? []).forEach((p) => {
    if (p.category === 'skill' && p.level === 'expert') expertiseSet.add(p.id);
  });
  const classFeatures = (CLASS_FEATURES[char.className] ?? []).flatMap((lf) => lf.features);
  classFeatures.forEach((f) => {
    if (f.pickType !== 'expertise') return;
    const selected = (char.featureChoices ?? {})[f.id] ?? [];
    selected.forEach((sid) => expertiseSet.add(sid));
  });

  const hasAthletics = skillProfSet.has('athletics') || expertiseSet.has('athletics');
  const hasStealth   = skillProfSet.has('stealth') || expertiseSet.has('stealth');
  const hasAcrobatics = skillProfSet.has('acrobatics') || expertiseSet.has('acrobatics');

  const athleticsBonus = strMod + (expertiseSet.has('athletics') ? prof * 2 : hasAthletics ? prof : 0);
  const stealthBonus   = dexMod + (expertiseSet.has('stealth') ? prof * 2 : hasStealth ? prof : 0);
  const acrobaticsBonus = dexMod + (expertiseSet.has('acrobatics') ? prof * 2 : hasAcrobatics ? prof : 0);

  const pt = language === 'pt';

  function roll(id: string, bonus: number, adv: 'normal' | 'adv' | 'dis' = 'normal') {
    const d20 = rollD20(adv);
    const total = d20.value + bonus;
    setResults((p) => ({ ...p, [id]: { total, detail: `${d20.detail}${fmtMod(bonus)}` } }));
    setTimeout(() => setResults((p) => { const n = { ...p }; delete n[id]; return n; }), 5000);
  }

  const maneuvers: Maneuver[] = [
    {
      id: 'dash',
      icon: '🏃',
      namePt: 'Disparada', nameEn: 'Dash',
      costPt: kiStepActive ? '⚡ Passo do Vento' : 'Ação',
      costEn: kiStepActive ? '⚡ Step of the Wind' : 'Action',
      actionCost: kiStepActive ? 'bonus' : 'action',
      descPt: 'Sua velocidade de movimento é dobrada este turno.',
      descEn: 'Your movement speed is doubled this turn.',
    },
    {
      id: 'disengage',
      icon: '🏃‍♂️',
      namePt: 'Desengajar', nameEn: 'Disengage',
      costPt: kiStepActive ? '⚡ Passo do Vento' : 'Ação',
      costEn: kiStepActive ? '⚡ Step of the Wind' : 'Action',
      actionCost: kiStepActive ? 'bonus' : 'action',
      descPt: 'Seu movimento não provoca ataques de oportunidade este turno.',
      descEn: "Your movement doesn't provoke opportunity attacks this turn.",
    },
    {
      id: 'dodge',
      icon: '🛡️',
      namePt: 'Esquivar', nameEn: 'Dodge',
      costPt: kiDodgeActive ? '⚡ Defesa sem Armadura' : 'Ação',
      costEn: kiDodgeActive ? '⚡ Patient Defense' : 'Action',
      actionCost: kiDodgeActive ? 'bonus' : 'action',
      descPt: 'Atacantes têm desvantagem. Você tem vantagem em testes de DEX.',
      descEn: 'Attackers have disadvantage. You have advantage on DEX saving throws.',
    },
    {
      id: 'hide',
      icon: '👁️',
      namePt: 'Esconder', nameEn: 'Hide',
      costPt: 'Ação',
      costEn: 'Action',
      actionCost: 'action',
      descPt: 'Teste de Furtividade para ficar oculto.',
      descEn: 'Stealth check to become hidden.',
      rollBonus: stealthBonus,
      rollLabelPt: `Furtividade ${fmtMod(stealthBonus)}`,
      rollLabelEn: `Stealth ${fmtMod(stealthBonus)}`,
    },
    {
      id: 'help',
      icon: '🤝',
      namePt: 'Ajudar', nameEn: 'Help',
      costPt: 'Ação',
      costEn: 'Action',
      actionCost: 'action',
      descPt: 'Um aliado tem vantagem no próximo ataque ou teste de habilidade.',
      descEn: 'An ally has advantage on their next attack roll or ability check.',
    },
    {
      id: 'ready',
      icon: '🎯',
      namePt: 'Preparar', nameEn: 'Ready',
      costPt: 'Ação',
      costEn: 'Action',
      actionCost: 'action',
      descPt: 'Prepare uma ação para ser acionada como reação a um gatilho.',
      descEn: 'Prepare an action to trigger as a reaction to a specific trigger.',
    },
    {
      id: 'grapple',
      icon: '💪',
      namePt: 'Agarrar', nameEn: 'Grapple',
      costPt: 'Parte do Ataque',
      costEn: 'Part of Attack',
      actionCost: 'none',
      descPt: 'Atletismo vs Atletismo ou Acrobacia do alvo. Sucesso → alvo fica Agarrado.',
      descEn: "Athletics vs target's Athletics or Acrobatics. Success → target is Grappled.",
      notePt: rageActive ? '⚡ Fúria: Vantagem em Atletismo' : undefined,
      noteEn: rageActive ? '⚡ Rage: Advantage on Athletics' : undefined,
      rollBonus: athleticsBonus,
      rollAdv: rageActive ? 'adv' : 'normal',
      rollLabelPt: `Atletismo ${fmtMod(athleticsBonus)}${rageActive ? ' ▲ADV' : ''}`,
      rollLabelEn: `Athletics ${fmtMod(athleticsBonus)}${rageActive ? ' ▲ADV' : ''}`,
    },
    {
      id: 'shove',
      icon: '🫸',
      namePt: 'Empurrar', nameEn: 'Shove',
      costPt: 'Parte do Ataque',
      costEn: 'Part of Attack',
      actionCost: 'none',
      descPt: 'Atletismo vs Atletismo/Acrobacia para derrubar (Caído) ou afastar 1,5m.',
      descEn: 'Athletics vs Athletics/Acrobatics to knock prone or push 5 ft.',
      notePt: rageActive ? '⚡ Fúria: Vantagem em Atletismo' : undefined,
      noteEn: rageActive ? '⚡ Rage: Advantage on Athletics' : undefined,
      rollBonus: athleticsBonus,
      rollAdv: rageActive ? 'adv' : 'normal',
      rollLabelPt: `Atletismo ${fmtMod(athleticsBonus)}${rageActive ? ' ▲ADV' : ''}`,
      rollLabelEn: `Athletics ${fmtMod(athleticsBonus)}${rageActive ? ' ▲ADV' : ''}`,
    },
    {
      id: 'acrobatics_escape',
      icon: '🤸',
      namePt: 'Escapar (Acrobacia)', nameEn: 'Escape (Acrobatics)',
      costPt: 'Parte do Movimento',
      costEn: 'Part of Movement',
      actionCost: 'none',
      descPt: 'Acrobacia vs Atletismo do agarrador para escapar de uma garra.',
      descEn: "Acrobatics vs grappler's Athletics to escape a grapple.",
      rollBonus: acrobaticsBonus,
      rollLabelPt: `Acrobacia ${fmtMod(acrobaticsBonus)}`,
      rollLabelEn: `Acrobatics ${fmtMod(acrobaticsBonus)}`,
    },
  ];

  const COST_COLORS: Record<string, string> = {
    'Ação': '#e07b39',
    'Action': '#e07b39',
    'Ação Bônus': '#3da1c8',
    'Bonus Action': '#3da1c8',
    'Reação': '#9c5de0',
    'Reaction': '#9c5de0',
  };

  const styles = makeStyles(c);

  return (
    <View>
      {maneuvers.map((m) => {
        const result = results[m.id];
        const cost = pt ? m.costPt : m.costEn;
        const isBonus = cost.includes('Bônus') || cost.includes('Bonus') || cost.includes('Passo') || cost.includes('Step') || cost.includes('Defesa') || cost.includes('Patient');
        const costColor = isBonus ? '#3da1c8' : '#e07b39';
        const note = pt ? m.notePt : m.noteEn;

        // Action economy
        const costCfg = m.actionCost !== 'none' ? COST_CFG[m.actionCost] : null;
        const canConsume =
          m.actionCost === 'action'   ? canUseAction :
          m.actionCost === 'bonus'    ? canUseBonus :
          m.actionCost === 'reaction' ? canUseReaction : false;

        const handleConsume = () => {
          if (m.rollBonus !== undefined) roll(m.id, m.rollBonus, m.rollAdv ?? 'normal');
          if (m.actionCost !== 'none' && onConsumeAction) onConsumeAction(m.actionCost);
        };

        return (
          <View
            key={m.id}
            style={[styles.card, !canConsume && m.actionCost !== 'none' && styles.cardDisabled]}
          >
            <View style={styles.topRow}>
              <Text style={styles.icon}>{m.icon}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, { color: c.text }]}>
                    {pt ? m.namePt : m.nameEn}
                  </Text>
                  <View style={[styles.costBadge, { borderColor: costColor + '88', backgroundColor: costColor + '22' }]}>
                    <Text style={[styles.costText, { color: costColor }]}>{cost}</Text>
                  </View>
                </View>
                <Text style={[styles.desc, { color: c.subtext }]}>{pt ? m.descPt : m.descEn}</Text>
                {note && <Text style={styles.note}>{note}</Text>}
              </View>
            </View>

            {result && (
              <View style={[styles.resultBox, { backgroundColor: c.bg, borderColor: c.border }]}>
                <Text style={[styles.resultTotal, { color: c.accent }]}>
                  {result.total}{' '}
                  <Text style={[styles.resultDetail, { color: c.subtext }]}>{result.detail}</Text>
                </Text>
              </View>
            )}

            {/* Consume A/BA/R button (for action-costing maneuvers) */}
            {costCfg && (
              <TouchableOpacity
                style={[
                  styles.consumeBtn,
                  { borderColor: costCfg.color + '88', backgroundColor: costCfg.color + '22' },
                  !canConsume && styles.consumeBtnDisabled,
                ]}
                onPress={handleConsume}
                disabled={!canConsume}
                activeOpacity={0.75}
              >
                <View style={[styles.consumeBadge, { backgroundColor: costCfg.color }]}>
                  <Text style={styles.consumeBadgeText}>{costCfg.symbol}</Text>
                </View>
                <Text style={[styles.consumeLabel, { color: canConsume ? costCfg.color : '#555' }]}>
                  {m.rollBonus !== undefined
                    ? `${pt ? (m.rollLabelPt ?? '') : (m.rollLabelEn ?? '')}  ·  ${pt ? 'Usar' : 'Use'} ${costCfg.symbol}`
                    : `${pt ? 'Usar' : 'Use'} ${costCfg.symbol}`}
                </Text>
              </TouchableOpacity>
            )}

            {/* Roll-only button (for part-of-attack/movement maneuvers) */}
            {m.rollBonus !== undefined && m.actionCost === 'none' && (
              <TouchableOpacity
                style={[styles.rollBtn, { backgroundColor: c.accent }]}
                onPress={() => roll(m.id, m.rollBonus!, m.rollAdv ?? 'normal')}
                activeOpacity={0.7}
              >
                <Text style={[styles.rollBtnText, { color: c.bg }]}>
                  🎲 {pt ? m.rollLabelPt : m.rollLabelEn}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}

function makeStyles(c: TC) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.surface, borderRadius: 10,
      borderWidth: 1, borderColor: c.border, padding: 10, marginBottom: 6,
    },
    cardDisabled: { opacity: 0.45 },
    topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    icon: { fontSize: 20 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' },
    name: { fontWeight: '700', fontSize: 14 },
    costBadge: { borderRadius: 4, borderWidth: 1, paddingHorizontal: 5, paddingVertical: 1 },
    costText: { fontSize: 10, fontWeight: '700' },
    desc: { fontSize: 11 },
    note: { color: '#44ff66', fontSize: 11, marginTop: 2, fontWeight: '700' },
    resultBox: { borderRadius: 6, padding: 6, marginTop: 6, borderWidth: 1 },
    resultTotal: { fontWeight: '800', fontSize: 14 },
    resultDetail: { fontSize: 11, fontWeight: '400' },
    consumeBtn: {
      marginTop: 8, borderRadius: 8, borderWidth: 1,
      paddingVertical: 7, paddingHorizontal: 10,
      flexDirection: 'row', alignItems: 'center', gap: 8,
    },
    consumeBtnDisabled: { opacity: 0.4 },
    consumeBadge: {
      borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
    },
    consumeBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
    consumeLabel: { fontSize: 12, fontWeight: '700' },
    rollBtn: {
      marginTop: 6, borderRadius: 8, paddingVertical: 6, alignItems: 'center',
    },
    rollBtnText: { fontWeight: '800', fontSize: 12 },
  });
}
