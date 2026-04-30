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
