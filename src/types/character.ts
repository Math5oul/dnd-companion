import type { Equipment, EquipmentBonus } from './equipment';

export type AbilityName = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface SpellSlots {
  [level: number]: { total: number; used: number };
}

/** Efeito temporário de item consumível (ex: poção de agilidade) */
export interface ActiveEffect {
  id: string;
  name: string;
  bonuses: EquipmentBonus[];
  expiresOn: 'long_rest' | 'short_rest';
}

export interface Character {
  id: string;
  name: string;
  race: string;
  className: string;
  level: number;
  abilityScores: AbilityScores;
  hp: number;
  maxHp: number;
  spellSlots: SpellSlots;
  spells: string[]; // spell ids conhecidos/preparados
  /** IDs de traits/features escolhidas (automáticas e de escolha) */
  traits: string[];
  /** Pontos de Feitiçaria (Sorcerer) */
  sorceryPoints?: { total: number; used: number };
  /** Dados de Vida usados (Short Rest). Reseta no Long Rest. */
  hitDiceUsed?: number;
  /** IDs das perícias em que o personagem tem proficiência */
  skillProficiencies?: string[];
  /** Lista de equipamentos do personagem */
  equipment?: Equipment[];
  /** Efeitos temporários ativos (de poções, etc) */
  activeEffects?: ActiveEffect[];
  /** Moedas de ouro do personagem */
  gold?: number;
  /** Bônus de ASI escolhidos manualmente por feature */
  asiChoices?: Record<string, Partial<Record<AbilityName, number>>>;
  /**
   * Usos restantes de ações de features (ex: Rage, Bardic Inspiration).
   * Chave = FeatureAction.id. Valor = usos restantes.
   * -1 = nunca inicializado (usa maxUses como default).
   */
  actionUses?: Record<string, number>;
  /**
   * Escolhas feitas em features com pickSkills/pickType.
   * Chave = ClassFeature.id. Valor = array de skill IDs escolhidos.
   */
  featureChoices?: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterDraft {
  name: string;
  race: string;
  className: string;
  level: number;
  abilityScores: AbilityScores;
}

export type WizardStep = 'name' | 'race' | 'class' | 'abilities' | 'review';
