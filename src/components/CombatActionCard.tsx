import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { CombatAction } from '../types/combatAction';
import { rollDamage } from '../lib/dice';
import { translateDamageType, translateEquipRange } from '../lib/units';

export interface CombatActionCardTheme {
  bg: string;
  surface: string;
  accent: string;
  text: string;
  subtext: string;
  border: string;
}

type RollMode = 'normal' | 'adv' | 'dis';

const COST_CFG = {
  action: { symbol: 'A', icon: '🎯', color: '#e07b39' },
  bonus: { symbol: 'BA', icon: '⚡', color: '#3da1c8' },
  reaction: { symbol: 'R', icon: '🛡️', color: '#9c5de0' },
  free: { symbol: 'L', icon: '✓', color: '#5c8a5c' },
} as const;

const ACTION_COST_TAG = {
  action: { pt: 'Ação', en: 'Action', compactPt: 'A', compactEn: 'A', color: '#e07b39' },
  bonus: { pt: 'Ação Bônus', en: 'Bonus Action', compactPt: 'BA', compactEn: 'BA', color: '#3da1c8' },
  reaction: { pt: 'Reação', en: 'Reaction', compactPt: 'R', compactEn: 'R', color: '#9c5de0' },
  free: { pt: 'Livre', en: 'Free', compactPt: 'L', compactEn: 'F', color: '#5c8a5c' },
} as const;

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function rollToHit(mode: RollMode): { roll: number; detail: string } {
  if (mode === 'normal') {
    const r = rollD20();
    return { roll: r, detail: `d20:${r}` };
  }
  const a = rollD20();
  const b = rollD20();
  const roll = mode === 'adv' ? Math.max(a, b) : Math.min(a, b);
  const tag = mode === 'adv' ? 'ADV' : 'DIS';
  return { roll, detail: `${tag}:${a}/${b}->${roll}` };
}

interface RollOutcome {
  hit?: number;
  hitDetail?: string;
  dmg?: number;
  dmgDetail?: string;
  dmgType?: string;
  label?: string;
  critical?: boolean;
}

export interface CombatActionCardProps {
  action: CombatAction;
  language: 'pt' | 'en';
  units: 'metric' | 'imperial';
  canUseAction: boolean;
  canUseBonus: boolean;
  canUseReaction: boolean;
  kiPointsAvailable: number;
  activeTraitEffects: Set<string>;
  actionUses: Record<string, number>;
  themeColors: CombatActionCardTheme;
  onUseAction: () => void;
  onUseBonusAction: () => void;
  onUseReaction: () => void;
  onToggle: (tag: string) => void;
  onUseFeature: (id: string, max: number) => void;
  onUseCharge: (itemId: string) => void;
  onSpendKi?: (amount: number) => void;
  onCastSpell?: (spellId: string, slotLevel: number) => void;
  rageDmgBonus: number;
  actionTagVariant?: 'full' | 'compact';
  showWeaponTag?: boolean;
  forceDisabled?: boolean;
}

