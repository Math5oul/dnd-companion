import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Character, AbilityName } from '../types/character';
import { SKILLS, getProficiencyBonus, CLASS_SKILL_OPTIONS, CLASS_SKILL_COUNT } from '../data/skills';
import { getClassById } from '../data/classes';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getModifier(score: number) { return Math.floor((score - 10) / 2); }
function fmtMod(n: number) { return n >= 0 ? `+${n}` : `${n}`; }
function rollD20(adv: 'normal' | 'adv' | 'dis') {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  if (adv === 'adv') return { value: Math.max(a, b), detail: `▲[${a},${b}]` };
  if (adv === 'dis') return { value: Math.min(a, b), detail: `▼[${a},${b}]` };
  return { value: a, detail: `d20:${a}` };
}

const ABILITY_INFO: { key: AbilityName; icon: string; namePt: string; nameEn: string; shortPt: string; shortEn: string }[] = [
  { key: 'strength',     icon: '💪', namePt: 'Força',        nameEn: 'Strength',     shortPt: 'FOR', shortEn: 'STR' },
  { key: 'dexterity',    icon: '🏹', namePt: 'Destreza',     nameEn: 'Dexterity',    shortPt: 'DES', shortEn: 'DEX' },
  { key: 'constitution', icon: '🛡️', namePt: 'Constituição', nameEn: 'Constitution', shortPt: 'CON', shortEn: 'CON' },
  { key: 'intelligence', icon: '📚', namePt: 'Inteligência', nameEn: 'Intelligence', shortPt: 'INT', shortEn: 'INT' },
  { key: 'wisdom',       icon: '🔮', namePt: 'Sabedoria',    nameEn: 'Wisdom',       shortPt: 'SAB', shortEn: 'WIS' },
  { key: 'charisma',     icon: '✨', namePt: 'Carisma',      nameEn: 'Charisma',     shortPt: 'CAR', shortEn: 'CHA' },
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
  asiTotals?: Partial<Record<AbilityName, number>>;
  equipBonuses?: Partial<Record<AbilityName, number>>;
  onAddSkillProficiency: (skillId: string) => void;
}

