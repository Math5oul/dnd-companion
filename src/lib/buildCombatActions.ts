import type { Character, AbilityName } from '../types/character';
import type { CombatAction, CombatModifier } from '../types/combatAction';
import { getModifier } from './dice';
import { getProficiencyBonus } from '../data/skills';

// ─── Trait IDs que concedem modificadores de combate ──────────────────────────

const ARCHERY_IDS = new Set([
  'fighter_style_archery', 'ranger_style_archery',
]);
const DUELING_IDS = new Set([
  'fighter_style_dueling', 'paladin_style_dueling', 'ranger_style_dueling',
]);
const TWF_IDS = new Set([
  'fighter_style_twf', 'ranger_style_twf',
]);
const GWFS_IDS = new Set([
  'fighter_style_gwf',
]);

/** Retorna o bônus de dano de Fúria pelo nível */
function rageDamageBonus(level: number): number {
  if (level >= 16) return 4;
  if (level >= 9) return 3;
  return 2;
}

/** Detecta o maior dado de Ataque Furtivo disponível nos traits do personagem */
function sneakAttackDice(traits: string[]): string | null {
  let max = 0;
  for (const t of traits) {
    const m = t.match(/rogue_sneak_attack_(\d+)d6/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max > 0 ? `${max}d6` : null;
}

/**
 * Constrói a lista completa de CombatActions de um personagem,
 * agregando armas equipadas, ações de traits e ataques básicos.
 */
export function buildCombatActions(char: Character): CombatAction[] {
  const actions: CombatAction[] = [];
  const traits = char.traits ?? [];
  const prof = getProficiencyBonus(char.level);

  // ─── Detectar modificadores de traits ────────────────────────
  const modifiers: CombatModifier[] = [];

  if (traits.includes('barbarian_reckless_attack')) {
    modifiers.push({
      id: 'reckless_attack',
      labelPt: 'Ataque Imprudente',
      labelEn: 'Reckless Attack',
      forceAdv: true,
      conditionPt: 'Ataques corpo-a-corpo com Força',
      conditionEn: 'Melee Strength attacks',
    });
  }

  const hasRage = traits.some((t) => t.startsWith('barbarian_rage') || t === 'barbarian_rage');
  if (hasRage) {
    modifiers.push({
      id: 'rage_damage',
      labelPt: `Fúria (+${rageDamageBonus(char.level)} dano)`,
      labelEn: `Rage (+${rageDamageBonus(char.level)} damage)`,
      damageBonus: rageDamageBonus(char.level),
      conditionPt: 'Apenas armas corpo-a-corpo com Força',
      conditionEn: 'Melee Strength weapons only',
    });
  }

  const hasArchery = traits.some((t) => ARCHERY_IDS.has(t));
  if (hasArchery) {
    modifiers.push({
      id: 'archery',
      labelPt: 'Arqueirismo (+2 ataque)',
      labelEn: 'Archery (+2 to hit)',
      attackBonus: 2,
      conditionPt: 'Armas à distância',
      conditionEn: 'Ranged weapons',
    });
  }

  const hasDueling = traits.some((t) => DUELING_IDS.has(t));
  if (hasDueling) {
    modifiers.push({
      id: 'dueling',
      labelPt: 'Duelo (+2 dano)',
      labelEn: 'Dueling (+2 damage)',
      damageBonus: 2,
      conditionPt: 'Arma corpo-a-corpo em uma mão',
      conditionEn: 'One-handed melee weapon',
    });
  }

  const hasTWF = traits.some((t) => TWF_IDS.has(t));
  if (hasTWF) {
    modifiers.push({
      id: 'twf',
      labelPt: 'Luta c/ Duas Armas (mod. no off-hand)',
      labelEn: 'Two-Weapon Fighting (mod on off-hand)',
      conditionPt: 'Ataque de bônus com segunda arma',
      conditionEn: 'Bonus action off-hand attack',
    });
  }

  const hasGWF = traits.some((t) => GWFS_IDS.has(t));
  if (hasGWF) {
    modifiers.push({
      id: 'gwf',
      labelPt: 'Grande Arma (relança 1-2)',
      labelEn: 'Great Weapon Fighting (reroll 1-2)',
      conditionPt: 'Armas de duas mãos',
      conditionEn: 'Two-handed weapons',
    });
  }

  const sneakDice = sneakAttackDice(traits);
  if (sneakDice) {
    modifiers.push({
      id: 'sneak_attack',
      labelPt: `Ataque Furtivo (+${sneakDice})`,
      labelEn: `Sneak Attack (+${sneakDice})`,
      damageExtra: sneakDice,
      conditionPt: 'Vantagem ou aliado adjacente, 1× por turno',
      conditionEn: 'Advantage or adjacent ally, 1× per turn',
    });
  }

  // ─── Helpers para filtrar modifiers por tag ───────────────────
  function modsFor(tags: CombatAction['tags']): CombatModifier[] {
    return modifiers.filter((m) => {
      if (m.id === 'reckless_attack') return tags.includes('melee') && tags.includes('str');
      if (m.id === 'rage_damage') return tags.includes('melee') && tags.includes('str');
      if (m.id === 'archery') return tags.includes('ranged');
      if (m.id === 'dueling') return tags.includes('melee');
      if (m.id === 'twf') return tags.includes('melee');
      if (m.id === 'gwf') return tags.includes('melee');
      if (m.id === 'sneak_attack') return tags.includes('melee') || tags.includes('ranged');
      return false;
    });
  }

  // ─── Ataque desarmado básico ──────────────────────────────────
  const strMod = getModifier(char.abilityScores.strength);
  actions.push({
    id: 'basic_unarmed',
    source: 'basic',
    sourceNamePt: 'Básico',
    sourceNameEn: 'Basic',
    namePt: 'Ataque Desarmado',
    nameEn: 'Unarmed Strike',
    descPt: `Soco, pontapé ou golpe de cabeça. Dano: 1 + mod. Força.`,
    descEn: `Punch, kick, or headbutt. Damage: 1 + Str modifier.`,
    icon: '👊',
    actionCost: 'action',
    tags: ['melee', 'str'],
    attackBonus: strMod + prof,
    damage: `1+${strMod}`,
    damageType: 'bludgeoning',
    range: '5 ft',
    modifiers: modsFor(['melee', 'str']),
  });

  // ─── Ataques de armas equipadas + consumíveis ativados ───────
  const weaponItems = (char.equipment ?? []).filter((e) => {
    if (!e.attacks || e.attacks.length === 0) return false;
    if (e.type === 'consumable') {
      // Só mostra se foi bebida/ativada E ainda tem cargas
      return e.activated === true && (e.charges ?? 0) > 0;
    }
    return e.equipped;
  });

  for (const item of weaponItems) {
    const isConsumable = item.type === 'consumable';
    for (const atk of item.attacks) {
      const isRanged = atk.range ? atk.range.includes('/') || Number(atk.range) > 10 : false;
      const tags: CombatAction['tags'] = isRanged
        ? ['ranged', 'dex']
        : ['melee', 'str'];

      actions.push({
        id: `${item.id}:${atk.id}`,
        source: 'weapon',
        sourceNamePt: item.name,
        sourceNameEn: item.name,
        namePt: atk.name,
        nameEn: atk.name,
        descPt: item.description || '',
        descEn: item.description || '',
        icon: isConsumable ? '🧪' : '⚔️',
        actionCost: 'action',
        tags,
        attackBonus: atk.attackBonus,
        damage: atk.damage,
        damageType: atk.damageType,
        range: atk.range,
        modifiers: isConsumable ? [] : modsFor(tags),
        equipmentId: item.id,
        attackId: atk.id,
        consumeCharge: isConsumable,
        charges: isConsumable ? (item.charges ?? 0) : undefined,
      });
    }
  }

  // ─── Ações de traits (via featureEffects) ─────────────────────
  // Import dinâmico sincronizado: usamos require para manter a função síncrona
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getActiveFeatureActions } = require('../data/featureEffects') as {
      getActiveFeatureActions: (traits: string[]) => import('../types/featureEffect').FeatureAction[];
    };
    const featureActions = getActiveFeatureActions(traits);
    for (const fa of featureActions) {
      const isRanged = fa.range ? fa.range.includes('/') : false;
      const tags: CombatAction['tags'] = fa.damageDice
        ? isRanged ? ['ranged'] : ['melee']
        : [];

      actions.push({
        id: `feature:${fa.id}`,
        source: 'feature',
        sourceNamePt: 'Trait',
        sourceNameEn: 'Trait',
        namePt: fa.namePt,
        nameEn: fa.nameEn,
        descPt: fa.descPt,
        descEn: fa.descEn,
        icon: '⚡',
        actionCost: fa.useType === 'at_will' ? 'action' : 'action',
        tags: [...tags, 'magical'] as CombatAction['tags'],
        damage: fa.damageDice,
        damageType: fa.damageType,
        range: fa.range,
        modifiers: [],
        featureActionId: fa.id,
        maxUses: fa.maxUses,
        useType: fa.useType,
      });
    }
  } catch {
    // featureEffects not available in SSR / test
  }

  return actions;
}
