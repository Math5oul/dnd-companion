import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Character } from '../types/character';
import { SKILLS, getProficiencyBonus } from '../data/skills';

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

interface Props {
  char: Character;
  language: 'pt' | 'en';
  themeColors: TC;
  activeTraitEffects: Set<string>;
}

interface Maneuver {
  id: string;
  icon: string;
  namePt: string;
  nameEn: string;
  costPt: string;
  costEn: string;
  descPt: string;
  descEn: string;
  notePt?: string;
  noteEn?: string;
  rollBonus?: number;
  rollAdv?: 'normal' | 'adv' | 'dis';
  rollLabelPt?: string;
  rollLabelEn?: string;
}

export default function CombatManeuvers({ char, language, themeColors: c, activeTraitEffects }: Props) {
  const [results, setResults] = useState<Record<string, { total: number; detail: string }>>({});

  const prof = getProficiencyBonus(char.level);
  const strMod = getModifier(char.abilityScores.strength);
  const dexMod = getModifier(char.abilityScores.dexterity);
  const rageActive = activeTraitEffects.has('rage');
  const kiStepActive = activeTraitEffects.has('ki_step');
  const kiDodgeActive = activeTraitEffects.has('ki_dodge');

  const hasAthletics = (char.skillProficiencies ?? []).includes('athletics');
  const hasStealth   = (char.skillProficiencies ?? []).includes('stealth');
  const hasAcrobatics = (char.skillProficiencies ?? []).includes('acrobatics');

  const athleticsBonus = strMod + (hasAthletics ? prof : 0);
  const stealthBonus   = dexMod + (hasStealth   ? prof : 0);
  const acrobaticsBonus = dexMod + (hasAcrobatics ? prof : 0);

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
      costPt: kiStepActive ? '⚡ Ação Bônus (Passo do Vento)' : 'Ação',
      costEn: kiStepActive ? '⚡ Bonus Action (Step of the Wind)' : 'Action',
      descPt: 'Sua velocidade de movimento é dobrada este turno.',
      descEn: 'Your movement speed is doubled this turn.',
    },
    {
      id: 'disengage',
      icon: '🏃‍♂️',
      namePt: 'Desengajar', nameEn: 'Disengage',
      costPt: kiStepActive ? '⚡ Ação Bônus (Passo do Vento)' : 'Ação',
      costEn: kiStepActive ? '⚡ Bonus Action (Step of the Wind)' : 'Action',
      descPt: 'Seu movimento não provoca ataques de oportunidade este turno.',
      descEn: "Your movement doesn't provoke opportunity attacks this turn.",
    },
    {
      id: 'dodge',
      icon: '🛡️',
      namePt: 'Esquivar', nameEn: 'Dodge',
      costPt: kiDodgeActive ? '⚡ Ação Bônus (Defesa sem Armadura)' : 'Ação',
      costEn: kiDodgeActive ? '⚡ Bonus Action (Patient Defense)' : 'Action',
      descPt: 'Atacantes têm desvantagem. Você tem vantagem em testes de DEX.',
      descEn: 'Attackers have disadvantage. You have advantage on DEX saving throws.',
    },
    {
      id: 'hide',
      icon: '👁️',
      namePt: 'Esconder', nameEn: 'Hide',
      costPt: 'Ação',
      costEn: 'Action',
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
      descPt: 'Um aliado tem vantagem no próximo ataque ou teste de habilidade.',
      descEn: 'An ally has advantage on their next attack roll or ability check.',
    },
    {
      id: 'ready',
      icon: '🎯',
      namePt: 'Preparar', nameEn: 'Ready',
      costPt: 'Ação',
      costEn: 'Action',
      descPt: 'Prepare uma ação para ser acionada como reação a um gatilho.',
      descEn: 'Prepare an action to trigger as a reaction to a specific trigger.',
    },
    {
      id: 'grapple',
      icon: '💪',
      namePt: 'Agarrar', nameEn: 'Grapple',
      costPt: 'Ação (parte de ataque)',
      costEn: 'Action (part of attack)',
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
      costPt: 'Ação (parte de ataque)',
      costEn: 'Action (part of attack)',
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
      costPt: 'Parte do movimento',
      costEn: 'Part of movement',
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

  return (
    <View>
      {maneuvers.map((m) => {
        const result = results[m.id];
        const cost = pt ? m.costPt : m.costEn;
        const isBonus = cost.includes('Bônus') || cost.includes('Bonus');
        const costColor = isBonus ? '#3da1c8' : '#e07b39';
        const note = pt ? m.notePt : m.noteEn;

        return (
          <View key={m.id} style={{
            backgroundColor: c.surface, borderRadius: 10,
            borderWidth: 1, borderColor: c.border, padding: 10, marginBottom: 6,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Text style={{ fontSize: 20 }}>{m.icon}</Text>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
                  <Text style={{ color: c.text, fontWeight: '700', fontSize: 14 }}>
                    {pt ? m.namePt : m.nameEn}
                  </Text>
                  <View style={{ borderRadius: 4, borderWidth: 1, borderColor: costColor + '88', backgroundColor: costColor + '22', paddingHorizontal: 5, paddingVertical: 1 }}>
                    <Text style={{ color: costColor, fontSize: 10, fontWeight: '700' }}>{cost}</Text>
                  </View>
                </View>
                <Text style={{ color: c.subtext, fontSize: 11 }}>{pt ? m.descPt : m.descEn}</Text>
                {note && (
                  <Text style={{ color: '#44ff66', fontSize: 11, marginTop: 2, fontWeight: '700' }}>{note}</Text>
                )}
              </View>
            </View>

            {result && (
              <View style={{ backgroundColor: c.bg, borderRadius: 6, padding: 6, marginTop: 6, borderWidth: 1, borderColor: c.border }}>
                <Text style={{ color: c.accent, fontWeight: '800', fontSize: 14 }}>
                  {result.total}{' '}
                  <Text style={{ color: c.subtext, fontSize: 11, fontWeight: '400' }}>{result.detail}</Text>
                </Text>
              </View>
            )}

            {m.rollBonus !== undefined && (
              <TouchableOpacity
                style={{ marginTop: 6, borderRadius: 8, backgroundColor: c.accent, paddingVertical: 6, alignItems: 'center' }}
                onPress={() => roll(m.id, m.rollBonus!, m.rollAdv ?? 'normal')}
                activeOpacity={0.7}
              >
                <Text style={{ color: c.bg, fontWeight: '800', fontSize: 12 }}>
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
