import type { Character } from '../types/character';
import type { TurnState } from '../types/turnState';
import { getModifier } from './dice';
import { getProficiencyBonus } from '../data/skills';
import { computeCharacterStats } from './characterStats';
import { buildCombatActions } from './buildCombatActions';
import { detectPendingChoices } from './pendingChoices';
import type {
  ActionCatalogItem,
  ActionResourceCost,
  CharacterSnapshot,
  MapContractBundle,
  TurnStateSnapshot,
} from '../types/mapContract';

function parseRangeFeet(range?: string): number | undefined {
  if (!range) return undefined;
  const normalized = range.toLowerCase();
  const pair = normalized.match(/(\d+)\s*\/\s*(\d+)/);
  if (pair) return Number(pair[2]);
  const feet = normalized.match(/(\d+)\s*(ft|feet|p[eé]s)/);
  if (feet) return Number(feet[1]);
  const onlyNumber = normalized.match(/^(\d+)$/);
  if (onlyNumber) return Number(onlyNumber[1]);
  if (normalized.includes('touch') || normalized.includes('toque')) return 5;
  return undefined;
}

function toResourceCosts(char: Character, action: ReturnType<typeof buildCombatActions>[number]): ActionResourceCost[] {
  const costs: ActionResourceCost[] = [];

  if (action.spellId && (action.spellLevel ?? 0) > 0) {
    costs.push({ kind: 'spell_slot', amount: action.spellLevel ?? 0, ref: String(action.spellLevel) });
  }
  if (action.kiCost && action.kiCost > 0) {
    costs.push({ kind: 'ki_point', amount: action.kiCost });
  }
  if (action.featureActionId && action.maxUses && action.maxUses > 0) {
    costs.push({ kind: 'feature_use', amount: 1, ref: action.featureActionId });
  }
  if (action.consumeCharge) {
    costs.push({ kind: 'charge', amount: 1, ref: action.equipmentId });
  }
  if (action.availableMetamagic && action.availableMetamagic.length > 0 && char.className === 'sorcerer') {
    // This is optional cost envelope info: actual cost depends on selected metamagic at cast time.
    costs.push({ kind: 'sorcery_point', amount: 1, ref: 'metamagic_optional' });
  }

  return costs;
}

function toActionCatalog(char: Character): ActionCatalogItem[] {
  const actions = buildCombatActions(char);

  return actions.map((action) => {
    const charges = action.charges ?? 0;
    const slotsRemaining = action.spellSlotsRemaining ?? 0;

    let available = true;
    let unavailableReason: string | undefined;

    if (action.consumeCharge && charges <= 0) {
      available = false;
      unavailableReason = 'no_charges';
    } else if ((action.spellLevel ?? 0) > 0 && slotsRemaining <= 0) {
      available = false;
      unavailableReason = 'no_spell_slot';
    }

    return {
      id: action.id,
      source: action.source,
      namePt: action.namePt,
      nameEn: action.nameEn,
      actionCost: action.actionCost,
      tags: action.tags,
      range: action.range,
      rangeFeet: parseRangeFeet(action.range),
      attackBonus: action.attackBonus,
      damage: action.damage,
      damageType: action.damageType,
      requiresAttackRoll: !!action.attackBonus,
      requiresSavingThrow: !!action.savingThrow,
      savingThrowAbility: action.savingThrow?.ability,
      resourceCosts: toResourceCosts(char, action),
      available,
      unavailableReason,
    };
  });
}

export function buildCharacterSnapshot(char: Character, turn?: TurnState | null): CharacterSnapshot {
  const effective = computeCharacterStats(char);
  const spellSlots = Object.fromEntries(
    Object.entries(char.spellSlots ?? {}).map(([level, data]) => [
      Number(level),
      { total: data.total, used: data.used, remaining: Math.max(0, data.total - data.used) },
    ]),
  );

  return {
    id: char.id,
    name: char.name,
    className: char.className,
    level: char.level,
    position: turn?.position ?? char.position ?? null,
    resources: {
      hp: {
        current: char.hp,
        max: char.maxHp,
        temp: char.tempHp ?? 0,
      },
      ac: 10 + getModifier(char.abilityScores.dexterity),
      speedFeet: effective.speed,
      initiativeBonus: getModifier(char.abilityScores.dexterity),
      proficiencyBonus: getProficiencyBonus(char.level),
      spellSlots,
      sorceryPoints: char.sorceryPoints
        ? {
            total: char.sorceryPoints.total,
            used: char.sorceryPoints.used,
            remaining: Math.max(0, char.sorceryPoints.total - char.sorceryPoints.used),
          }
        : undefined,
      kiPoints: char.kiPoints
        ? {
            total: char.kiPoints.total,
            used: char.kiPoints.used,
            remaining: Math.max(0, char.kiPoints.total - char.kiPoints.used),
          }
        : undefined,
    },
    status: {
      concentrationSpellId: char.concentrationSpellId ?? null,
      conditions: char.conditions ?? [],
      activeToggles: char.activeToggles ?? [],
      resistances: [...effective.resistances],
    },
    pendingChoicesCount: detectPendingChoices({
      className: char.className,
      level: char.level,
      traits: char.traits,
      featureChoices: char.featureChoices,
      asiChoices: char.asiChoices,
    }).length,
  };
}

export function buildTurnStateSnapshot(turn: TurnState | null | undefined): TurnStateSnapshot | null {
  if (!turn) return null;

  return {
    sessionId: turn.sessionId,
    roundNumber: turn.roundNumber,
    characterId: turn.characterId,
    isActive: turn.isActive,
    actions: {
      total: turn.actionsTotal,
      used: turn.actionsUsed,
      remaining: Math.max(0, turn.actionsTotal - turn.actionsUsed),
    },
    bonusActions: {
      total: turn.bonusActionsTotal,
      used: turn.bonusActionsUsed,
      remaining: Math.max(0, turn.bonusActionsTotal - turn.bonusActionsUsed),
    },
    reactions: {
      total: turn.reactionsTotal,
      used: turn.reactionsUsed,
      remaining: Math.max(0, turn.reactionsTotal - turn.reactionsUsed),
    },
    movementFeet: {
      total: turn.movementTotal,
      used: turn.movementUsed,
      remaining: Math.max(0, turn.movementTotal - turn.movementUsed),
    },
    position: turn.position,
    lastMovementTerrain: turn.lastMovementTerrain,
    initiative: {
      total: turn.initiative,
      roll: turn.initiativeRoll,
      bonus: turn.initiativeBonus,
    },
  };
}

export function buildMapContractBundle(char: Character, turn?: TurnState | null): MapContractBundle {
  return {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    character: buildCharacterSnapshot(char, turn),
    turn: buildTurnStateSnapshot(turn),
    actionCatalog: toActionCatalog(char),
  };
}