export default function CombatActionCard({
  action,
  language,
  units,
  canUseAction,
  canUseBonus,
  canUseReaction,
  kiPointsAvailable,
  activeTraitEffects,
  actionUses,
  themeColors: c,
  onUseAction,
  onUseBonusAction,
  onUseReaction,
  onToggle,
  onUseFeature,
  onUseCharge,
  onSpendKi,
  onCastSpell,
  rageDmgBonus,
  actionTagVariant = 'full',
  showWeaponTag = true,
  forceDisabled = false,
}: CombatActionCardProps) {
  const [result, setResult] = useState<RollOutcome | null>(null);
  const [rollMode, setRollMode] = useState<RollMode>('normal');
  const [modsOpen, setModsOpen] = useState(false);

  const cfg = COST_CFG[action.actionCost] ?? COST_CFG.action;
  const isToggle = action.isToggle ?? false;
  const effectTag = action.effectTag;
  const isEffectActive = effectTag ? activeTraitEffects.has(effectTag) : false;
  const isSpell = action.source === 'spell';
  const canRollToHit = action.attackBonus !== undefined;
  const actionTag = ACTION_COST_TAG[action.actionCost];

  const remaining = action.featureActionId
    ? (actionUses[action.featureActionId] ?? action.maxUses ?? null)
    : null;
  const isAtWill = action.useType === 'at_will';
  const featureExhausted = !isAtWill && !isEffectActive && remaining !== null && remaining <= 0;
  const kiExhausted = !isEffectActive && action.kiCost !== undefined && kiPointsAvailable < action.kiCost;
  const chargeExhausted = action.consumeCharge && (action.charges ?? 0) <= 0;
  const slotExhausted = isSpell && (action.spellLevel ?? 0) > 0 && (action.spellSlotsRemaining ?? 0) <= 0;
  const resourceAvailable =
    action.actionCost === 'bonus' ? canUseBonus
    : action.actionCost === 'reaction' ? canUseReaction
    : action.actionCost === 'free' ? true
    : canUseAction;

  const disabled =
    forceDisabled
    || featureExhausted
    || kiExhausted
    || chargeExhausted
    || slotExhausted
    || (!isToggle && !resourceAvailable);

  const setResultsAndClear = (next: RollOutcome) => {
    setResult(next);
    setTimeout(() => setResult(null), 5000);
  };

  const showResult = (msg: string) => setResultsAndClear({ label: msg });

  const consumeResource = () => {
    if (action.actionCost === 'bonus') onUseBonusAction();
    else if (action.actionCost === 'reaction') onUseReaction();
    else if (action.actionCost === 'action') onUseAction();
  };

  const handlePress = () => {
    if (disabled && !isEffectActive) return;
    const out: RollOutcome = {};
    const actionName = language === 'en' ? action.nameEn : action.namePt;

    // Basic utility action (no attack roll and no damage expression)
    if (action.source === 'basic' && action.attackBonus === undefined && !action.damage) {
      consumeResource();
      showResult(`✅ ${actionName}`);
      return;
    }

    // Basic checks with explicit skill labels and d20 detail
    if (action.source === 'basic' && action.attackBonus !== undefined && !action.damage) {
      const isHide = action.id === 'basic_hide';
      const isAthleticsCheck = action.id === 'basic_grapple' || action.id === 'basic_shove';
      if (isHide || isAthleticsCheck) {
        consumeResource();
        const hitRoll = rollToHit(rollMode);
        const total = hitRoll.roll + action.attackBonus;
        const bonusText = action.attackBonus >= 0 ? `+${action.attackBonus}` : `${action.attackBonus}`;
        if (isHide) {
          showResult(
            language === 'en'
              ? `🕶️ Stealth: ${total} (${hitRoll.detail}${bonusText})`
              : `🕶️ Furtividade: ${total} (${hitRoll.detail}${bonusText})`,
          );
        } else {
          showResult(
            language === 'en'
              ? `💪 Strength (Athletics): ${total} (${hitRoll.detail}${bonusText})`
              : `💪 Força (Atletismo): ${total} (${hitRoll.detail}${bonusText})`,
          );
        }
        return;
      }
    }

    if (isToggle && effectTag) {
      if (!isEffectActive) {
        consumeResource();
        if (action.featureActionId) onUseFeature(action.featureActionId, action.maxUses ?? 0);
        if (action.kiCost) onSpendKi?.(action.kiCost);
      }
      onToggle(effectTag);
      showResult(isEffectActive
        ? `❌ ${actionName} ${language === 'en' ? 'deactivated' : 'desativada'}`
        : `✅ ${actionName} ${language === 'en' ? 'activated' : 'ativada'}`);
      return;
    }

    if (action.source === 'feature' && !action.attackBonus) {
      consumeResource();
      if (action.featureActionId) onUseFeature(action.featureActionId, action.maxUses ?? 0);
      if (action.kiCost) onSpendKi?.(action.kiCost);
      if (action.damage) {
        const r = rollDamage(action.damage);
        showResult(`${r.total} [${r.detail}]${action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : ''}`);
      } else {
        showResult(`✅ ${actionName}`);
      }
      return;
    }

    if (isSpell) {
      consumeResource();
      if ((action.spellLevel ?? 0) > 0 && onCastSpell && action.spellId) {
        onCastSpell(action.spellId, action.spellLevel);
      }
      if (action.isSpellAttack && action.attackBonus !== undefined) {
        const hitRoll = rollToHit(rollMode);
        const d20 = hitRoll.roll;
        const hit = d20 + action.attackBonus;
        const isCrit = d20 === 20;
        const isFumble = d20 === 1;
        if (isFumble) {
          showResult(`💀 ${language === 'en' ? 'Miss!' : 'Errou!'} (${hitRoll.detail})`);
          return;
        }
        out.hit = hit;
        out.hitDetail = `${hitRoll.detail}${action.attackBonus >= 0 ? `+${action.attackBonus}` : action.attackBonus}`;
        out.critical = isCrit;
        if (action.damage) {
          const dmgExpr = isCrit
            ? action.damage.replace(/(\d+)d(\d+)/gi, (_, n, d) => `${Number(n) * 2}d${d}`)
            : action.damage;
          const dmgR = rollDamage(dmgExpr);
          out.dmg = dmgR.total;
          out.dmgDetail = dmgR.detail;
          out.dmgType = action.damageType;
        }
        setResultsAndClear(out);
      } else if (action.savingThrow) {
        const dc = action.savingThrow.ability;
        let resultLine = `CD ${8 + (action.attackBonus ?? 0)} ${language === 'en' ? action.savingThrow.abilityEn : dc}`;
        if (action.damage) {
          const dmgR = rollDamage(action.damage);
          const dmgType = action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : '';
          resultLine += `  ·  ${language === 'en' ? 'Dmg' : 'Dano'}: ${dmgR.total}${dmgType}`;
        }
        showResult(resultLine);
      } else {
        showResult(`✅ ${language === 'en' ? action.nameEn : action.namePt}`);
      }
      return;
    }

    consumeResource();
    const hitRoll = rollToHit(rollMode);
    const d20 = hitRoll.roll;
    let totalAttack = action.attackBonus ?? 0;
    let totalDmgBonus = 0;
    let extraDice = '';

    for (const mod of action.modifiers) {
      if (mod.attackBonus) totalAttack += mod.attackBonus;
      if (mod.damageBonus) totalDmgBonus += mod.damageBonus;
      if (mod.damageExtra) extraDice += (extraDice ? '+' : '') + mod.damageExtra;
    }

    if (
      activeTraitEffects.has('rage') &&
      (action.source === 'weapon' || action.source === 'basic') &&
      action.tags.includes('melee') && action.tags.includes('str')
    ) {
      totalDmgBonus += rageDmgBonus;
    }

    const hit = d20 + totalAttack;
    const isCrit = d20 === 20;
    const isFumble = d20 === 1;

    if (!action.damage || isFumble) {
      if (isFumble) {
        showResult(language === 'en' ? '💀 Critical miss!' : '💀 Falha crítica!');
      } else {
        out.hit = hit;
        out.hitDetail = `${hitRoll.detail}${totalAttack >= 0 ? `+${totalAttack}` : totalAttack}`;
        setResultsAndClear(out);
      }
      return;
    }

    const dmgExpr = isCrit
      ? action.damage.replace(/(\d+)d(\d+)/gi, (_, n, d) => `${Number(n) * 2}d${d}`)
      : action.damage;
    const dmgFull = extraDice ? `${dmgExpr}+${extraDice}` : dmgExpr;
    const dmgR = rollDamage(dmgFull);
    const totalDmg = dmgR.total + totalDmgBonus;

    if (action.consumeCharge && action.equipmentId) onUseCharge(action.equipmentId);
    if (action.featureActionId && action.useType !== 'at_will') onUseFeature(action.featureActionId, action.maxUses ?? 0);

    out.hit = hit;
    out.hitDetail = `${hitRoll.detail}${totalAttack >= 0 ? `+${totalAttack}` : totalAttack}`;
    out.critical = isCrit;
    out.dmg = totalDmg;
    out.dmgDetail = `${dmgR.detail}${totalDmgBonus ? `+${totalDmgBonus}` : ''}`;
    out.dmgType = action.damageType;
    setResultsAndClear(out);
  };

  const name = language === 'en' ? action.nameEn : action.namePt;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: isEffectActive ? cfg.color + '88' : c.border + '88', backgroundColor: c.surface },
        (disabled && !isEffectActive) && { opacity: 0.45 },
        isEffectActive && { backgroundColor: cfg.color + '18' },
      ]}
      onPress={handlePress}
      activeOpacity={0.75}
      disabled={disabled && !isEffectActive}
    >
      <View style={styles.topRow}>
        <Text style={styles.icon}>{action.icon}</Text>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{name}</Text>
        <View style={[styles.costBadge, { borderColor: actionTag.color + '88', backgroundColor: actionTag.color + '22' }]}>
          <Text style={[styles.costText, { color: actionTag.color }]}>
            {actionTagVariant === 'compact'
              ? (language === 'en' ? actionTag.compactEn : actionTag.compactPt)
              : (language === 'en' ? actionTag.en : actionTag.pt)}
          </Text>
        </View>
      </View>

      {showWeaponTag && action.source === 'weapon' && (
        <View style={styles.weaponTag}>
          <Text style={styles.weaponTagText}>
            {language === 'en' ? `Weapon: ${action.sourceNameEn}` : `Arma: ${action.sourceNamePt}`}
          </Text>
        </View>
      )}

      {isSpell && (action.spellLevel ?? 0) > 0 && (
        <Text style={[styles.slotBadge, (action.spellSlotsRemaining ?? 0) <= 0 && { color: '#555' }]}>
          {`${action.spellLevel}° · `}
          {(action.spellSlotsRemaining ?? 0) > 0
            ? `${action.spellSlotsRemaining} ${language === 'en' ? 'slot(s)' : 'espaço(s)'}`
            : (language === 'en' ? 'no slots' : 'sem espaços')}
        </Text>
      )}

      {isSpell && action.savingThrow && !action.isSpellAttack && (
        <Text style={styles.stats}>
          {`CD ${8 + (action.attackBonus ?? 0)} ${language === 'en' ? action.savingThrow.abilityEn : action.savingThrow.ability}`}
          {action.damage ? `  ·  ${action.damage}${action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : ''}` : ''}
        </Text>
      )}

      {(!isSpell || action.isSpellAttack) && (action.attackBonus !== undefined || action.damage) && (
        <Text style={styles.stats}>
          {action.attackBonus !== undefined ? `+${action.attackBonus} · ` : ''}
          {action.damage ?? ''}{action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : ''}
          {action.range ? ` · ${translateEquipRange(action.range, units, language)}` : ''}
        </Text>
      )}

      {action.modifiers.length > 0 && (
        <TouchableOpacity onPress={() => setModsOpen((v) => !v)} activeOpacity={0.8} style={styles.modToggleRow}>
          <Text style={styles.modToggleText}>
            {modsOpen ? '▲' : '▶'} {action.modifiers.length} {language === 'en' ? 'modifier(s)' : 'modificador(es)'}
          </Text>
        </TouchableOpacity>
      )}

      {modsOpen && action.modifiers.map((mod) => (
        <View key={mod.id} style={styles.modBadge}>
          <Text style={styles.modText}>{language === 'en' ? mod.labelEn : mod.labelPt}</Text>
        </View>
      ))}

      {canRollToHit && (
        <View style={styles.rollModeRow}>
          <TouchableOpacity style={[styles.rollModeBtn, rollMode === 'normal' && styles.rollModeBtnActive]} onPress={() => setRollMode('normal')} activeOpacity={0.8}>
            <Text style={[styles.rollModeText, rollMode === 'normal' && styles.rollModeTextActive]}>◈</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rollModeBtn, rollMode === 'adv' && styles.rollModeBtnActive]} onPress={() => setRollMode('adv')} activeOpacity={0.8}>
            <Text style={[styles.rollModeText, rollMode === 'adv' && styles.rollModeTextActive]}>▲ ADV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rollModeBtn, rollMode === 'dis' && styles.rollModeBtnActive]} onPress={() => setRollMode('dis')} activeOpacity={0.8}>
            <Text style={[styles.rollModeText, rollMode === 'dis' && styles.rollModeTextActive]}>▼ DIS</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEffectActive && (
        <Text style={[styles.activeBadge, { color: cfg.color }]}>
          {language === 'en' ? '● ACTIVE' : '● ATIVA'}
        </Text>
      )}

      {action.consumeCharge && action.charges !== undefined && (
        <View style={styles.chargeRow}>
          {(() => {
            const charges = action.charges ?? 0;
            const maxCharges = action.maxCharges ?? charges;
            return (
              <View style={styles.pips}>
                {Array.from({ length: maxCharges }).map((_, i) => (
                  <View key={i} style={[styles.pip, i < charges ? styles.pipFull : styles.pipEmpty]} />
                ))}
              </View>
            );
          })()}
        </View>
      )}

      {!isAtWill && remaining !== null && action.maxUses && (
        <Text style={styles.uses}>{remaining}/{action.maxUses}</Text>
      )}
      {action.kiCost !== undefined && (
        <Text style={[styles.uses, kiExhausted && { color: '#555' }]}>🌀 {action.kiCost} ki</Text>
      )}

      {result && (
        <View style={styles.resultBox}>
          {result.label ? (
            <Text style={[styles.resultText, { color: c.accent }]}>{result.label}</Text>
          ) : (
            <>
              {result.hit !== undefined && (
                <Text style={[styles.resultText, { color: c.text }, result.critical && { color: '#f0a500' }]}>
                  {language === 'en' ? 'Hit' : 'Acertou'}: {result.hit}{' '}
                  {result.critical ? '💥' : ''}
                  {result.hitDetail ? <Text style={[styles.resultDetail, { color: c.subtext }]}> ({result.hitDetail})</Text> : null}
                </Text>
              )}
              {result.dmg !== undefined && (
                <Text style={[styles.resultText, { color: c.text }]}>
                  {language === 'en' ? 'Damage' : 'Dano'}: {result.dmg}
                  {result.dmgType ? ` ${translateDamageType(result.dmgType as any, language)}` : ''}
                  {result.dmgDetail ? <Text style={[styles.resultDetail, { color: c.subtext }]}> ({result.dmgDetail})</Text> : null}
                </Text>
              )}
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  icon: { fontSize: 16 },
  name: { flex: 1, fontSize: 13, fontWeight: '600' },
  costBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  costText: { fontSize: 11, fontWeight: 'bold' },
  stats: { color: '#888', fontSize: 11, marginBottom: 2 },
  rollModeRow: { flexDirection: 'row', gap: 6, marginTop: 2, marginBottom: 2 },
  rollModeBtn: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#202020',
  },
  rollModeBtnActive: {
    borderColor: '#c090ff',
    backgroundColor: '#3a1f55',
  },
  rollModeText: { color: '#aaa', fontSize: 10, fontWeight: '700' },
  rollModeTextActive: { color: '#f1dcff' },
  modToggleRow: { marginTop: 4, marginBottom: 2 },
  modToggleText: { color: '#9ccfff', fontSize: 11, fontWeight: '700' },
  modBadge: {
    borderWidth: 1,
    borderColor: '#44607a',
    backgroundColor: '#1d2732',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  modText: { color: '#a7c0d8', fontSize: 11 },
  weaponTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#4f9ddf66',
    backgroundColor: '#4f9ddf22',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  weaponTagText: {
    color: '#9ccfff',
    fontSize: 10,
    fontWeight: '700',
  },
  activeBadge: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  chargeRow: { marginTop: 4, alignItems: 'flex-start' },
  pips: { flexDirection: 'row', gap: 4 },
  pip: { width: 9, height: 9, borderRadius: 5, borderWidth: 1 },
  pipFull: { backgroundColor: '#3da1c8', borderColor: '#3da1c8' },
  pipEmpty: { backgroundColor: 'transparent', borderColor: '#555' },
  slotBadge: { color: '#9c5de0', fontSize: 10, marginTop: 2 },
  uses: { color: '#666', fontSize: 10, marginTop: 2 },
  resultBox: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 8,
    backgroundColor: '#151515',
  },
  resultText: { fontSize: 12, fontWeight: '600' },
  resultDetail: { color: '#9a9a9a', fontSize: 11, fontWeight: '500' },
});
