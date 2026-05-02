import type { AbilityName } from './character';

export type EquipmentType = 'weapon' | 'armor' | 'shield' | 'accessory' | 'consumable' | 'other';

export type BonusType = AbilityName | 'ac' | 'initiative';

export interface EquipmentBonus {
  type: BonusType;
  value: number;
}

export interface EquipmentAttack {
  id: string;
  name: string;
  attackBonus: number;  // bonus to hit roll (e.g. +5)
  damage: string;       // dice string e.g. "1d8+3"
  damageType: string;   // e.g. "slashing"
  range: string;        // e.g. "5 ft" or "60/120 ft"
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  description: string;
  equipped: boolean;
  goldValue: number;          // cost in gold pieces
  /** How long stat bonuses / effects last (undefined = forever) */
  duration?: 'forever' | 'long_rest';
  /** For consumables: remaining uses */
  charges?: number;
  /** For consumables: max uses (for UI display) */
  maxCharges?: number;
  /** True once the consumable has been "drunk" — attacks become available */
  activated?: boolean;
  /** Auto-effect when a charge is used (consumables) */
  useEffect?: { type: 'heal' | 'temp_hp'; dice: string };
  /** Weight in lbs (D&D base unit). UI converts to kg when metric. */
  weight?: number;
  bonuses: EquipmentBonus[];  // stat bonuses when equipped
  traits: string[];            // free-text trait descriptions
  attacks: EquipmentAttack[];
}

export const EQUIPMENT_TYPE_ICONS: Record<EquipmentType, string> = {
  weapon:    '⚔️',
  armor:     '🛡️',
  shield:    '🔰',
  accessory: '💍',
  consumable:'🧪',
  other:     '📦',
};

export const EQUIPMENT_TYPE_LABELS_PT: Record<EquipmentType, string> = {
  weapon:    'Arma',
  armor:     'Armadura',
  shield:    'Escudo',
  accessory: 'Acessório',
  consumable:'Consumível',
  other:     'Outro',
};

export const EQUIPMENT_TYPE_LABELS_EN: Record<EquipmentType, string> = {
  weapon:    'Weapon',
  armor:     'Armor',
  shield:    'Shield',
  accessory: 'Accessory',
  consumable:'Consumable',
  other:     'Other',
};

export const BONUS_TYPE_LABELS: Record<BonusType, { pt: string; en: string }> = {
  strength:     { pt: 'FOR', en: 'STR' },
  dexterity:    { pt: 'DES', en: 'DEX' },
  constitution: { pt: 'CON', en: 'CON' },
  intelligence: { pt: 'INT', en: 'INT' },
  wisdom:       { pt: 'SAB', en: 'WIS' },
  charisma:     { pt: 'CAR', en: 'CHA' },
  ac:           { pt: 'CA',  en: 'AC'  },
  initiative:   { pt: 'INIC',en: 'INIT'},
};

export const ALL_BONUS_TYPES: BonusType[] = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma', 'ac', 'initiative',
];