export default function SkillsChecksPanel({
  char, language, themeColors: c, activeTraitEffects,
  asiTotals = {}, equipBonuses = {},
  onAddSkillProficiency,
}: Props) {
  const [results, setResults] = useState<Record<string, { total: number; detail: string; critical?: boolean }>>({});
  const pt = language === 'pt';

  const prof = getProficiencyBonus(char.level);
  const cls = getClassById(char.className);
  const rageActive = activeTraitEffects.has('rage');

  // Saving throw proficiencies from class
  const saveProfKeys = new Set<AbilityName>(
    (cls?.savingThrowsEn ?? []).map((s) => EN_TO_KEY[s]).filter(Boolean) as AbilityName[]
  );

  // Skill picking
  const profs = char.skillProficiencies ?? [];
  const classOptions = CLASS_SKILL_OPTIONS[char.className] ?? [];
  const maxPicks = CLASS_SKILL_COUNT[char.className] ?? 2;
  const eligibleOptions = classOptions.length === 0 ? SKILLS.map((s) => s.id) : classOptions;
  const remainingPicks = Math.max(0, maxPicks - profs.length);

  console.log('[SkillsChecksPanel]', { className: char.className, profs, maxPicks, remainingPicks, eligibleOptions });

  function roll(id: string, bonus: number, adv: 'normal' | 'adv' | 'dis' = 'normal') {
    const d20 = rollD20(adv);
    const total = d20.value + bonus;
    const critical = d20.value === 20 || d20.value === 1;
    setResults((prev) => ({ ...prev, [id]: { total, detail: `${d20.detail}${fmtMod(bonus)}`, critical: d20.value === 20 } }));
    setTimeout(() => setResults((prev) => { const n = { ...prev }; delete n[id]; return n; }), 5000);
  }

  return (
    <View style={{ padding: 12 }}>
      {/* Prof bonus + remaining picks header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ color: c.subtext, fontSize: 13 }}>
          {pt ? `Bônus de Proficiência: ` : `Proficiency Bonus: `}
          <Text style={{ color: c.accent, fontWeight: '700' }}>{fmtMod(prof)}</Text>
        </Text>
        {remainingPicks > 0 && (
          <View style={{ backgroundColor: c.accent, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ color: c.bg, fontWeight: '700', fontSize: 12 }}>
              {remainingPicks} {pt ? 'escolha(s)' : 'pick(s) left'}
            </Text>
          </View>
        )}
      </View>

      {remainingPicks > 0 && (
        <Text style={{ color: c.accent, fontSize: 12, marginBottom: 10, fontStyle: 'italic' }}>
          {pt ? '◈ Toque em uma perícia disponível (●) para adicionar proficiência.' : '◈ Tap an available skill (●) to add proficiency.'}
        </Text>
      )}

      {ABILITY_INFO.map((ab) => {
        const rawScore = char.abilityScores[ab.key] + (asiTotals[ab.key] ?? 0) + (equipBonuses[ab.key] ?? 0);
        const mod = getModifier(rawScore);
        const hasSaveProf = saveProfKeys.has(ab.key);
        const saveBonus = mod + (hasSaveProf ? prof : 0);
        const rageAdv = rageActive && ab.key === 'strength';
        const skills = SKILLS.filter((s) => s.ability === ab.key);

        const saveId = `save_${ab.key}`;
        const checkId = `check_${ab.key}`;
        const saveResult = results[saveId];
        const checkResult = results[checkId];

        return (
          <View key={ab.key} style={{
            marginBottom: 10,
            backgroundColor: c.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: c.border,
            overflow: 'hidden',
          }}>
            {/* ── Ability header bar ── */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: c.border + '33', paddingHorizontal: 12, paddingVertical: 8,
            }}>
              <Text style={{ color: c.text, fontWeight: '800', fontSize: 15, flex: 1 }}>
                {ab.icon} {pt ? ab.namePt : ab.nameEn}
                {'  '}
                <Text style={{ color: c.accent, fontWeight: '700', fontSize: 16 }}>
                  {fmtMod(mod)}
                </Text>
                {'  '}
                <Text style={{ color: c.subtext, fontSize: 12, fontWeight: '400' }}>
                  ({rawScore})
                </Text>
              </Text>
              {rageAdv && (
                <Text style={{ color: '#44ff66', fontSize: 11, fontWeight: '700' }}>⚡ADV</Text>
              )}
            </View>

            <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}>

              {/* ── Saving Throw ── */}
              <TouchableOpacity
                onPress={() => roll(saveId, saveBonus, rageAdv ? 'adv' : 'normal')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingVertical: 6,
                  borderBottomWidth: 1, borderBottomColor: c.border + '44',
                }}
              >
                <Text style={{ color: c.subtext, fontSize: 12, flex: 1 }}>
                  🛡️ {pt ? 'Resistência' : 'Saving Throw'}
                  {hasSaveProf
                    ? <Text style={{ color: c.accent, fontSize: 11, fontWeight: '700' }}>{pt ? ' ✦ classe' : ' ✦ class'}</Text>
                    : null}
                </Text>
                <Text style={{ color: hasSaveProf ? c.accent : c.text, fontWeight: '700', fontSize: 13, minWidth: 36, textAlign: 'right' }}>
                  {fmtMod(saveBonus)}
                </Text>
                {saveResult ? (
                  <Text style={{ color: saveResult.critical ? '#ffd700' : c.accent, fontWeight: '800', fontSize: 14, minWidth: 50, textAlign: 'right' }}>
                    {' '}{saveResult.total}
                    <Text style={{ color: c.subtext, fontSize: 10, fontWeight: '400' }}> {saveResult.detail}</Text>
                  </Text>
                ) : (
                  <Text style={{ color: c.subtext, fontSize: 11, minWidth: 50, textAlign: 'right' }}>🎲</Text>
                )}
              </TouchableOpacity>

              {/* ── Raw ability check ── */}
              <TouchableOpacity
                onPress={() => roll(checkId, mod, rageAdv ? 'adv' : 'normal')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingVertical: 6,
                  borderBottomWidth: 1, borderBottomColor: c.border + '44',
                }}
              >
                <Text style={{ color: c.border, fontSize: 12, width: 14 }}>·</Text>
                <Text style={{ color: c.subtext, fontSize: 12, flex: 1 }}>
                  🎲 {pt ? `Teste de ${ab.shortPt}` : `${ab.shortEn} Check`}
                </Text>
                <Text style={{ color: c.text, fontWeight: '600', fontSize: 13, minWidth: 36, textAlign: 'right' }}>
                  {fmtMod(mod)}
                </Text>
                {checkResult ? (
                  <Text style={{ color: checkResult.critical ? '#ffd700' : c.accent, fontWeight: '800', fontSize: 14, minWidth: 50, textAlign: 'right' }}>
                    {' '}{checkResult.total}
                    <Text style={{ color: c.subtext, fontSize: 10, fontWeight: '400' }}> {checkResult.detail}</Text>
                  </Text>
                ) : (
                  <Text style={{ color: c.subtext, fontSize: 11, minWidth: 50, textAlign: 'right' }}>🎲</Text>
                )}
              </TouchableOpacity>

              {/* ── Skills ── */}
              {skills.map((sk, idx) => {
                const isProficient = profs.includes(sk.id);
                const isEligible = eligibleOptions.includes(sk.id);
                const canPick = !isProficient && isEligible && remainingPicks > 0;
                const skillBonus = mod + (isProficient ? prof : 0);
                const rid = `skill_${sk.id}`;
                const result = results[rid];
                const skillName = pt ? sk.name : sk.nameEn;
                const isLast = idx === skills.length - 1;

                return (
                  <View
                    key={sk.id}
                    style={{
                      flexDirection: 'row', alignItems: 'center',
                      paddingVertical: 6,
                      borderBottomWidth: isLast ? 0 : 1, borderBottomColor: c.border + '22',
                    }}
                  >
                    {/* Proficiency dot — only show if proficient or pickable */}
                    <TouchableOpacity
                      onPress={() => {
                        console.log('[dot press]', sk.id, { canPick, isProficient, isEligible, remainingPicks });
                        if (canPick) onAddSkillProficiency(sk.id);
                      }}
                      activeOpacity={canPick ? 0.4 : 1}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{ width: (isProficient || canPick) ? 28 : 8, alignItems: 'center' }}
                    >
                      <Text style={{
                        fontSize: 16,
                        color: isProficient ? c.accent : canPick ? c.accent + 'aa' : 'transparent',
                      }}>
                        {isProficient ? '◈' : canPick ? '●' : ''}
                      </Text>
                    </TouchableOpacity>

                    {/* Roll area — rest of the row */}
                    <TouchableOpacity
                      onPress={() => roll(rid, skillBonus, rageAdv ? 'adv' : 'normal')}
                      activeOpacity={0.7}
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={{
                        flex: 1, fontSize: 13,
                        color: isProficient ? c.text : c.subtext,
                        fontWeight: isProficient ? '600' : '400',
                      }}>
                        {skillName}
                      </Text>

                      <Text style={{
                        fontSize: 13, fontWeight: '700', minWidth: 36, textAlign: 'right',
                        color: isProficient ? c.accent : c.text,
                      }}>
                        {fmtMod(skillBonus)}
                      </Text>

                      {result ? (
                        <Text style={{ color: result.critical ? '#ffd700' : c.accent, fontWeight: '800', fontSize: 14, minWidth: 50, textAlign: 'right' }}>
                          {' '}{result.total}
                          <Text style={{ color: c.subtext, fontSize: 10, fontWeight: '400' }}> {result.detail}</Text>
                        </Text>
                      ) : (
                        <Text style={{ color: c.subtext, fontSize: 11, minWidth: 50, textAlign: 'right' }}>🎲</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}
