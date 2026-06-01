import type { Character, AbilityName } from '../types/character';
import type { CombatAction, CombatModifier, ActionCost } from '../types/combatAction';
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
  // Legacy aliases kept for backward compatibility with old saved traits.
  'fighter_style_twf', 'ranger_style_twf',
  'fighter_style_two_weapon', 'ranger_style_two_weapon',
]);
const THROWN_WEAPON_IDS = new Set([
  'ranger_style_thrown_weapon',
  // Legacy/alt IDs kept for compatibility with translations and old saves.
  'fighter_style_thrown_weapon', 'ftr_style_thrown_weapon',
]);
const GWFS_IDS = new Set([
  // Legacy aliases kept for backward compatibility with old saved traits.
  'fighter_style_gwf',
  'fighter_style_great_weapon', 'paladin_style_great_weapon',
]);
const IMPROVED_DIVINE_SMITE_IDS = new Set([
  'paladin_improved_divine_smite',
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

  const skillLegacy = new Set(char.skillProficiencies ?? []);
  const typedSkills = (char.proficiencies ?? []).filter((p) => p.category === 'skill');

  const skillBonus = (skillId: string, ability: 'strength' | 'dexterity'): number => {
    const abilityScore = ability === 'strength'
      ? char.abilityScores.strength
      : char.abilityScores.dexterity;
    const abilityMod = getModifier(abilityScore);

    const typed = typedSkills.find((p) => p.id === skillId);
    if (typed?.level === 'expert') return abilityMod + prof * 2;
    if (typed?.level === 'proficient') return abilityMod + prof;
    if (skillLegacy.has(skillId)) return abilityMod + prof;
    return abilityMod;
  };

  const stealthBonus = skillBonus('stealth', 'dexterity');
  const athleticsBonus = skillBonus('athletics', 'strength');

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

  const hasThrownWeaponStyle = traits.some((t) => THROWN_WEAPON_IDS.has(t));
  if (hasThrownWeaponStyle) {
    modifiers.push({
      id: 'thrown_weapon',
      labelPt: 'Armas de Arremesso (+1 dano)',
      labelEn: 'Thrown Weapon Fighting (+1 damage)',
      damageBonus: 1,
      conditionPt: 'Ataques com arma arremessada',
      conditionEn: 'Thrown weapon attacks',
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

  const hasImprovedDivineSmite = traits.some((t) => IMPROVED_DIVINE_SMITE_IDS.has(t));
  if (hasImprovedDivineSmite) {
    modifiers.push({
      id: 'improved_divine_smite',
      labelPt: 'Golpe Divino Aprimorado (+1d8 radiante)',
      labelEn: 'Improved Divine Smite (+1d8 radiant)',
      damageExtra: '1d8',
      conditionPt: 'Ataques corpo-a-corpo com arma',
      conditionEn: 'Melee weapon attacks',
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
      if (m.id === 'thrown_weapon') return tags.includes('thrown');
      if (m.id === 'gwf') return tags.includes('melee');
      if (m.id === 'improved_divine_smite') return tags.includes('melee');
      if (m.id === 'sneak_attack') return tags.includes('melee') || tags.includes('ranged');
      return false;
    });
  }

  function isThrownAttack(item: { name: string; description?: string }, atk: { name: string; range?: string; isThrown?: boolean }): boolean {
    if (typeof atk.isThrown === 'boolean') return atk.isThrown;
    const text = `${item.name} ${item.description ?? ''} ${atk.name}`.toLowerCase();
    if (/\b(thrown|arremess)/.test(text)) return true;
    // Common shorthand in this app for melee-or-thrown attacks, e.g. "5 ft / 20-60 ft".
    return /\b5\s*ft\s*\//.test((atk.range ?? '').toLowerCase());
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
      const thrown = isThrownAttack(item, atk);
      const tags: CombatAction['tags'] = isRanged
        ? (thrown ? ['ranged', 'dex', 'thrown'] : ['ranged', 'dex'])
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
        maxCharges: isConsumable ? item.maxCharges : undefined,
      });
    }
  }

  // ─── Ações básicas utilitárias (após ataques de equipamento) ──────────────
  actions.push(
    {
      id: 'basic_hide',
      source: 'basic',
      sourceNamePt: 'Básico',
      sourceNameEn: 'Basic',
      namePt: 'Esconder',
      nameEn: 'Hide',
      descPt: 'Tente se esconder. Normalmente exige teste de Furtividade (DES).',
      descEn: 'Attempt to hide. Usually requires a Stealth (DEX) check.',
      icon: '🙈',
      actionCost: 'action',
      tags: ['dex'],
      attackBonus: stealthBonus,
      modifiers: [],
    },
    {
      id: 'basic_grapple',
      source: 'basic',
      sourceNamePt: 'Básico',
      sourceNameEn: 'Basic',
      namePt: 'Agarrar',
      nameEn: 'Grapple',
      descPt: 'Substitui um ataque: teste de Atletismo (FOR) contra Atletismo/Acrobacia do alvo.',
      descEn: 'Replaces one attack: Athletics (STR) check contested by target Athletics/Acrobatics.',
      icon: '🤼',
      actionCost: 'action',
      tags: ['melee', 'str'],
      attackBonus: athleticsBonus,
      modifiers: [],
    },
    {
      id: 'basic_shove',
      source: 'basic',
      sourceNamePt: 'Básico',
      sourceNameEn: 'Basic',
      namePt: 'Empurrar',
      nameEn: 'Shove',
      descPt: 'Substitui um ataque: derrube o alvo ou empurre 1,5m (teste contestado).',
      descEn: 'Replaces one attack: knock target prone or push 5 ft (contested check).',
      icon: '🫸',
      actionCost: 'action',
      tags: ['melee', 'str'],
      attackBonus: athleticsBonus,
      modifiers: [],
    },
    {
      id: 'basic_throw',
      source: 'basic',
      sourceNamePt: 'Básico',
      sourceNameEn: 'Basic',
      namePt: 'Arremessar',
      nameEn: 'Throw',
      descPt: 'Arremesse um objeto improvisado.',
      descEn: 'Throw an improvised object.',
      icon: '🪨',
      actionCost: 'action',
      tags: ['ranged', 'str', 'thrown'],
      attackBonus: strMod + prof,
      damage: '1d4',
      damageType: 'bludgeoning',
      range: '20/60 ft',
      modifiers: modsFor(['ranged', 'str', 'thrown']),
    },
  );

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
        actionCost: fa.activationCost ?? 'action',
        tags: [...tags, 'magical'] as CombatAction['tags'],
        damage: fa.damageDice,
        damageType: fa.damageType,
        range: fa.range,
        modifiers: [],
        featureActionId: fa.id,
        maxUses: fa.maxUses,
        useType: fa.useType,
        effectTag: fa.effectTag,
        isToggle: fa.isToggle,
        kiCost: fa.kiCost,
      });
    }
  } catch {
    // featureEffects not available in SSR / test
  }

  // ─── Magias ────────────────────────────────────────────────
  try {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const { getSpellById, getSpellDamage, SCHOOL_ICON } = require('../data/spells') as typeof import('../data/spells');
    const {
      spellAttackBonus,
      getSpellTraitBonuses,
      traitBonusesForSpell,
      applySpellTraitRange,
    } = require('./metamagic') as typeof import('./metamagic');
    /* eslint-enable @typescript-eslint/no-var-requires */

    const spellAtk = spellAttackBonus(char);
    const spellDC  = 8 + spellAtk;
    const spellTraitBonuses = getSpellTraitBonuses(char);

    /** Mapeia o texto de tempo de conjuração para ActionCost */
    const castingTimeToActionCost = (ct: string): ActionCost => {
      const s = ct.toLowerCase();
      if (s.includes('bônus') || s.includes('bonus')) return 'bonus';
      if (s.includes('reação') || s.includes('reaction')) return 'reaction';
      return 'action';
    };

    for (const spellId of char.spells ?? []) {
      const sp = getSpellById(spellId);
      if (!sp) continue;

      // Slots disponíveis para magias niveladas
      const slotEntry = sp.level > 0 ? char.spellSlots?.[sp.level] : null;
      const slotsRemaining = slotEntry ? slotEntry.total - slotEntry.used : 0;
      if (sp.level > 0 && slotsRemaining <= 0) {
        // Inclui com flag de esgotado para exibir na UI (cinza)
      }

      // Dano base (para cantrip considera escala de nível)
      const fullDmg = sp.level === 0 ? getSpellDamage(sp, char.level) : (sp.damage ?? null);
      const dmgParts = fullDmg?.match(/^([^\s]+)\s*(.*)/);
      const relevantBonuses = traitBonusesForSpell(spellTraitBonuses, sp);
      const extraDmgBonus = relevantBonuses.reduce((sum, b) => sum + b.damageBonus, 0);
      const baseDmgDice = dmgParts?.[1] ?? undefined;
      const dmgDice = baseDmgDice
        ? (extraDmgBonus ? `${baseDmgDice}+${extraDmgBonus}` : baseDmgDice)
        : undefined;
      const dmgType = dmgParts?.[2] || undefined;
      const traitRange = applySpellTraitRange(sp.range, relevantBonuses);
      const traitNotesPt = relevantBonuses.map((b) => b.notePt).filter((n): n is string => !!n);
      const traitNotesEn = relevantBonuses.map((b) => b.noteEn).filter((n): n is string => !!n);
      const descPt = traitNotesPt.length > 0
        ? `${sp.description}\n• ${traitNotesPt.join('\n• ')}`
        : sp.description;
      const descEn = traitNotesEn.length > 0
        ? `${sp.description}\n• ${traitNotesEn.join('\n• ')}`
        : sp.description;

      actions.push({
        id: `spell:${sp.id}`,
        source: 'spell',
        sourceNamePt: 'Magia',
        sourceNameEn: 'Spell',
        namePt: sp.name,
        nameEn: sp.name,
        descPt,
        descEn,
        icon: SCHOOL_ICON[sp.school] ?? '🪄',
        actionCost: castingTimeToActionCost(sp.castingTime),
        tags: ['magical'],
        attackBonus: sp.attackRoll ? spellAtk : undefined,
        damage: dmgDice,
        damageType: dmgType,
        range: traitRange,
        modifiers: [],
        spellId: sp.id,
        spellLevel: sp.level,
        spellSlotsRemaining: sp.level === 0 ? Infinity : slotsRemaining,
        isSpellAttack: sp.attackRoll,
        savingThrow: sp.savingThrow ? { ability: sp.savingThrow.ability, abilityEn: sp.savingThrow.abilityEn } : undefined,
        useType: sp.level === 0 ? 'at_will' : undefined,
      });
    }
  } catch {
    // spells / metamagic not available in SSR / test
  }

  return actions;
}
