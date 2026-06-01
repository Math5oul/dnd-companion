import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Character } from '../types/character';
import { useCharacterStore } from '../store/characterStore';
import { convertRange, translateDamageType } from '../lib/units';
import { localizeSpellName } from '../lib/translations';
import { getSpellById, getSpellDamage, getSpellDamageAtSlot, SCHOOL_ICON, SCHOOL_COLOR } from '../data/spells';
import {
  detectMetamagic,
  spellAttackBonus as calcSpellAttackBonus,
  spellSaveDC as calcSpellSaveDC,
  applyMetamagicToDamage,
  metamagicCost,
  getSpellTraitBonuses,
  traitBonusesForSpell,
  computeSpellRange,
  applySpellTraitRange,
} from '../lib/metamagic';
import { rollDamage } from '../lib/dice';
import { useTurnStore } from '../store/turnStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThemeColors {
  bg: string;
  surface: string;
  accent: string;
  text: string;
  subtext: string;
  border: string;
}

interface Props {
  char: Character;
  language: 'pt' | 'en';
  units: 'metric' | 'imperial';
  themeColors: ThemeColors;
  /** Called after a spell is cast so turn tracker can consume the right resource */
  onConsumeAction?: (cost: 'action' | 'bonus' | 'reaction') => void;
  /** Called when a slot level has no remaining slots (show no-slot modal in parent) */
  onNoSlot?: (level: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ActionCostKey = 'action' | 'bonus' | 'reaction';

function castingTimeToCost(ct: string): ActionCostKey {
  const s = ct.toLowerCase();
  if (s.includes('bônus') || s.includes('bonus')) return 'bonus';
  if (s.includes('reação') || s.includes('reaction')) return 'reaction';
  return 'action';
}

const COST_BADGE: Record<ActionCostKey, { symbol: string; color: string }> = {
  action:   { symbol: 'A',  color: '#e07b39' },
  bonus:    { symbol: 'BA', color: '#3da1c8' },
  reaction: { symbol: 'R',  color: '#9c5de0' },
};

type AdvDis = 'normal' | 'adv' | 'dis';

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpellsPanel({
  char,
  language,
  units,
  themeColors: tc,
  onConsumeAction,
  onNoSlot,
}: Props) {
  const { useSpellSlot, useSorceryPoint, convertSlotToPoints, convertPointsToSlot, setConcentration } =
    useCharacterStore();
  const { turns } = useTurnStore();
  const turn = turns[char.id];

  // When onConsumeAction is provided we're inside the turn tracker — track exhaustion
  const inCombat = onConsumeAction !== undefined;
  const costExhausted: Record<ActionCostKey, boolean> = {
    action:   inCombat && !!turn && turn.actionsUsed >= turn.actionsTotal,
    bonus:    inCombat && !!turn && turn.bonusActionsUsed >= turn.bonusActionsTotal,
    reaction: inCombat && !!turn && turn.reactionsUsed >= turn.reactionsTotal,
  };

  const styles = useMemo(() => makeStyles(tc), [tc]);
  const L = (pt: string, en: string) => (language === 'en' ? en : pt);

  // ── Internal state ──────────────────────────────────────────────────────────
  const [spellCastResults, setSpellCastResults] = useState<
    Record<string, { hit?: number; hitDetail?: string; dmg?: number; dmgDetail?: string; critical?: boolean; notes?: string }>
  >({});
  const [spellAdv, setSpellAdv] = useState<Record<string, AdvDis>>({});
  const [spellMeta, setSpellMeta] = useState<Record<string, Set<string>>>({});

  // ── Computed ────────────────────────────────────────────────────────────────
  const knownSpellsByLevel = useMemo(() => {
    const groups: Record<number, NonNullable<ReturnType<typeof getSpellById>>[]> = {};
    (char.spells ?? []).forEach((sid) => {
      const sp = getSpellById(sid);
      if (!sp) return;
      if (!groups[sp.level]) groups[sp.level] = [];
      groups[sp.level].push(sp);
    });
    return groups;
  }, [char.spells]);

  const upcastSpellsAtSlot = useMemo(() => {
    const map: Record<number, NonNullable<ReturnType<typeof getSpellById>>[]> = {};
    const maxSlot = Math.max(...Object.keys(char.spellSlots ?? {}).map(Number), 0);
    (char.spells ?? []).forEach((sid) => {
      const sp = getSpellById(sid);
      if (!sp || !sp.upcastDice || sp.level === 0) return;
      for (let slot = sp.level + 1; slot <= maxSlot; slot++) {
        if (!map[slot]) map[slot] = [];
        map[slot].push(sp);
      }
    });
    return map;
  }, [char.spells, char.spellSlots]);

  const availableMetamagic = useMemo(() => detectMetamagic(char.traits ?? []), [char.traits]);
  const spellAtkBonus = calcSpellAttackBonus(char);
  const spellDC = calcSpellSaveDC(char);
  const spellTraitBonuses = getSpellTraitBonuses(char);
  const spLeft = char.sorceryPoints ? char.sorceryPoints.total - char.sorceryPoints.used : 0;

  const spellLevelNames = language === 'en'
    ? ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']
    : ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°'];

  // ── Cast handler ────────────────────────────────────────────────────────────
  const handleCastSpell = (
    spellKey: string,
    spellLevel: number,
    dmgStr: string | null,
    spellObj?: ReturnType<typeof getSpellById>,
  ) => {
    if (spellLevel > 0) {
      const slot = char.spellSlots[spellLevel];
      if (!slot || slot.used >= slot.total) {
        onNoSlot?.(spellLevel);
        return;
      }
      useSpellSlot(char.id, spellLevel);
    }

    const advState = spellAdv[spellKey] ?? 'normal';
    const chosenMeta = spellMeta[spellKey] ?? new Set<string>();
    const availMeta = detectMetamagic(char.traits ?? []);

    // Consume sorcery points for metamagic
    if (chosenMeta.size > 0) {
      const spCost = metamagicCost(chosenMeta, spellLevel);
      for (let i = 0; i < spCost; i++) useSorceryPoint(char.id);
    }

    // Notify turn tracker of resource consumption
    if (onConsumeAction && spellObj?.castingTime) {
      const baseCost = castingTimeToCost(spellObj.castingTime);
      // Quickened metamagic converts action → bonus action
      const effectiveCost = chosenMeta.has('quickened') && baseCost === 'action' ? 'bonus' : baseCost;
      onConsumeAction(effectiveCost);
    }

    // Concentration: if this spell requires it, set concentration (replaces any existing)
    if (spellObj && spellObj.duration.toLowerCase().startsWith('concentra')) {
      setConcentration(char.id, spellKey);
    }

    if (spellObj?.attackRoll) {
      const rollD20 = () => Math.floor(Math.random() * 20) + 1;
      const a = rollD20();
      const b = rollD20();
      const d20 = advState === 'adv' ? Math.max(a, b) : advState === 'dis' ? Math.min(a, b) : a;
      const advLabel =
        advState === 'adv' ? `adv[${a},${b}]` : advState === 'dis' ? `dis[${a},${b}]` : `d20:${a}`;
      const atkBonus = spellAtkBonus;
      const hit = d20 + atkBonus;
      const isCrit = d20 === 20;
      const hitDetail = `${advLabel}+${atkBonus}`;

      const relevant = spellObj ? traitBonusesForSpell(spellTraitBonuses, spellObj) : [];
      const extraDmgBonus = relevant.reduce((s, b) => s + b.damageBonus, 0);
      const traitEffectNotes = relevant
        .map((b) => language === 'en' ? b.noteEn : b.notePt)
        .filter((n): n is string => !!n);

      let finalDmg: number | undefined;
      let finalDmgDetail: string | undefined;
      let notes: string | undefined;

      if (dmgStr) {
        const dmgExpression = isCrit
          ? dmgStr.replace(/(\d+)d(\d+)/gi, (_, n, d) => `${Number(n) * 2}d${d}`)
          : dmgStr;
        const baseDmgExpr = extraDmgBonus ? `${dmgExpression}+${extraDmgBonus}` : dmgExpression;
        const metaResult = applyMetamagicToDamage(baseDmgExpr, chosenMeta, char);
        const rolledDmg = rollDamage(metaResult.dmg);
        finalDmg = rolledDmg.total;
        finalDmgDetail = rolledDmg.detail;
        notes = metaResult.notes.join(' · ') || undefined;
      }

      const metaNames = [...chosenMeta].map((mid) => {
        const opt = availMeta.find((m) => m.id === mid);
        return opt ? (language === 'en' ? opt.nameEn : opt.namePt) : mid;
      });
      if (metaNames.length > 0) notes = (notes ? notes + ' · ' : '') + `⚗️ ${metaNames.join(' + ')}`;
      if (chosenMeta.has('quickened')) notes = '⚡ BA · ' + (notes ?? '');
      if (chosenMeta.has('heightened'))
        notes = (notes ?? '') + `  ⬇️ ${L('Alvo: desv. resist.', 'Target: disadv save')}`;
      if (chosenMeta.has('twinned')) notes = (notes ?? '') + `  ×2 ${L('alvos', 'targets')}`;
      if (traitEffectNotes.length > 0) {
        notes = (notes ? notes + ' · ' : '') + traitEffectNotes.join(' · ');
      }

      setSpellCastResults((prev) => ({
        ...prev,
        [spellKey]: { hit, hitDetail, dmg: finalDmg, dmgDetail: finalDmgDetail, critical: isCrit, notes },
      }));
      setTimeout(
        () => setSpellCastResults((prev) => { const n = { ...prev }; delete n[spellKey]; return n; }),
        6000,
      );
      return;
    }

    // Saving-throw or utility spells
    if (dmgStr) {
      const relevant = spellObj ? traitBonusesForSpell(spellTraitBonuses, spellObj) : [];
      const extraDmgBonus = relevant.reduce((s, b) => s + b.damageBonus, 0);
      const traitEffectNotes = relevant
        .map((b) => language === 'en' ? b.noteEn : b.notePt)
        .filter((n): n is string => !!n);
      const baseDmgExpr = extraDmgBonus ? `${dmgStr}+${extraDmgBonus}` : dmgStr;
      const metaResult = applyMetamagicToDamage(baseDmgExpr, chosenMeta, char);
      const rolledDmg = rollDamage(metaResult.dmg);
      const metaNames = [...chosenMeta].map((mid) => {
        const opt = availMeta.find((m) => m.id === mid);
        return opt ? (language === 'en' ? opt.nameEn : opt.namePt) : mid;
      });
      let notes: string | undefined = metaResult.notes.join(' · ') || undefined;
      if (metaNames.length > 0) notes = (notes ? notes + ' · ' : '') + `⚗️ ${metaNames.join(' + ')}`;
      if (chosenMeta.has('heightened'))
        notes = (notes ?? '') + `  ⬇️ ${L('Alvo: desv. resist.', 'Target: disadv save')}`;
      if (chosenMeta.has('twinned')) notes = (notes ?? '') + `  ×2 ${L('alvos', 'targets')}`;
      if (traitEffectNotes.length > 0) {
        notes = (notes ? notes + ' · ' : '') + traitEffectNotes.join(' · ');
      }
      setSpellCastResults((prev) => ({
        ...prev,
        [spellKey]: { dmg: rolledDmg.total, dmgDetail: rolledDmg.detail, notes },
      }));
      setTimeout(
        () => setSpellCastResults((prev) => { const n = { ...prev }; delete n[spellKey]; return n; }),
        6000,
      );
    }
  };

  // ── Render helpers ──────────────────────────────────────────────────────────

  const renderCastResult = (spellKey: string) => {
    const castResult = spellCastResults[spellKey];
    if (!castResult) return null;
    return (
      <View style={styles.castResultBox}>
        {castResult.hit !== undefined && (
          <Text style={{ color: castResult.critical ? '#f0a500' : tc.text, fontWeight: '800', fontSize: 14 }}>
            🎯 {castResult.critical ? '💥 CRIT! ' : ''}{castResult.hit}
            {'  '}
            <Text style={{ color: tc.subtext, fontSize: 11, fontWeight: '400' }}>{castResult.hitDetail}</Text>
          </Text>
        )}
        {castResult.dmg !== undefined && (
          <Text style={{ color: tc.accent, fontWeight: '800', fontSize: 14 }}>
            💥 {castResult.dmg}
            {'  '}
            <Text style={{ color: tc.subtext, fontSize: 11, fontWeight: '400' }}>{castResult.dmgDetail}</Text>
          </Text>
        )}
        {castResult.notes && (
          <Text style={{ color: tc.subtext, fontSize: 11, marginTop: 2 }}>{castResult.notes}</Text>
        )}
      </View>
    );
  };

  const renderMetamagicRow = (spellKey: string, slotLevel: number) => {
    if (availableMetamagic.length === 0) return null;
    const chosenMeta = spellMeta[spellKey] ?? new Set<string>();
    return (
      <View style={styles.metaRow}>
        <Text style={{ color: tc.subtext, fontSize: 10, alignSelf: 'center' }}>⚗️</Text>
        {availableMetamagic.map((opt) => {
          const chosen = chosenMeta.has(opt.id);
          const cost = opt.id === 'twinned' ? slotLevel : opt.cost;
          const canAfford = spLeft >= cost || chosen;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.metaChip,
                {
                  borderColor: chosen ? tc.accent : tc.border,
                  backgroundColor: chosen ? tc.accent + '22' : tc.bg,
                  opacity: canAfford || chosen ? 1 : 0.4,
                },
              ]}
              onPress={() => {
                if (!canAfford && !chosen) return;
                setSpellMeta((prev) => {
                  const cur = new Set(prev[spellKey] ?? []);
                  chosen ? cur.delete(opt.id) : cur.add(opt.id);
                  return { ...prev, [spellKey]: cur };
                });
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: chosen ? tc.accent : tc.subtext,
                  fontWeight: chosen ? '700' : '400',
                }}
              >
                {chosen ? '✓ ' : ''}
                {language === 'en' ? opt.nameEn : opt.namePt}({cost}sp)
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderSpellRow = (
    sp: NonNullable<ReturnType<typeof getSpellById>>,
    spellKey: string,
    slotLevel: number,
    dmg: string | null,
    isUpcast: boolean,
    available: number,
  ) => {
    const castResult = spellCastResults[spellKey];
    const adv = spellAdv[spellKey] ?? 'normal';
    const chosenMeta = spellMeta[spellKey] ?? new Set<string>();
    const relevantBonuses = traitBonusesForSpell(spellTraitBonuses, sp);
    const traitBaseRange = applySpellTraitRange(sp.range, relevantBonuses);
    const effectiveRange = computeSpellRange(traitBaseRange, chosenMeta);
    const rangeModified = effectiveRange !== sp.range;
    const dmgBonusTotal = relevantBonuses.reduce((s, b) => s + b.damageBonus, 0);
    const traitEffectNotes = relevantBonuses
      .map((b) => language === 'en' ? b.noteEn : b.notePt)
      .filter((n): n is string => !!n);
    const castingCostKey = castingTimeToCost(sp.castingTime ?? '1 ação');
    const effectiveCostKey: ActionCostKey = chosenMeta.has('quickened') && castingCostKey === 'action' ? 'bonus' : castingCostKey;
    const badge = COST_BADGE[effectiveCostKey];
    const isExhausted = costExhausted[effectiveCostKey];
    const isConcentration = sp.duration.toLowerCase().startsWith('concentra');
    const isSlotEmpty = available === 0;

    return (
      <View
        key={spellKey}
        style={[
          styles.spellMiniRow,
          isUpcast && styles.spellMiniRowUpcast,
          castResult ? styles.spellMiniRowActive : undefined,
          (isSlotEmpty || isExhausted) ? styles.spellMiniRowDisabled : undefined,
        ]}
      >
        <View style={{ flex: 1 }}>
          {/* Header row */}
          <View style={styles.spellMiniHeader}>
            <Text style={[styles.spellMiniIcon, { color: SCHOOL_COLOR[sp.school] }]}>
              {SCHOOL_ICON[sp.school]}
            </Text>
            {/* A/BA/R badge */}
            <View style={[styles.costBadge, { borderColor: badge.color + '88', backgroundColor: badge.color + '22' }]}>
              <Text style={[styles.costBadgeText, { color: badge.color }]}>{badge.symbol}</Text>
            </View>
            <View style={styles.spellMiniNameRow}>
              <Text style={styles.spellMiniName}>{localizeSpellName(sp, language)}</Text>
              {isUpcast && (
                <Text style={styles.upcastBadge}>↑{slotLevel}°</Text>
              )}
              {isConcentration && (
                <Text style={styles.concBadge}>🔮</Text>
              )}
            </View>
            <Text
              style={{
                color: rangeModified ? tc.accent : tc.subtext,
                fontSize: 10,
                marginRight: 4,
              }}
            >
              📏 {convertRange(effectiveRange, units, language)}
              {rangeModified ? ' ×2' : ''}
            </Text>
            {sp.savingThrow && (
              <Text style={{ color: tc.subtext, fontSize: 10 }}>
                CD{spellDC} {language === 'en' ? sp.savingThrow.abilityEn : sp.savingThrow.ability}
              </Text>
            )}
            {dmg && !castResult && (
              <Text style={styles.spellMiniDmg}>🎲 {translateDamageType(dmg, language)}</Text>
            )}
          </View>

          {/* Trait bonuses */}
          {(dmgBonusTotal !== 0 || traitEffectNotes.length > 0) && (
            <View style={{ marginLeft: 24, marginTop: 2 }}>
              {dmgBonusTotal !== 0 && (
                <Text style={{ color: tc.accent, fontSize: 10 }}>
                  +{dmgBonusTotal} {L('dano de trait', 'trait damage')}
                </Text>
              )}
              {traitEffectNotes.map((note, idx) => (
                <Text key={`${spellKey}-trait-note-${idx}`} style={{ color: tc.subtext, fontSize: 10 }}>
                  • {note}
                </Text>
              ))}
            </View>
          )}

          {/* Metamagic chips */}
          {renderMetamagicRow(spellKey, slotLevel)}

          {/* Cast result */}
          {renderCastResult(spellKey)}

          {/* ADV/DIS + Cast button */}
          {(dmg || sp.attackRoll || sp.savingThrow) && !isSlotEmpty && (
            <View style={styles.castRow}>
              {sp.attackRoll && !isExhausted && (
                <TouchableOpacity
                  style={[
                    styles.advBtn,
                    adv === 'adv' && styles.advBtnAdv,
                    adv === 'dis' && styles.advBtnDis,
                  ]}
                  onPress={() =>
                    setSpellAdv((prev) => {
                      const cur = prev[spellKey] ?? 'normal';
                      const nxt = cur === 'normal' ? 'adv' : cur === 'adv' ? 'dis' : 'normal';
                      return { ...prev, [spellKey]: nxt };
                    })
                  }
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: adv === 'adv' ? '#44ff66' : adv === 'dis' ? '#ff4444' : tc.subtext,
                    }}
                  >
                    {adv === 'normal' ? '◈ Normal' : adv === 'adv' ? '▲ ADV' : '▼ DIS'}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.castBtn, isExhausted && styles.castBtnDisabled]}
                onPress={() => handleCastSpell(spellKey, slotLevel, dmg, sp)}
                disabled={isExhausted}
              >
                <Text style={{ color: isExhausted ? tc.subtext : tc.bg, fontWeight: '800', fontSize: 12 }}>
                  🎲{' '}
                  {sp.attackRoll
                    ? L('Atacar', 'Attack')
                    : sp.savingThrow
                    ? `CD${spellDC} ${L('Resist.', 'Save')}`
                    : L('Conjurar', 'Cast')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Cantrip: always show cast button even without damage */}
          {slotLevel === 0 && !dmg && !sp.attackRoll && !sp.savingThrow && (
            <TouchableOpacity
              style={[styles.castBtn, { marginTop: 6 }, isExhausted && styles.castBtnDisabled]}
              onPress={() => handleCastSpell(spellKey, 0, null, sp)}
              disabled={isExhausted}
            >
              <Text style={{ color: isExhausted ? tc.subtext : tc.bg, fontWeight: '800', fontSize: 12 }}>
                ✨ {L('Conjurar', 'Cast')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View>
      {/* ── Pontos de Feitiçaria ── */}
      {char.className === 'sorcerer' && char.sorceryPoints && char.sorceryPoints.total > 0 && (() => {
        const { total, used } = char.sorceryPoints!;
        const available = total - used;
        return (
          <View style={styles.sorceryBlock}>
            <View style={styles.sorceryHeader}>
              <Text style={styles.sorceryTitle}>{L('Pontos de Feitiçaria', 'Sorcery Points')}</Text>
              <Text style={styles.sorceryCount}>{available}/{total}</Text>
            </View>
            <View style={styles.sorceryDots}>
              {Array.from({ length: total }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => (i >= used ? useSorceryPoint(char.id) : undefined)}
                  activeOpacity={i >= used ? 0.7 : 1}
                >
                  <View
                    style={[styles.sorceryDot, i < used ? styles.sorceryDotUsed : styles.sorceryDotFull]}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Slot → Pontos */}
            <Text style={styles.flexCastLabel}>{L('Slot → Pontos', 'Slot → Points')}</Text>
            <View style={styles.flexCastRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                const slotInfo = char.spellSlots?.[lvl];
                if (!slotInfo) return null;
                const slotAvailable = slotInfo.total - slotInfo.used;
                return (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.flexCastBtn, slotAvailable <= 0 && styles.flexCastBtnDisabled]}
                    disabled={slotAvailable <= 0}
                    onPress={() => convertSlotToPoints(char.id, lvl)}
                  >
                    <Text style={styles.flexCastBtnText}>
                      {spellLevelNames[lvl - 1]} +{lvl}pt
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pontos → Slot */}
            <Text style={styles.flexCastLabel}>{L('Pontos → Slot', 'Points → Slot')}</Text>
            <View style={styles.flexCastRow}>
              {([1, 2, 3, 4, 5] as const).map((lvl) => {
                const COST: Record<number, number> = { 1: 2, 2: 3, 3: 5, 4: 6, 5: 7 };
                const cost = COST[lvl];
                const canAfford = available >= cost;
                return (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.flexCastBtn, !canAfford && styles.flexCastBtnDisabled]}
                    disabled={!canAfford}
                    onPress={() => convertPointsToSlot(char.id, lvl)}
                  >
                    <Text style={styles.flexCastBtnText}>
                      {spellLevelNames[lvl - 1]} -{cost}pt
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })()}

      {/* ── Truques ── */}
      {(knownSpellsByLevel[0]?.length ?? 0) > 0 && (
        <View style={styles.spellsBlock}>
          <Text style={styles.spellGroupLabel}>{L('TRUQUES', 'CANTRIPS')}</Text>
          {knownSpellsByLevel[0].map((sp) => {
            const dmg = getSpellDamage(sp, char.level);
            return renderSpellRow(sp, sp.id, 0, dmg, false, Infinity);
          })}
        </View>
      )}

      {/* ── Slots com magias ── */}
      {Object.keys(char.spellSlots ?? {}).length > 0 && (
        <View style={styles.spellsBlock}>
          {Object.entries(char.spellSlots).map(([lvl, slot]) => {
            const available = slot.total - slot.used;
            const numLvl = Number(lvl);
            const spellsOfLevel = knownSpellsByLevel[numLvl] ?? [];
            const upcastable = upcastSpellsAtSlot[numLvl] ?? [];

            return (
              <View key={lvl} style={styles.slotGroup}>
                {/* Slot header */}
                <View style={styles.spellRow}>
                  <Text style={styles.spellLevel}>
                    {spellLevelNames[numLvl - 1]} {L('nível', 'level')}
                  </Text>
                  <View style={styles.slotDots}>
                    {Array.from({ length: slot.total }).map((_, i) => (
                      <View
                        key={i}
                        style={[styles.slotDot, i < available ? styles.slotDotFull : styles.slotDotEmpty]}
                      />
                    ))}
                  </View>
                  <Text style={styles.slotCount}>
                    {available}/{slot.total}
                  </Text>
                </View>

                {spellsOfLevel.length === 0 && upcastable.length === 0 && (
                  <Text style={styles.noSpellsHint}>
                    {L('Nenhuma magia deste nível conhecida', 'No spells of this level known')}
                  </Text>
                )}

                {spellsOfLevel.map((sp) =>
                  renderSpellRow(sp, sp.id, numLvl, getSpellDamage(sp, char.level), false, available),
                )}
                {upcastable.map((sp) =>
                  renderSpellRow(
                    sp,
                    `${sp.id}-up${lvl}`,
                    numLvl,
                    getSpellDamageAtSlot(sp, numLvl),
                    true,
                    available,
                  ),
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    spellsBlock: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#c090ff33',
      gap: 4,
    },
    spellGroupLabel: {
      color: '#c090ff',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 4,
    },
    slotGroup: { marginBottom: 6 },
    spellRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    spellLevel: { color: '#c090ff', fontSize: 13, width: 60 },
    slotDots: { flexDirection: 'row', gap: 4, flex: 1 },
    slotDot: { width: 12, height: 12, borderRadius: 6 },
    slotDotFull: { backgroundColor: '#c090ff' },
    slotDotEmpty: { backgroundColor: c.bg, borderWidth: 1, borderColor: '#6a5080' },
    slotCount: { color: '#8a7090', fontSize: 12, width: 30, textAlign: 'right' },
    noSpellsHint: { color: c.subtext, fontSize: 11, fontStyle: 'italic', paddingLeft: 8, paddingTop: 4 },

    spellMiniRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 5,
      paddingHorizontal: 8,
      backgroundColor: c.bg + 'aa',
      borderRadius: 6,
      marginTop: 3,
    },
    spellMiniRowActive: {
      backgroundColor: '#1a0030',
      borderWidth: 1,
      borderColor: '#c090ff66',
    },
    spellMiniRowDisabled: { opacity: 0.35 },
    spellMiniRowUpcast: {
      borderLeftWidth: 2,
      borderLeftColor: '#8060c0',
      backgroundColor: '#1e1030',
    },

    spellMiniHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spellMiniIcon: { fontSize: 14, width: 20, textAlign: 'center' },
    costBadge: {
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 1,
      marginRight: 4,
    },
    costBadgeText: { fontSize: 9, fontWeight: '800' },
    spellMiniNameRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    spellMiniName: { color: c.accent, fontSize: 13 },
    upcastBadge: {
      fontSize: 10,
      fontWeight: '700',
      color: '#a080e0',
      backgroundColor: '#2d1a50',
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 4,
    },
    concBadge: { fontSize: 13 },
    spellMiniDmg: { color: '#ff8040', fontSize: 12, fontWeight: '600' },

    castResultBox: {
      backgroundColor: c.bg,
      borderRadius: 6,
      padding: 6,
      marginTop: 4,
      borderWidth: 1,
      borderColor: c.border,
    },

    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 4,
      marginLeft: 24,
    },
    metaChip: {
      borderRadius: 5,
      borderWidth: 1,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },

    castRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
    advBtn: {
      flex: 1,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.bg,
      paddingVertical: 5,
      alignItems: 'center',
    },
    advBtnAdv: { borderColor: '#44ff66', backgroundColor: '#1a3a1a' },
    advBtnDis: { borderColor: '#ff4444', backgroundColor: '#3a1a1a' },
    castBtn: {
      flex: 2,
      borderRadius: 7,
      backgroundColor: c.accent,
      paddingVertical: 5,
      alignItems: 'center',
    },
    castBtnDisabled: {
      backgroundColor: c.border,
      opacity: 0.5,
    },

    // Sorcery Points
    sorceryBlock: {
      backgroundColor: '#1e0a30',
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#9040c055',
    },
    sorceryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sorceryTitle: { color: '#c090f0', fontSize: 14, fontWeight: '700' },
    sorceryCount: { color: '#c090f0', fontSize: 14, fontWeight: '700' },
    sorceryDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    sorceryDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
    sorceryDotFull: { backgroundColor: '#9040c0', borderColor: '#c090f0' },
    sorceryDotUsed: { backgroundColor: 'transparent', borderColor: '#5a2080' },
    flexCastLabel: {
      color: '#b388ff',
      fontSize: 11,
      fontWeight: '600',
      marginTop: 10,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    flexCastRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    flexCastBtn: {
      backgroundColor: '#5a2080',
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    flexCastBtnDisabled: { backgroundColor: '#2a1040', opacity: 0.5 },
    flexCastBtnText: { color: '#e0c8ff', fontSize: 12, fontWeight: '600' },
  });
}
