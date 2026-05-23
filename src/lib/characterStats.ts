import { getRaceById } from '../data/races';
import { FEATURE_EFFECTS } from '../data/featureEffects';
import type { Character } from '../types/character';
import type { DamageType } from '../types/featureEffect';

export interface EffectiveStats {
  /** Velocidade efetiva em pés (base da raça + bônus de features + efeitos ativos) */
  speed: number;
  /** Velocidade base da raça antes de qualquer modificador */
  baseSpeed: number;
  /** Resistências a tipos de dano (de features e raça) */
  resistances: Set<DamageType>;
  /** Imunidades a condições (ex: 'frightened', 'charmed') */
  conditionImmunities: Set<string>;
}

/**
 * Computa os status efetivos de um personagem, agregando:
 * - Velocidade base da raça (ou do campo speed do personagem)
 * - Bônus de velocidade de features (Fast Movement, Unarmored Movement)
 * - Bônus de velocidade de efeitos ativos (poções, etc.)
 * - Resistências de features passivas e de toggles ativos (Rage)
 * - Resistências raciais (Tiefling = fogo)
 * - Imunidades de condições
 *
 * Regra para toggle features (isToggle = true):
 *   Os efeitos (resistências, etc.) só se aplicam enquanto o toggle estiver
 *   presente em char.activeToggles.
 *
 * Regra para speedRequiresUnarmored:
 *   O speedBonus só se aplica quando nenhuma peça de armadura (type === 'armor')
 *   está equipada.
 */
export function computeCharacterStats(char: Character): EffectiveStats {
  const race = getRaceById(char.race);
  const baseSpeed = char.speed ?? race?.speed ?? 30;

  // Detectar se o personagem tem armadura equipada
  const hasArmor = (char.equipment ?? []).some(
    (e) => e.equipped && e.type === 'armor',
  );

  // Conjunto de toggles ativos (ex: 'rage', 'ki_step')
  const activeToggles = new Set(char.activeToggles ?? []);

  let speedBonus = 0;
  const resistances = new Set<DamageType>();
  const conditionImmunities = new Set<string>();

  // ── Features de classe ────────────────────────────────────────────────────
  for (const traitId of char.traits ?? []) {
    const fx = FEATURE_EFFECTS[traitId];
    if (!fx) continue;

    // Se a feature tem uma ação toggle, seus efeitos condicionais (resistências,
    // etc.) só se aplicam enquanto o toggle estiver ativo.
    // O toggle é identificado pelo effectTag (usado pelo CombatPanel) ou pelo id.
    const toggleAction = fx.actions?.find((a) => a.isToggle);
    const toggleKey = toggleAction ? (toggleAction.effectTag ?? toggleAction.id) : undefined;
    const isToggleActive = !toggleKey || activeToggles.has(toggleKey);

    // Velocidade — sempre aplica se não houver restrição de armadura
    if (fx.speedBonus) {
      const appliesToArmored = !fx.speedRequiresUnarmored || !hasArmor;
      if (appliesToArmored) speedBonus += fx.speedBonus;
    }

    // Resistências e imunidades só se o toggle estiver ativo (ou não existir)
    if (isToggleActive) {
      fx.resistances?.forEach((r) => resistances.add(r));
      fx.conditionImmunities?.forEach((c) => conditionImmunities.add(c));
    }
  }

  // ── Resistências raciais ──────────────────────────────────────────────────
  if (char.race === 'tiefling') {
    resistances.add('fire');
  }
  // Nota: Dragonborn tem resistência variável por ancestral dracônico.
  // Implementar quando o campo de ancestral for adicionado ao personagem.

  // ── Bônus de velocidade de efeitos ativos (poções, etc.) ─────────────────
  for (const effect of char.activeEffects ?? []) {
    for (const bonus of effect.bonuses) {
      if (bonus.type === 'speed') speedBonus += bonus.value;
    }
  }

  // ── Bônus de velocidade de equipamentos equipados ─────────────────────────
  for (const item of char.equipment ?? []) {
    if (!item.equipped) continue;
    for (const bonus of item.bonuses) {
      if (bonus.type === 'speed') speedBonus += bonus.value;
    }
  }

  return {
    speed: baseSpeed + speedBonus,
    baseSpeed,
    resistances,
    conditionImmunities,
  };
}
