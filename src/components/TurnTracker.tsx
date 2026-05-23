import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Character } from '../types/character';
import type { CombatAction } from '../types/combatAction';
import type { Equipment } from '../types/equipment';
import { useTurnStore } from '../store/turnStore';
import { useCharacterStore } from '../store/characterStore';
import { buildCombatActions } from '../lib/buildCombatActions';
import { rollDamage } from '../lib/dice';
import { translateDamageType, convertSpeed } from '../lib/units';
import SpellsPanel from './SpellsPanel';
import CombatManeuvers from './CombatManeuvers';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Ícone e cor únicos por tipo de custo de ação — nunca se repetem */
const COST_CFG = {
  action:   { symbol: 'A',  icon: '🎯', color: '#e07b39' },
  bonus:    { symbol: 'BA', icon: '⚡', color: '#3da1c8' },
  reaction: { symbol: 'R',  icon: '🛡️', color: '#9c5de0' },
  free:     { symbol: 'L',  icon: '✓',  color: '#5c8a5c' },
} as const;

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

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
  /** Estado dos toggles ativos (rage, ki_step…) */
  activeTraitEffects: Set<string>;
  /** Usos restantes de ações de features */
  actionUses: Record<string, number>;
  onToggleTraitEffect: (tag: string) => void;
  onUseFeatureAction: (actionId: string, maxUses: number) => void;
  onUseCharge: (itemId: string) => void;
  onSpendKi?: (amount: number) => void;
  /** Consome um slot de magia (chamado ao conjurar uma magia nivelada) */
  onCastSpell?: (spellId: string, slotLevel: number) => void;
}

// ─── ResourcePip ─────────────────────────────────────────────────────────────

/**
 * Uma fileira de pips para um tipo de recurso (Ação / Bônus / Reação).
 * Usa ícone e cor únicos para cada tipo — tap usa, tap de volta desfaz.
 */
