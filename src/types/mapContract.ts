import type { ActionCost } from './combatAction';

export type ContractVersion = 'v1';

export interface CharacterResourceSnapshot {
  hp: { current: number; max: number; temp: number };
  ac: number;
  speedFeet: number;
  initiativeBonus: number;
  proficiencyBonus: number;
  spellSlots: Record<number, { total: number; used: number; remaining: number }>;
  sorceryPoints?: { total: number; used: number; remaining: number };
  kiPoints?: { total: number; used: number; remaining: number };
}

export interface CharacterStatusSnapshot {
  concentrationSpellId: string | null;
  conditions: string[];
  activeToggles: string[];
  resistances: string[];
}

export interface CharacterSnapshot {
  id: string;
  name: string;
  className: string;
  level: number;
  position?: { x: number; y: number; z?: number } | null;
  resources: CharacterResourceSnapshot;
  status: CharacterStatusSnapshot;
  pendingChoicesCount: number;
}

export interface ActionResourceCost {
  kind: 'spell_slot' | 'ki_point' | 'sorcery_point' | 'feature_use' | 'charge';
  amount: number;
  ref?: string;
}

export interface ActionCatalogItem {
  id: string;
  source: 'weapon' | 'feature' | 'spell' | 'basic';
  namePt: string;
  nameEn: string;
  actionCost: ActionCost;
  tags: string[];
  range?: string;
  rangeFeet?: number;
  attackBonus?: number;
  damage?: string;
  damageType?: string;
  requiresAttackRoll: boolean;
  requiresSavingThrow: boolean;
  savingThrowAbility?: string;
  resourceCosts: ActionResourceCost[];
  available: boolean;
  unavailableReason?: string;
}

export interface TurnStateSnapshot {
  sessionId: string;
  roundNumber: number;
  characterId: string;
  isActive: boolean;
  actions: { total: number; used: number; remaining: number };
  bonusActions: { total: number; used: number; remaining: number };
  reactions: { total: number; used: number; remaining: number };
  movementFeet: { total: number; used: number; remaining: number };
  position: { x: number; y: number; z?: number };
  lastMovementTerrain?: 'normal' | 'difficult';
  initiative: { total: number; roll: number; bonus: number };
}

export interface DomainEvent {
  type: 'turn.started' | 'action.used' | 'movement.spent' | 'condition.applied';
  sessionId?: string;
  characterId: string;
  timestamp: string;
  payload?: Record<string, unknown>;
}

export interface MapContractBundle {
  version: ContractVersion;
  generatedAt: string;
  character: CharacterSnapshot;
  turn: TurnStateSnapshot | null;
  actionCatalog: ActionCatalogItem[];
}
