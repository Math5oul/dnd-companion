import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Character, AbilityName } from '../types/character';
import { SKILLS, getProficiencyBonus } from '../data/skills';
import { getClassById } from '../data/classes';

function getModifier(score: number) {
  return Math.floor((score - 10) / 2);
}
function fmtMod(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}
function rollD20(adv: 'normal' | 'adv' | 'dis') {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  if (adv === 'adv') return { value: Math.max(a, b), detail: `adv[${a},${b}]` };
  if (adv === 'dis') return { value: Math.min(a, b), detail: `dis[${a},${b}]` };
  return { value: a, detail: `d20:${a}` };
}

const ABILITY_INFO: { key: AbilityName; icon: string; namePt: string; nameEn: string }[] = [
  { key: 'strength',     icon: '💪', namePt: 'Força',        nameEn: 'Strength'     },
  { key: 'dexterity',    icon: '🏹', namePt: 'Destreza',     nameEn: 'Dexterity'    },
  { key: 'constitution', icon: '🛡️', namePt: 'Constituição', nameEn: 'Constitution' },
  { key: 'intelligence', icon: '📚', namePt: 'Inteligência', nameEn: 'Intelligence' },
  { key: 'wisdom',       icon: '🔮', namePt: 'Sabedoria',    nameEn: 'Wisdom'       },
  { key: 'charisma',     icon: '✨', namePt: 'Carisma',      nameEn: 'Charisma'     },
];

const EN_TO_KEY: Record<string, AbilityName> = {
  Strength: 'strength', Dexterity: 'dexterity', Constitution: 'constitution',
  Intelligence: 'intelligence', Wisdom: 'wisdom', Charisma: 'charisma',
};

type TC = { bg: string; surface: string; accent: string; text: string; subtext: string; border: string };

interface Props {
  char: Character;
  language: 'pt' | 'en';
  themeColors: TC;
  activeTraitEffects: Set<string>;
}

export default function ChecksPanel({ char, language, themeColors: c, activeTraitEffects }: Props) {
  const [results, setResults] = useState<Record<string, { total: number; detail: string }>>({});
  const prof = getProficiencyBonus(char.level);
  const cls = getClassById(char.className);
  const rageActive = activeTraitEffects.has('rage');

  const saveProfKeys = new Set<AbilityName>(
    (cls?.savingThrowsEn ?? []).map((s) => EN_TO_KEY[s]).filter(Boolean) as AbilityName[]
  );

  function roll(id: string, bonus: number, adv: 'normal' | 'adv' | 'dis' = 'normal') {
    const d20 = rollD20(adv);
    const total = d20.value + bonus;
    setResults((prev) => ({ ...prev, [id]: { total, detail: `${d20.detail}${fmtMod(bonus)}` } }));
    setTimeout(() => setResults((prev) => { const n = { ...prev }; delete n[id]; return n; }), 5000);
  }

  const pt = language === 'pt';

  return (
    <View>
      {ABILITY_INFO.map((ab) => {
        const mod = getModifier(char.abilityScores[ab.key]);
        const hasSaveProf = saveProfKeys.has(ab.key);
        const saveBonus = mod + (hasSaveProf ? prof : 0);
        // Rage: advantage on STR checks and saves
        const rageAdv = rageActive && ab.key === 'strength';
        const skills = SKILLS.filter((s) => s.ability === ab.key);

        return (
          <View key={ab.key} style={{
            marginBottom: 8, backgroundColor: c.surface,
            borderRadius: 10, borderWidth: 1, borderColor: c.border, padding: 10,
          }}>
            {/* Ability header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ color: c.text, fontWeight: '800', fontSize: 14, flex: 1 }}>
                {ab.icon} {pt ? ab.namePt : ab.nameEn}
                <Text style={{ color: c.accent, fontWeight: '600' }}> {fmtMod(mod)}</Text>
              </Text>
              {rageAdv && (
                <Text style={{ color: '#44ff66', fontSize: 11, fontWeight: '700' }}>⚡ ▲ADV (Fúria)</Text>
              )}
            </View>

            {/* Saving Throw */}
            {(() => {
              const rid = `save_${ab.key}`;
              const result = results[rid];
              return (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: c.border + '55', marginBottom: 2 }}
                  onPress={() => roll(rid, saveBonus, rageAdv ? 'adv' : 'normal')}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: c.subtext, fontSize: 12, flex: 1 }}>
                    🛡️ {pt ? 'Resistência' : 'Saving Throw'}
                    {hasSaveProf ? <Text style={{ color: c.accent }}> ✦</Text> : null}
                    <Text style={{ color: c.accent }}> {fmtMod(saveBonus)}</Text>
                  </Text>
                  {result && (
                    <Text style={{ color: c.accent, fontWeight: '800', fontSize: 13 }}>
                      {result.total}{' '}
                      <Text style={{ color: c.subtext, fontSize: 10, fontWeight: '400' }}>{result.detail}</Text>
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })()}

            {/* Ability check (raw) */}
            {(() => {
              const rid = `check_${ab.key}`;
              const result = results[rid];
              return (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: c.border + '33', marginBottom: 2 }}
                  onPress={() => roll(rid, mod, rageAdv ? 'adv' : 'normal')}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: c.subtext, fontSize: 12, flex: 1 }}>
                    🎲 {pt ? 'Teste' : 'Check'}
                    <Text style={{ color: c.accent }}> {fmtMod(mod)}</Text>
                  </Text>
                  {result && (
                    <Text style={{ color: c.accent, fontWeight: '800', fontSize: 13 }}>
                      {result.total}{' '}
                      <Text style={{ color: c.subtext, fontSize: 10, fontWeight: '400' }}>{result.detail}</Text>
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })()}

            {/* Skills of this ability */}
            {skills.map((sk) => {
              const isProf = (char.skillProficiencies ?? []).includes(sk.id);
              const isExpert = false; // expertise tracked via double proficiency in future
              const bonus = mod + (isExpert ? prof * 2 : isProf ? prof : 0);
              const rid = `skill_${sk.id}`;
              const result = results[rid];
              return (
                <TouchableOpacity
                  key={sk.id}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}
                  onPress={() => roll(rid, bonus, rageAdv ? 'adv' : 'normal')}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: c.subtext, fontSize: 12, flex: 1 }}>
                    <Text style={{ color: isExpert ? c.accent : isProf ? c.accent + 'cc' : c.border }}>
                      {isExpert ? '◈◈ ' : isProf ? '◈ ' : '○ '}
                    </Text>
                    {pt ? sk.name : sk.nameEn}
                    <Text style={{ color: c.accent }}> {fmtMod(bonus)}</Text>
                  </Text>
                  {result && (
                    <Text style={{ color: c.accent, fontWeight: '800', fontSize: 13 }}>
                      {result.total}{' '}
                      <Text style={{ color: c.subtext, fontSize: 10, fontWeight: '400' }}>{result.detail}</Text>
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