function ResourceRow({
  labelPt,
  labelEn,
  costKey,
  total,
  used,
  language,
  onUse,
  onUndo,
}: {
  labelPt: string;
  labelEn: string;
  costKey: keyof typeof COST_CFG;
  total: number;
  used: number;
  language: 'pt' | 'en';
  onUse: () => void;
  onUndo: () => void;
}) {
  const cfg = COST_CFG[costKey];
  return (
    <View style={rr.row}>
      <View style={[rr.typeBadge, { borderColor: cfg.color + '66', backgroundColor: cfg.color + '18' }]}>
        <Text style={[rr.typeIcon]}>{cfg.icon}</Text>
        <Text style={[rr.typeLabel, { color: cfg.color }]}>
          {language === 'en' ? labelEn : labelPt}
        </Text>
      </View>
      <View style={rr.pips}>
        {Array.from({ length: total }).map((_, i) => {
          const isUsed = i < used;
          return (
            <TouchableOpacity
              key={i}
              onPress={isUsed ? onUndo : onUse}
              activeOpacity={0.7}
              style={[
                rr.pip,
                isUsed
                  ? rr.pipUsed
                  : { borderColor: cfg.color, backgroundColor: cfg.color + '22' },
              ]}
            >
              <Text style={{ fontSize: 13, color: isUsed ? '#444' : cfg.color, fontWeight: 'bold' }}>
                {isUsed ? '✕' : cfg.symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const rr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    minWidth: 90,
  },
  typeIcon: { fontSize: 13 },
  typeLabel: { fontSize: 12, fontWeight: '600' },
  pips: { flexDirection: 'row', gap: 6 },
  pip: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  pipUsed: { borderColor: '#333', backgroundColor: '#1a1a1a' },
});

// ─── ActionCard ───────────────────────────────────────────────────────────────

interface CardProps {
  action: CombatAction;
  language: 'pt' | 'en';
  canUseAction: boolean;
  canUseBonus: boolean;
  canUseReaction: boolean;
  kiPointsAvailable: number;
  activeTraitEffects: Set<string>;
  actionUses: Record<string, number>;
  themeColors: ThemeColors;
  onUseAction: () => void;
  onUseBonusAction: () => void;
  onUseReaction: () => void;
  onToggle: (tag: string) => void;
  onUseFeature: (id: string, max: number) => void;
  onUseCharge: (itemId: string) => void;
  onSpendKi?: (amount: number) => void;
  onCastSpell?: (spellId: string, slotLevel: number) => void;
  rageDmgBonus: number;
}

function ActionCard({
  action, language, canUseAction, canUseBonus, canUseReaction,
  kiPointsAvailable,
  activeTraitEffects, actionUses, themeColors: c,
  onUseAction, onUseBonusAction, onUseReaction,
  onToggle, onUseFeature, onUseCharge, onSpendKi, onCastSpell,
  rageDmgBonus,
}: CardProps) {
  const [result, setResult] = useState<string | null>(null);

  const cfg = COST_CFG[action.actionCost] ?? COST_CFG.action;
  const isToggle = action.isToggle ?? false;
  const effectTag = action.effectTag;
  const isEffectActive = effectTag ? activeTraitEffects.has(effectTag) : false;
  const isSpell = action.source === 'spell';

  const remaining = action.featureActionId
    ? (actionUses[action.featureActionId] ?? action.maxUses ?? null)
    : null;
  const isAtWill = action.useType === 'at_will';
  const featureExhausted = !isAtWill && !isEffectActive && remaining !== null && (remaining <= 0);
  const kiExhausted = !isEffectActive && action.kiCost !== undefined && kiPointsAvailable < action.kiCost;
  const chargeExhausted = action.consumeCharge && (action.charges ?? 0) <= 0;
  const slotExhausted = isSpell && (action.spellLevel ?? 0) > 0 &&
    (action.spellSlotsRemaining ?? 0) <= 0;
  const resourceAvailable =
    action.actionCost === 'bonus' ? canUseBonus
    : action.actionCost === 'reaction' ? canUseReaction
    : action.actionCost === 'free' ? true
    : canUseAction;
  const disabled = featureExhausted || kiExhausted || chargeExhausted || slotExhausted || (!isToggle && !resourceAvailable);

  const showResult = (msg: string) => {
    setResult(msg);
    setTimeout(() => setResult(null), 5000);
  };

  const consumeResource = () => {
    if (action.actionCost === 'bonus') onUseBonusAction();
    else if (action.actionCost === 'reaction') onUseReaction();
    else if (action.actionCost === 'action') onUseAction();
    // 'free' = doesn't consume
  };

  const handlePress = () => {
    if (disabled && !isEffectActive) return;

    // ── Toggle feature ──
    if (isToggle && effectTag) {
      if (!isEffectActive) {
        consumeResource();
        if (action.featureActionId) onUseFeature(action.featureActionId, action.maxUses ?? 0);
        if (action.kiCost) onSpendKi?.(action.kiCost);
      }
      onToggle(effectTag);
      const name = language === 'en' ? action.nameEn : action.namePt;
      showResult(isEffectActive
        ? `❌ ${name} ${language === 'en' ? 'deactivated' : 'desativada'}`
        : `✅ ${name} ${language === 'en' ? 'activated' : 'ativada'}`);
      return;
    }

    // ── Non-toggle feature ──
    if (action.source === 'feature' && !action.attackBonus) {
      consumeResource();
      if (action.featureActionId) onUseFeature(action.featureActionId, action.maxUses ?? 0);
      if (action.kiCost) onSpendKi?.(action.kiCost);
      if (action.damage) {
        const r = rollDamage(action.damage);
        showResult(`${r.total} [${r.detail}]${action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : ''}`);
      } else {
        const name = language === 'en' ? action.nameEn : action.namePt;
        showResult(`✅ ${name}`);
      }
      return;
    }

    // ── Spell ──
    if (isSpell) {
      consumeResource();
      // Consome slot se for magia nivelada
      if ((action.spellLevel ?? 0) > 0 && onCastSpell && action.spellId) {
        onCastSpell(action.spellId, action.spellLevel!);
      }
      // Spell attack roll
      if (action.isSpellAttack && action.attackBonus !== undefined) {
        const d20 = rollD20();
        const hit = d20 + action.attackBonus;
        const isCrit = d20 === 20;
        const isFumble = d20 === 1;
        if (isFumble) { showResult(`💀 ${language === 'en' ? 'Miss!' : 'Errou!'}`); return; }
        let resultLine = `${isCrit ? '💥 CRÍTICO! ' : ''}${language === 'en' ? 'Hit' : 'Acertou'}: ${hit}`;
        if (action.damage) {
          const dmgExpr = isCrit
            ? action.damage.replace(/(\d+)d(\d+)/gi, (_, n, d) => `${Number(n) * 2}d${d}`)
            : action.damage;
          const dmgR = rollDamage(dmgExpr);
          const dmgType = action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : '';
          resultLine += `  →  ${language === 'en' ? 'Dmg' : 'Dano'}: ${dmgR.total}${dmgType}`;
        }
        showResult(resultLine);
      } else if (action.savingThrow) {
        // Save spell: show DC and optionally roll damage
        const dc = action.savingThrow.ability;
        let resultLine = `CD ${8 + (action.attackBonus ?? 0)} ${language === 'en' ? action.savingThrow.abilityEn : dc}`;
        if (action.damage) {
          const dmgR = rollDamage(action.damage);
          const dmgType = action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : '';
          resultLine += `  ·  ${language === 'en' ? 'Dmg' : 'Dano'}: ${dmgR.total}${dmgType}`;
        }
        showResult(resultLine);
      } else {
        // Utility spell
        showResult(`✅ ${language === 'en' ? action.nameEn : action.namePt}`);
      }
      return;
    }

    // ── Attack ──
    consumeResource();
    const d20 = rollD20();
    let totalAttack = action.attackBonus ?? 0;
    let totalDmgBonus = 0;
    let extraDice = '';
    for (const mod of action.modifiers) {
      if (mod.attackBonus) totalAttack += mod.attackBonus;
      if (mod.damageBonus) totalDmgBonus += mod.damageBonus;
      if (mod.damageExtra) extraDice += (extraDice ? '+' : '') + mod.damageExtra;
    }
    // Rage bonus damage
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
      showResult(`${isFumble ? '💀 Falha crítica!' : `${hit}`}  (d20:${d20}${totalAttack >= 0 ? `+${totalAttack}` : totalAttack})`);
      return;
    }

    const dmgExpr = isCrit
      ? action.damage.replace(/(\d+)d(\d+)/gi, (_, n, d) => `${Number(n) * 2}d${d}`)
      : action.damage;
    const dmgFull = extraDice ? `${dmgExpr}+${extraDice}` : dmgExpr;
    const dmgR = rollDamage(dmgFull);
    const totalDmg = dmgR.total + totalDmgBonus;
    const dmgType = action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : '';

    if (action.consumeCharge && action.equipmentId) onUseCharge(action.equipmentId);
    if (action.featureActionId && action.useType !== 'at_will') onUseFeature(action.featureActionId, action.maxUses ?? 0);

    showResult(
      `${isCrit ? '💥 CRÍTICO! ' : ''}${language === 'en' ? 'Hit' : 'Acertou'}: ${hit}  →  ${language === 'en' ? 'Dmg' : 'Dano'}: ${totalDmg}${dmgType}`
    );
  };

  const name = language === 'en' ? action.nameEn : action.namePt;

  return (
    <TouchableOpacity
      style={[
        ac.card,
        { borderColor: isEffectActive ? cfg.color + '88' : c.border + '88', backgroundColor: c.surface },
        (disabled && !isEffectActive) && { opacity: 0.45 },
        isEffectActive && { backgroundColor: cfg.color + '18' },
      ]}
      onPress={handlePress}
      activeOpacity={0.75}
      disabled={disabled && !isEffectActive}
    >
      {/* Top row: icon + name + cost badge */}
      <View style={ac.topRow}>
        <Text style={ac.icon}>{action.icon}</Text>
        <Text style={[ac.name, { color: c.text }]} numberOfLines={1}>{name}</Text>
        <View style={[ac.costBadge, { borderColor: cfg.color + '88', backgroundColor: cfg.color + '22' }]}>
          <Text style={[ac.costText, { color: cfg.color }]}>{cfg.icon} {cfg.symbol}</Text>
        </View>
      </View>

      {/* Stats row */}
      {isSpell && (action.spellLevel ?? 0) > 0 && (
        <Text style={[ac.slotBadge, (action.spellSlotsRemaining ?? 0) <= 0 && { color: '#555' }]}>
          {`${action.spellLevel}° · `}
          {(action.spellSlotsRemaining ?? 0) > 0
            ? `${action.spellSlotsRemaining} ${language === 'en' ? 'slot(s)' : 'espaço(s)'}`
            : (language === 'en' ? 'no slots' : 'sem espaços')}
        </Text>
      )}
      {isSpell && action.savingThrow && !action.isSpellAttack && (
        <Text style={ac.stats}>
          {`CD ${8 + (action.attackBonus ?? 0)} ${language === 'en' ? action.savingThrow.abilityEn : action.savingThrow.ability}`}
          {action.damage ? `  ·  ${action.damage}${action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : ''}` : ''}
        </Text>
      )}
      {(!isSpell || action.isSpellAttack) && (action.attackBonus !== undefined || action.damage) && (
        <Text style={ac.stats}>
          {action.attackBonus !== undefined ? `+${action.attackBonus} · ` : ''}
          {action.damage ?? ''}{action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : ''}
        </Text>
      )}
      {isSpell && !action.isSpellAttack && !action.savingThrow && action.damage && (
        <Text style={ac.stats}>
          {action.damage}{action.damageType ? ` ${translateDamageType(action.damageType as any, language)}` : ''}
        </Text>
      )}

      {/* Active badge for toggles */}
      {isEffectActive && (
        <Text style={[ac.activeBadge, { color: cfg.color }]}>
          {language === 'en' ? '● ACTIVE' : '● ATIVA'}
        </Text>
      )}

      {/* Uses remaining / Ki cost */}
      {!isAtWill && remaining !== null && action.maxUses && (
        <Text style={ac.uses}>{remaining}/{action.maxUses}</Text>
      )}
      {action.kiCost !== undefined && (
        <Text style={[ac.uses, kiExhausted && { color: '#555' }]}>🌀 {action.kiCost} ki</Text>
      )}

      {/* Result */}
      {result && (
        <View style={ac.resultBox}>
          <Text style={[ac.resultText, { color: c.accent }]}>{result}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const ac = StyleSheet.create({
  card: {
    borderWidth: 1, borderRadius: 10,
    padding: 10, marginBottom: 8,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  icon: { fontSize: 16 },
  name: { flex: 1, fontSize: 13, fontWeight: '600' },
  costBadge: {
    borderWidth: 1, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  costText: { fontSize: 11, fontWeight: 'bold' },
  stats: { color: '#888', fontSize: 11, marginBottom: 2 },
  activeBadge: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  slotBadge: { color: '#9c5de0', fontSize: 10, marginTop: 2 },
  uses: { color: '#666', fontSize: 10, marginTop: 2 },
  resultBox: { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#333' },
  resultText: { fontSize: 12, fontWeight: '600' },
});

// ─── ConsumableCard ───────────────────────────────────────────────────────────

function ConsumableCard({
  item, language, canUseBonus, themeColors: c, onUse,
}: {
  item: Equipment;
  language: 'pt' | 'en';
  canUseBonus: boolean;
  themeColors: ThemeColors;
  onUse: () => Promise<{ hpGained: number; detail: string }>;
}) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const L = (pt: string, en: string) => language === 'en' ? en : pt;

  const handlePress = async () => {
    if (!canUseBonus || loading) return;
    setLoading(true);
    const { hpGained, detail } = await onUse();
    setLoading(false);

    if (hpGained > 0) {
      setResult(`❤️ +${hpGained} HP  (${detail})`);
    } else if (item.useEffect?.type === 'damage') {
      // Roll damage dice locally for display
      const r = rollDamage(item.useEffect.dice);
      const dmgType = item.useEffect.damageType
        ? ` ${translateDamageType(item.useEffect.damageType as any, language)}`
        : '';
      setResult(`💥 ${r.total}${dmgType}  (${r.detail})`);
    } else if (item.useEffect?.type === 'temp_hp') {
      setResult(`🛡️ ${L('PV temp aplicados', 'Temp HP applied')}`);
    } else if (item.bonuses.length > 0) {
      setResult(`✨ ${L('Efeito ativo até descanso', 'Effect active until rest')}`);
    } else if (item.attacks.length > 0) {
      setResult(`🔥 ${L('Ativado! Veja as ações', 'Activated! Check actions')}`);
    } else {
      setResult(`✅ ${L('Usado', 'Used')}`);
    }
    setTimeout(() => setResult(null), 5000);
  };

  const charges = item.charges ?? 1;
  const effectDesc = item.useEffect
    ? item.useEffect.type === 'heal'
      ? `${item.useEffect.dice} ${L('cura', 'healing')}`
      : item.useEffect.type === 'damage'
        ? `${item.useEffect.dice} ${item.useEffect.damageType
            ? translateDamageType(item.useEffect.damageType as any, language)
            : L('dano', 'damage')}`
        : `${item.useEffect.dice} ${L('PV temp', 'temp HP')}`
    : item.bonuses.length > 0
      ? L('Bônus de atributo', 'Attribute bonus')
      : item.description
        ? item.description.slice(0, 50)
        : '';

  return (
    <TouchableOpacity
      style={[
        ac.card,
        { borderColor: '#3da1c844', backgroundColor: c.surface },
        (!canUseBonus || loading) && { opacity: 0.45 },
      ]}
      onPress={handlePress}
      activeOpacity={0.75}
      disabled={!canUseBonus || loading}
    >
      <View style={ac.topRow}>
        <Text style={ac.icon}>🧪</Text>
        <Text style={[ac.name, { color: c.text }]} numberOfLines={1}>{item.name}</Text>
        <View style={[ac.costBadge, { borderColor: '#3da1c888', backgroundColor: '#3da1c822' }]}>
          <Text style={[ac.costText, { color: '#3da1c8' }]}>⚡ BA</Text>
        </View>
      </View>

      {!!effectDesc && (
        <Text style={ac.stats}>{effectDesc}</Text>
      )}
      {charges > 1 && (
        <Text style={ac.uses}>{charges}× {L('cargas', 'charges')}</Text>
      )}

      {result && (
        <View style={ac.resultBox}>
          <Text style={[ac.resultText, { color: c.accent }]}>{result}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TurnTracker({
  char, language, units, themeColors: c,
  activeTraitEffects, actionUses,
  onToggleTraitEffect, onUseFeatureAction, onUseCharge, onSpendKi, onCastSpell,
}: Props) {
  const [manobraOpen, setManobraOpen] = useState(false);
  const {
    session, turns,
    startSession, endSession, endTurn,
    useAction, useBonusAction, useReaction, useMovement,
    undoAction, undoBonusAction, undoReaction, undoMovement,
  } = useTurnStore();
  const { useKiPoint, useEquipmentCharge, activateConsumable } = useCharacterStore();

  const turn = turns[char.id];
  const isInSession = !!session && session.characterIds.includes(char.id);

  const allActions = useMemo(() => buildCombatActions(char), [char]);
  const actionGroup    = allActions.filter((a) => a.actionCost === 'action'   && a.source !== 'spell');
  const bonusGroup     = allActions.filter((a) => a.actionCost === 'bonus'    && a.source !== 'spell');
  const reactionGroup  = allActions.filter((a) => a.actionCost === 'reaction' && a.source !== 'spell');
  const freeGroup      = allActions.filter((a) => a.actionCost === 'free'     && a.source !== 'spell');

  // Rage damage bonus by level
  const rageDmgBonus = char.level >= 16 ? 4 : char.level >= 9 ? 3 : 2;

  const styles = makeStyles(c);

  const L = (pt: string, en: string) => language === 'en' ? en : pt;

  const movementRemaining = turn ? turn.movementTotal - turn.movementUsed : 0;
  const movementPct = turn && turn.movementTotal > 0
    ? 1 - turn.movementUsed / turn.movementTotal : 0;

  // ── Sem sessão ─────────────────────────────────────────────────────────────
  if (!isInSession) {
    return (
      <View style={styles.startRow}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => startSession(L('Combate', 'Combat'), [char])}
          activeOpacity={0.8}
        >
          <Text style={styles.startBtnText}>⚔️ {L('Iniciar Combate', 'Start Combat')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!turn) return null;

  const canAct    = turn.actionsUsed < turn.actionsTotal;
  const canBonus  = turn.bonusActionsUsed < turn.bonusActionsTotal;
  const canReact  = turn.reactionsUsed < turn.reactionsTotal;

  const kiPointsAvailable = (char.kiPoints?.total ?? 0) - (char.kiPoints?.used ?? 0);

  const cardProps = (action: CombatAction) => ({
    action,
    language,
    canUseAction: canAct,
    canUseBonus: canBonus,
    canUseReaction: canReact,
    kiPointsAvailable,
    activeTraitEffects,
    actionUses,
    themeColors: c,
    onUseAction: () => useAction(char.id),
    onUseBonusAction: () => useBonusAction(char.id),
    onUseReaction: () => useReaction(char.id),
    onToggle: onToggleTraitEffect,
    onUseFeature: onUseFeatureAction,
    onUseCharge,
    onSpendKi,
    onCastSpell,
    rageDmgBonus,
  });

  const renderSection = (
    costKey: keyof typeof COST_CFG,
    labelPt: string,
    labelEn: string,
    group: CombatAction[],
  ) => {
    if (!group.length) return null;
    const cfg = COST_CFG[costKey];
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{cfg.icon}</Text>
          <Text style={[styles.sectionLabel, { color: cfg.color }]}>
            {L(labelPt, labelEn).toUpperCase()}
          </Text>
        </View>
        {group.map((a) => <ActionCard key={a.id} {...cardProps(a)} />)}
      </View>
    );
  };

  // ── Em sessão ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {turn.isActive ? `⚔️ ${L('Seu Turno', 'Your Turn')}` : `⏳ ${L('Aguardando...', 'Waiting...')}`}
        </Text>
        <Text style={styles.roundBadge}>{L('Rodada', 'Round')} {session.roundNumber}</Text>
      </View>

      {/* ── Iniciativa ── */}
      <View style={styles.initiativeRow}>
        <Text style={styles.initiativeLabel}>🎲 {L('Iniciativa', 'Initiative')}</Text>
        <Text style={styles.initiativeValue}>{turn.initiative}</Text>
        <Text style={styles.initiativeDetail}>
          (d20:{turn.initiativeRoll}{turn.initiativeBonus >= 0 ? '+' : ''}{turn.initiativeBonus})
        </Text>
      </View>

      <View style={styles.body}>
        {/* ── Recursos ── */}
        <View style={styles.resourcesCard}>
          <ResourceRow
            labelPt="Ação" labelEn="Action"
            costKey="action"
            total={turn.actionsTotal} used={turn.actionsUsed}
            language={language}
            onUse={() => useAction(char.id)}
            onUndo={() => undoAction(char.id)}
          />
          <ResourceRow
            labelPt="Bônus" labelEn="Bonus"
            costKey="bonus"
            total={turn.bonusActionsTotal} used={turn.bonusActionsUsed}
            language={language}
            onUse={() => useBonusAction(char.id)}
            onUndo={() => undoBonusAction(char.id)}
          />
          <ResourceRow
            labelPt="Reação" labelEn="Reaction"
            costKey="reaction"
            total={turn.reactionsTotal} used={turn.reactionsUsed}
            language={language}
            onUse={() => useReaction(char.id)}
            onUndo={() => undoReaction(char.id)}
          />

          {/* Movimento */}
          <View style={styles.moveRow}>
            <View style={[rr.typeBadge, { borderColor: '#4caf5066', backgroundColor: '#4caf5018', minWidth: 90 }]}>
              <Text style={{ fontSize: 13 }}>🏃</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#4caf50' }}>
                {L('Movimento', 'Movement')}
              </Text>
            </View>
            <View style={styles.moveRight}>
              <View style={styles.moveBarBg}>
                <View
                  style={[
                    styles.moveBarFill,
                    {
                      width: `${Math.round(movementPct * 100)}%` as `${number}%`,
                      backgroundColor: movementPct > 0.5 ? '#4caf50' : movementPct > 0 ? '#ff9800' : '#555',
                    },
                  ]}
                />
              </View>
              <View style={styles.moveFooter}>
                <Text style={styles.moveLabel}>
                  {convertSpeed(movementRemaining, units, language)} {L('restante', 'remaining')}
                </Text>
                <View style={styles.moveSteppers}>
                  <TouchableOpacity
                    style={[styles.stepBtn, turn.movementUsed === 0 && styles.stepDisabled]}
                    onPress={() => undoMovement(char.id, 5)}
                    disabled={turn.movementUsed === 0}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stepText, { color: c.text }]}>−5ft</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.stepBtn, movementRemaining < 5 && styles.stepDisabled]}
                    onPress={() => useMovement(char.id, 5)}
                    disabled={movementRemaining < 5}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stepText, { color: c.text }]}>+5ft</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Ki Points (Monge) ── */}
        {char.className === 'monk' && char.level >= 2 && char.kiPoints && char.kiPoints.total > 0 && (() => {
          const { total, used } = char.kiPoints!;
          const available = total - used;
          return (
            <View style={styles.kiBlock}>
              <View style={styles.kiHeader}>
                <Text style={styles.kiTitle}>🌀 {L('Pontos de Ki', 'Ki Points')}</Text>
                <Text style={styles.kiCount}>{available}/{total}</Text>
              </View>
              <View style={styles.kiDots}>
                {Array.from({ length: total }).map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { if (i >= used) useKiPoint(char.id); }}
                    activeOpacity={i >= used ? 0.7 : 1}
                  >
                    <View style={[styles.kiDot, i < used ? styles.kiDotUsed : styles.kiDotFull]} />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.kiHint}>
                {L('Toque para gastar 1 ki. Recupera em descanso curto ou longo.', 'Tap to spend 1 ki. Recovers on short or long rest.')}
              </Text>
            </View>
          );
        })()}

        {/* ── Ações disponíveis ── */}
        {renderSection('action',   'Ações',   'Actions',   actionGroup)}
        {renderSection('bonus',    'Bônus',   'Bonus',     bonusGroup)}
        {renderSection('reaction', 'Reações', 'Reactions', reactionGroup)}
        {renderSection('free',     'Livres',  'Free',      freeGroup)}

        {/* ── Consumíveis (Poções, etc.) ── */}
        {(() => {
          const consumables = (char.equipment ?? []).filter(
            (e) => e.type === 'consumable' && !e.activated && (e.charges ?? 1) > 0,
          );
          if (!consumables.length) return null;
          return (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🧪</Text>
                <Text style={[styles.sectionLabel, { color: '#52c47a' }]}>
                  {L('ITENS', 'ITEMS')}
                </Text>
              </View>
              {consumables.map((item) => (
                <ConsumableCard
                  key={item.id}
                  item={item}
                  language={language}
                  canUseBonus={canBonus}
                  themeColors={c}
                  onUse={async () => {
                    useBonusAction(char.id);
                    const isStatOrAttack =
                      (item.bonuses.length > 0 || item.attacks.length > 0) && !item.useEffect;
                    if (isStatOrAttack) {
                      await activateConsumable(char.id, item.id);
                      return { hpGained: 0, detail: '' };
                    }
                    return useEquipmentCharge(char.id, item.id);
                  }}
                />
              ))}
            </View>
          );
        })()}

        {/* ── Magias ── */}
        {(char.spells?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🪄</Text>
              <Text style={[styles.sectionLabel, { color: '#9c5de0' }]}>
                {language === 'en' ? 'SPELLS' : 'MAGIAS'}
              </Text>
            </View>
            <SpellsPanel
              char={char}
              language={language}
              units={units}
              themeColors={{ ...c }}
              onConsumeAction={(cost) => {
                if (cost === 'bonus') useBonusAction(char.id);
                else if (cost === 'reaction') useReaction(char.id);
                else useAction(char.id);
              }}
            />
          </View>
        )}

        {/* ── Manobras de Combate ── */}
        <TouchableOpacity
          style={styles.manobraHeader}
          onPress={() => setManobraOpen((v) => !v)}
          activeOpacity={0.8}
        >
          <Text style={[styles.sectionLabel, { color: c.accent, fontSize: 12 }]}>
            ⚔️ {L('MANOBRAS DE COMBATE', 'COMBAT MANEUVERS')}
          </Text>
          <Text style={{ color: c.subtext, fontSize: 12 }}>{manobraOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {manobraOpen && (
          <CombatManeuvers
            char={char}
            language={language}
            themeColors={{ ...c }}
            activeTraitEffects={activeTraitEffects}
            canUseAction={canAct}
            canUseBonus={canBonus}
            canUseReaction={canReact}
            onConsumeAction={(cost) => {
              if (cost === 'bonus') useBonusAction(char.id);
              else if (cost === 'reaction') useReaction(char.id);
              else useAction(char.id);
            }}
          />
        )}
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.endTurnBtn}
          onPress={() => endTurn(char.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.endTurnText}>🔄 {L('Encerrar Turno', 'End Turn')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.endCombatBtn}
          onPress={endSession}
          activeOpacity={0.8}
        >
          <Text style={styles.endCombatText}>✖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    startRow: { alignItems: 'center', paddingVertical: 12 },
    startBtn: { backgroundColor: c.accent, borderRadius: 10, paddingHorizontal: 28, paddingVertical: 12 },
    startBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

    container: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
      marginBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: c.accent + '22',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    headerTitle: { color: c.accent, fontWeight: 'bold', fontSize: 15 },
    roundBadge: { color: c.subtext, fontSize: 13, fontStyle: 'italic' },

    initiativeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 6,
      backgroundColor: c.surface,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    initiativeLabel: { color: c.subtext, fontSize: 12, flex: 1 },
    initiativeValue: { color: '#f5c542', fontWeight: 'bold', fontSize: 20 },
    initiativeDetail: { color: c.subtext, fontSize: 11 },

    body: { padding: 12 },

    resourcesCard: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      padding: 10,
      marginBottom: 12,
      backgroundColor: c.bg + 'aa',
    },

    section: { marginBottom: 4 },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
      marginTop: 4,
    },
    sectionIcon: { fontSize: 14 },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

    moveRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
    moveRight: { flex: 1 },
    moveBarBg: { height: 7, backgroundColor: '#2a2a2a', borderRadius: 4, overflow: 'hidden', marginBottom: 5 },
    moveBarFill: { height: '100%', borderRadius: 4 },
    moveFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    moveLabel: { color: '#888', fontSize: 11 },
    moveSteppers: { flexDirection: 'row', gap: 6 },
    stepBtn: {
      borderWidth: 1, borderColor: c.border,
      borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    },
    stepDisabled: { opacity: 0.3 },
    stepText: { fontSize: 11 },

    footer: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: c.border },
    endTurnBtn: {
      flex: 1,
      backgroundColor: c.accent,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    endTurnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    endCombatBtn: {
      paddingHorizontal: 16, paddingVertical: 12,
      alignItems: 'center', justifyContent: 'center',
      borderLeftWidth: 1, borderLeftColor: c.border,
    },
    endCombatText: { color: '#e07b39', fontSize: 16 },

    kiBlock: {
      backgroundColor: '#3b1f6a33',
      borderWidth: 1,
      borderColor: '#9c5de044',
      borderRadius: 10,
      padding: 10,
      marginBottom: 12,
    },
    kiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    kiTitle: { color: '#9c5de0', fontWeight: '700', fontSize: 13 },
    kiCount: { color: '#9c5de0', fontWeight: 'bold', fontSize: 13 },
    kiDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    kiDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
    kiDotFull: { borderColor: '#9c5de0', backgroundColor: '#9c5de044' },
    kiDotUsed: { borderColor: '#444', backgroundColor: '#1a1a1a' },
    kiHint: { color: c.subtext, fontSize: 11 },

    manobraHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderTopWidth: 1,
      borderTopColor: c.border,
      marginTop: 4,
    },
  });
}

