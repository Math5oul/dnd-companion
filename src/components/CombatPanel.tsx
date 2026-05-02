import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { Character } from '../types/character';
import type { CombatAction, AdvDis, CombatModifier } from '../types/combatAction';
import { buildCombatActions } from '../lib/buildCombatActions';
import { rollDamage } from '../lib/dice';
import { translateDamageType, translateEquipRange } from '../lib/units';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rollD20(adv: AdvDis): { value: number; detail: string } {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  if (adv === 'adv') return { value: Math.max(a, b), detail: `adv[${a},${b}]` };
  if (adv === 'dis') return { value: Math.min(a, b), detail: `dis[${a},${b}]` };
  return { value: a, detail: `d20:${a}` };
}

const ACTION_COST_LABEL: Record<string, { pt: string; en: string; color: string }> = {
  action:   { pt: 'A',  en: 'A',  color: '#e07b39' },
  bonus:    { pt: 'BA', en: 'BA', color: '#3da1c8' },
  reaction: { pt: 'R',  en: 'R',  color: '#9c5de0' },
  free:     { pt: 'L',  en: 'F',  color: '#5c8a5c' },
};

const SOURCE_COLOR: Record<CombatAction['source'], string> = {
  weapon:  '#c0784a',
  feature: '#3da1c8',
  spell:   '#9c5de0',
  basic:   '#5c8a5c',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface RollResult {
  hit?: number;
  hitDetail?: string;
  dmg?: number;
  dmgDetail?: string;
  dmgType?: string;
  label?: string; // for feature-only results
  critical?: boolean;
}

interface Props {
  char: Character;
  language: 'pt' | 'en';
  units: 'metric' | 'imperial';
  themeColors: {
    bg: string; surface: string; accent: string;
    text: string; subtext: string; border: string;
  };
  onUseFeatureAction: (actionId: string, maxUses: number) => void;
  onUseCharge: (itemId: string) => void;
  actionUses: Record<string, number>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CombatPanel({
  char, language, units, themeColors: c,
  onUseFeatureAction, onUseCharge,
  actionUses,
}: Props) {
  const actions = useMemo(() => buildCombatActions(char), [char]);

  // Per-action adv/dis state
  const [advState, setAdvState] = useState<Record<string, AdvDis>>({});
  // Per-action roll results (cleared after 5s)
  const [results, setResults] = useState<Record<string, RollResult>>({});
  // Expanded modifier list per action
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const getAdv = (id: string): AdvDis => advState[id] ?? 'normal';

  const cycleAdv = (id: string) => {
    setAdvState((s) => {
      const cur = s[id] ?? 'normal';
      const next: AdvDis = cur === 'normal' ? 'adv' : cur === 'adv' ? 'dis' : 'normal';
      return { ...s, [id]: next };
    });
  };

  const clearResult = (id: string) => {
    setTimeout(() => setResults((s) => { const n = { ...s }; delete n[id]; return n; }), 6000);
  };

  const handleRoll = (action: CombatAction) => {
    const adv = getAdv(action.id);
    const res: RollResult = {};

    // Feature-only (no attack roll, just effect/damage)
    if (action.source === 'feature' && !action.attackBonus) {
      if (action.featureActionId) {
        onUseFeatureAction(action.featureActionId, action.maxUses ?? 0);
      }
      if (action.damage) {
        const dmgR = rollDamage(action.damage);
        res.label = `${language === 'en' ? action.nameEn : action.namePt}: ${dmgR.total} [${dmgR.detail}]`;
        res.dmg = dmgR.total;
        res.dmgDetail = dmgR.detail;
        res.dmgType = action.damageType;
      } else {
        res.label = language === 'en' ? `✅ ${action.nameEn} used` : `✅ ${action.namePt} ativada`;
      }
      setResults((s) => ({ ...s, [action.id]: res }));
      clearResult(action.id);
      return;
    }

    // Attack roll
    const d20Result = rollD20(adv);
    const isCritical = d20Result.value === 20;
    const isFumble = d20Result.value === 1;

    // Sum all attackBonus modifiers
    let totalAttackBonus = action.attackBonus ?? 0;
    let totalDamageBonus = 0;
    let extraDice = '';

    for (const mod of action.modifiers) {
      if (mod.attackBonus) totalAttackBonus += mod.attackBonus;
      if (mod.damageBonus) totalDamageBonus += mod.damageBonus;
      if (mod.damageExtra) extraDice += (extraDice ? '+' : '') + mod.damageExtra;
    }

    const hit = d20Result.value + totalAttackBonus;
    res.hit = hit;
    res.hitDetail = `${d20Result.detail}${totalAttackBonus >= 0 ? `+${totalAttackBonus}` : totalAttackBonus}`;
    res.critical = isCritical;

    if (action.damage && !isFumble) {
      let dmgStr = isCritical
        ? action.damage.replace(/(\d+)d(\d+)/gi, (_, n, d) => `${Number(n) * 2}d${d}`)
        : action.damage;
      if (extraDice) dmgStr += `+${extraDice}`;
      const dmgR = rollDamage(dmgStr);
      res.dmg = dmgR.total + totalDamageBonus;
      res.dmgDetail = dmgR.detail + (totalDamageBonus ? `+${totalDamageBonus}` : '');
      res.dmgType = action.damageType;
    }

    // Feature action use tracking
    if (action.featureActionId && action.useType !== 'at_will') {
      onUseFeatureAction(action.featureActionId, action.maxUses ?? 0);
    }

    // Consumible charge
    if (action.consumeCharge && action.equipmentId) {
      onUseCharge(action.equipmentId);
    }

    setResults((s) => ({ ...s, [action.id]: res }));
    clearResult(action.id);
  };

  // Group actions: weapons → accessories/traits → consumables
  const weapons = actions.filter((a) => (a.source === 'weapon' || a.source === 'basic') && !a.consumeCharge);
  const features = actions.filter((a) => a.source === 'feature');
  const consumables = actions.filter((a) => a.consumeCharge);

  const renderMod = (mod: CombatModifier) => (
    <View key={mod.id} style={[s.modBadge(c)]}>
      <Text style={[s.modText(c)]}>
        {language === 'en' ? mod.labelEn : mod.labelPt}
        {mod.conditionPt ? ` · ${language === 'en' ? mod.conditionEn : mod.conditionPt}` : ''}
      </Text>
    </View>
  );

  const renderAction = (action: CombatAction) => {
    const adv = getAdv(action.id);
    const result = results[action.id];
    const isExpanded = expanded[action.id] ?? false;

    // Feature use tracking
    const remaining = action.featureActionId
      ? (actionUses[action.featureActionId] ?? action.maxUses ?? null)
      : null;
    const isAtWill = action.useType === 'at_will';
    const featureExhausted = !isAtWill && remaining !== null && action.maxUses !== undefined && remaining <= 0;
    const chargeExhausted = action.consumeCharge && (action.charges ?? 0) <= 0;
    const exhausted = featureExhausted || chargeExhausted;

    const costInfo = ACTION_COST_LABEL[action.actionCost];
    const srcColor = SOURCE_COLOR[action.source];

    return (
      <View key={action.id} style={[s.card(c), exhausted && { opacity: 0.5 }]}>
        {/* Header row */}
        <View style={s.cardHeader}>
          <Text style={s.cardIcon}>{action.icon}</Text>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={s.cardName(c)}>
                {language === 'en' ? action.nameEn : action.namePt}
              </Text>
              {/* Action cost badge */}
              <View style={[s.costBadge, { backgroundColor: costInfo.color + '33', borderColor: costInfo.color + '88' }]}>
                <Text style={[s.costText, { color: costInfo.color }]}>
                  {language === 'en' ? costInfo.en : costInfo.pt}
                </Text>
              </View>
              {/* Source badge */}
              <View style={[s.sourceBadge, { backgroundColor: srcColor + '22', borderColor: srcColor + '55' }]}>
                <Text style={[s.sourceText, { color: srcColor }]}>
                  {language === 'en' ? action.sourceNameEn : action.sourceNamePt}
                </Text>
              </View>
            </View>
            {/* Stats row */}
            {(action.attackBonus !== undefined || action.damage) && (
              <Text style={s.cardStats(c)}>
                {action.attackBonus !== undefined && (
                  `${action.attackBonus >= 0 ? '+' : ''}${action.attackBonus} ⚔️  `
                )}
                {action.damage && `🎲 ${action.damage}`}
                {action.damageType && `  ${translateDamageType(action.damageType, language)}`}
                {action.range && `  · ${translateEquipRange(action.range, units, language)}`}
              </Text>
            )}
          </View>

          {/* Feature use pips */}
          {action.featureActionId && !isAtWill && action.maxUses && (
            <View style={s.pips}>
              {Array.from({ length: action.maxUses }).map((_, i) => (
                <View key={i} style={[s.pip(c), i < (remaining ?? action.maxUses!) ? s.pipFull(c) : s.pipEmpty(c)]} />
              ))}
            </View>
          )}
          {action.featureActionId && isAtWill && (
            <Text style={[s.atWill, { color: c.accent }]}>∞</Text>
          )}
          {/* Consumable charge pips */}
          {action.consumeCharge && action.charges !== undefined && (
            <View style={s.pips}>
              {Array.from({ length: action.charges }).map((_, i) => (
                <View key={i} style={[s.pip(c), s.pipFull(c)]} />
              ))}
            </View>
          )}
        </View>

        {/* Modifiers (collapsible) */}
        {action.modifiers.length > 0 && (
          <TouchableOpacity onPress={() => setExpanded((e) => ({ ...e, [action.id]: !isExpanded }))} activeOpacity={0.8}>
            <View style={s.modRow}>
              <Text style={[s.modToggle, { color: c.accent }]}>
                {isExpanded ? '▲' : '▶'} {action.modifiers.length} {language === 'en' ? 'modifier' : 'modificador'}{action.modifiers.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {isExpanded && action.modifiers.map(renderMod)}
          </TouchableOpacity>
        )}

        {/* Roll result */}
        {result && (
          <View style={s.resultBox(c)}>
            {result.label ? (
              <Text style={s.resultLabel(c)}>{result.label}</Text>
            ) : (
              <>
                {result.hit !== undefined && (
                  <Text style={[s.resultHit(c), result.critical && { color: '#f0a500' }]}>
                    🎯 {result.critical ? '💥 CRIT! ' : ''}{result.hit}  <Text style={s.resultDetail(c)}>{result.hitDetail}</Text>
                  </Text>
                )}
                {result.dmg !== undefined && (
                  <Text style={s.resultDmg(c)}>
                    💥 {result.dmg}  <Text style={s.resultDetail(c)}>{result.dmgDetail}  {result.dmgType ? translateDamageType(result.dmgType, language) : ''}</Text>
                  </Text>
                )}
              </>
            )}
          </View>
        )}

        {/* ADV/DIS + Roll buttons */}
        <View style={s.actionRow}>
          {/* Adv/Dis toggle */}
          <TouchableOpacity style={[s.advBtn(c), adv !== 'normal' && { backgroundColor: adv === 'adv' ? '#1a3a1a' : '#3a1a1a', borderColor: adv === 'adv' ? '#44ff66' : '#ff4444' }]} onPress={() => cycleAdv(action.id)} activeOpacity={0.8}>
            <Text style={[s.advText(c), adv === 'adv' && { color: '#44ff66' }, adv === 'dis' && { color: '#ff4444' }]}>
              {adv === 'normal' ? (language === 'en' ? '◈ Normal' : '◈ Normal') : adv === 'adv' ? '▲ ADV' : '▼ DIS'}
            </Text>
          </TouchableOpacity>

          {/* Roll button */}
          <TouchableOpacity
            style={[s.rollBtn(c), exhausted && s.rollBtnDisabled(c)]}
            onPress={() => { if (!exhausted) handleRoll(action); }}
            activeOpacity={0.7}
          >
            <Text style={s.rollBtnText(c)}>
              🎲 {exhausted
                ? (language === 'en' ? 'Exhausted' : 'Esgotado')
                : action.featureActionId && !action.attackBonus
                  ? (language === 'en' ? 'Activate' : 'Ativar')
                  : (language === 'en' ? 'Roll' : 'Rolar')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderGroup = (title: string, items: CombatAction[]) => {
    if (items.length === 0) return null;
    return (
      <View style={{ marginBottom: 4 }}>
        <Text style={s.groupTitle(c)}>{title}</Text>
        {items.map(renderAction)}
      </View>
    );
  };

  if (actions.length === 0) return null;

  return (
    <View>
      {renderGroup(language === 'en' ? '⚔️ Attacks' : '⚔️ Ataques', weapons)}
      {features.length > 0 && renderGroup(language === 'en' ? '⚡ Trait Actions' : '⚡ Ações de Trait', features)}
      {consumables.length > 0 && renderGroup(language === 'en' ? '🧪 Consumables' : '🧪 Consumíveis', consumables)}
    </View>
  );
}

// ─── Inline styles (function-based to accept theme) ───────────────────────────

type TC = Props['themeColors'];

const s = {
  card: (c: TC) => ({
    backgroundColor: c.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.border,
    padding: 12,
    marginBottom: 8,
  } as const),

  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 8,
  },

  cardIcon: { fontSize: 22, marginTop: 1 },

  cardName: (c: TC) => ({ color: c.text, fontSize: 15, fontWeight: '700' as const }),

  cardStats: (c: TC) => ({
    color: c.subtext, fontSize: 12, marginTop: 3,
  } as const),

  costBadge: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
  } as const,

  costText: { fontSize: 10, fontWeight: '800' as const },

  sourceBadge: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
  } as const,

  sourceText: { fontSize: 10, fontWeight: '600' as const },

  pips: { flexDirection: 'row' as const, gap: 3, alignSelf: 'center' as const },

  pip: (_c: TC) => ({ width: 9, height: 9, borderRadius: 5 } as const),
  pipFull: (c: TC) => ({ backgroundColor: c.accent } as const),
  pipEmpty: (c: TC) => ({ backgroundColor: c.border } as const),

  atWill: { fontSize: 16, fontWeight: '700' as const, alignSelf: 'center' as const },

  modRow: { flexDirection: 'row' as const, alignItems: 'center' as const, marginTop: 6 },
  modToggle: { fontSize: 12 },

  modBadge: (c: TC) => ({
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  } as const),
  modText: (c: TC) => ({ color: c.subtext, fontSize: 11 } as const),

  resultBox: (c: TC) => ({
    backgroundColor: c.bg,
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: c.border,
  } as const),
  resultLabel: (c: TC) => ({ color: c.accent, fontSize: 13, fontWeight: '700' as const }),
  resultHit: (c: TC) => ({ color: c.text, fontSize: 15, fontWeight: '800' as const }),
  resultDmg: (c: TC) => ({ color: c.accent, fontSize: 15, fontWeight: '800' as const }),
  resultDetail: (c: TC) => ({ color: c.subtext, fontSize: 12, fontWeight: '400' as const }),

  actionRow: {
    flexDirection: 'row' as const,
    gap: 8,
    marginTop: 10,
  },

  advBtn: (c: TC) => ({
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.border,
    paddingVertical: 8,
    alignItems: 'center' as const,
    backgroundColor: c.bg,
  } as const),
  advText: (c: TC) => ({ color: c.subtext, fontSize: 12, fontWeight: '700' as const }),

  rollBtn: (c: TC) => ({
    flex: 2,
    borderRadius: 8,
    backgroundColor: c.accent,
    paddingVertical: 8,
    alignItems: 'center' as const,
  } as const),
  rollBtnDisabled: (c: TC) => ({ backgroundColor: c.border } as const),
  rollBtnText: (c: TC) => ({ color: c.bg, fontSize: 13, fontWeight: '800' as const }),

  groupTitle: (c: TC) => ({
    color: c.text,
    fontSize: 14,
    fontWeight: '800' as const,
    letterSpacing: 0.4,
    marginBottom: 8,
    marginTop: 4,
  } as const),

};
