import { AbilityName } from '../types/character';

export interface Skill {
  id: string;
  name: string;       // PT
  nameEn: string;     // EN
  ability: AbilityName;
}

export const SKILLS: Skill[] = [
  { id: 'acrobatics',     name: 'Acrobacia',         nameEn: 'Acrobatics',     ability: 'dexterity'     },
  { id: 'animalHandling', name: 'Adestrar Animais',  nameEn: 'Animal Handling',ability: 'wisdom'        },
  { id: 'arcana',         name: 'Arcanismo',         nameEn: 'Arcana',         ability: 'intelligence'  },
  { id: 'athletics',      name: 'Atletismo',         nameEn: 'Athletics',      ability: 'strength'      },
  { id: 'deception',      name: 'Enganação',         nameEn: 'Deception',      ability: 'charisma'      },
  { id: 'history',        name: 'História',          nameEn: 'History',        ability: 'intelligence'  },
  { id: 'insight',        name: 'Intuição',          nameEn: 'Insight',        ability: 'wisdom'        },
  { id: 'intimidation',   name: 'Intimidação',       nameEn: 'Intimidation',   ability: 'charisma'      },
  { id: 'investigation',  name: 'Investigação',      nameEn: 'Investigation',  ability: 'intelligence'  },
  { id: 'medicine',       name: 'Medicina',          nameEn: 'Medicine',       ability: 'wisdom'        },
  { id: 'nature',         name: 'Natureza',          nameEn: 'Nature',         ability: 'intelligence'  },
  { id: 'perception',     name: 'Percepção',         nameEn: 'Perception',     ability: 'wisdom'        },
  { id: 'performance',    name: 'Atuação',           nameEn: 'Performance',    ability: 'charisma'      },
  { id: 'persuasion',     name: 'Persuasão',         nameEn: 'Persuasion',     ability: 'charisma'      },
  { id: 'religion',       name: 'Religião',          nameEn: 'Religion',       ability: 'intelligence'  },
  { id: 'sleightOfHand',  name: 'Prestidigitação',   nameEn: 'Sleight of Hand',ability: 'dexterity'     },
  { id: 'stealth',        name: 'Furtividade',       nameEn: 'Stealth',        ability: 'dexterity'     },
  { id: 'survival',       name: 'Sobrevivência',     nameEn: 'Survival',       ability: 'wisdom'        },
];

/** D&D 5e proficiency bonus by character level */
export function getProficiencyBonus(level: number): number {
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  return 6;
}

/** Skills available per class (ids) — empty means all skills (Bard) */
export const CLASS_SKILL_OPTIONS: Record<string, string[]> = {
  barbarian: ['athletics', 'animalHandling', 'intimidation', 'nature', 'perception', 'survival'],
  bard:      [], // all
  cleric:    ['history', 'insight', 'medicine', 'persuasion', 'religion'],
  druid:     ['arcana', 'animalHandling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
  fighter:   ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
  monk:      ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
  paladin:   ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
  ranger:    ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
  rogue:     ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'],
  sorcerer:  ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
  warlock:   ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
  wizard:    ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
};

/** Number of skill proficiencies to choose per class */
export const CLASS_SKILL_COUNT: Record<string, number> = {
  barbarian: 2,
  bard:      3,
  cleric:    2,
  druid:     2,
  fighter:   2,
  monk:      2,
  paladin:   2,
  ranger:    3,
  rogue:     4,
  sorcerer:  2,
  warlock:   2,
  wizard:    2,
};
