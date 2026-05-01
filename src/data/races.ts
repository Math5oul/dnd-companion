import { AbilityName } from '../types/character';

export interface RacialBonus {
  ability: AbilityName;
  value: number;
}

export interface Race {
  id: string;
  name: string;
  description: string;
  descriptionEn?: string;
  speed: number;
  bonuses: RacialBonus[];
  traits: string[];
  traitsEn?: string[];
}

export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Humano',
    description: 'Versáteis e ambiciosos, os humanos são a raça mais comum nos reinos.',
    descriptionEn: 'Versatile and ambitious, humans are the most common race in the realms.',
    speed: 30,
    bonuses: [
      { ability: 'strength', value: 1 },
      { ability: 'dexterity', value: 1 },
      { ability: 'constitution', value: 1 },
      { ability: 'intelligence', value: 1 },
      { ability: 'wisdom', value: 1 },
      { ability: 'charisma', value: 1 },
    ],
    traits: ['Idioma Extra', 'Habilidade Extra'],
    traitsEn: ['Extra Language', 'Extra Skill'],
  },
  {
    id: 'elf',
    name: 'Elfo',
    description: 'Seres mágicos de graça e elegância incomparáveis, que vivem por séculos.',
    descriptionEn: 'Magical beings of unparalleled grace and elegance who live for centuries.',
    speed: 30,
    bonuses: [{ ability: 'dexterity', value: 2 }],
    traits: ['Visão no Escuro', 'Aguçados Sentidos', 'Ancestral Feérico', 'Transe'],
    traitsEn: ['Darkvision', 'Keen Senses', 'Fey Ancestry', 'Trance'],
  },
  {
    id: 'dwarf',
    name: 'Anão',
    description: 'Robustos e resistentes, os anões são conhecidos por sua tenacidade.',
    descriptionEn: 'Robust and resilient, dwarves are known for their tenacity.',
    speed: 25,
    bonuses: [{ ability: 'constitution', value: 2 }],
    traits: ['Visão no Escuro', 'Resiliência Anã', 'Treinamento de Combate Anão', 'Especialização em Ferramentas'],
    traitsEn: ['Darkvision', 'Dwarven Resilience', 'Dwarven Combat Training', 'Tool Proficiency'],
  },
  {
    id: 'halfling',
    name: 'Halfling',
    description: 'Pequenos e alegres, com uma sorte natural que os tira dos piores apuros.',
    descriptionEn: 'Small and cheerful, with a natural luck that gets them out of the worst scrapes.',
    speed: 25,
    bonuses: [{ ability: 'dexterity', value: 2 }],
    traits: ['Sortudo', 'Bravura', 'Agilidade Halfling'],
    traitsEn: ['Lucky', 'Brave', 'Halfling Nimbleness'],
  },
  {
    id: 'gnome',
    name: 'Gnomo',
    description: 'Curiosos e inventivos, os gnomos vivem com entusiasmo e alegria.',
    descriptionEn: 'Curious and inventive, gnomes live with enthusiasm and joy.',
    speed: 25,
    bonuses: [{ ability: 'intelligence', value: 2 }],
    traits: ['Visão no Escuro', 'Astúcia Gnômica'],
    traitsEn: ['Darkvision', 'Gnome Cunning'],
  },
  {
    id: 'half-elf',
    name: 'Meio-Elfo',
    description: 'Carregam o melhor de dois mundos: a versatilidade humana e a graça élfica.',
    descriptionEn: 'They carry the best of two worlds: human versatility and elven grace.',
    speed: 30,
    bonuses: [
      { ability: 'charisma', value: 2 },
      { ability: 'strength', value: 1 },
      { ability: 'dexterity', value: 1 },
    ],
    traits: ['Visão no Escuro', 'Ancestral Feérico', 'Habilidade de Versatilidade'],
    traitsEn: ['Darkvision', 'Fey Ancestry', 'Skill Versatility'],
  },
  {
    id: 'dragonborn',
    name: 'Draconato',
    description: 'Altivos e honrados, os draconatos carregam o sangue dos dragões.',
    descriptionEn: 'Proud and honorable, dragonborn carry the blood of dragons.',
    speed: 30,
    bonuses: [
      { ability: 'strength', value: 2 },
      { ability: 'charisma', value: 1 },
    ],
    traits: ['Ancestral Dracônico', 'Sopro de Dragão', 'Resistência Elemental'],
    traitsEn: ['Draconic Ancestry', 'Breath Weapon', 'Elemental Resistance'],
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    description: 'Marcados por um pacto infernal ancestral, com poderes de origem demoníaca.',
    descriptionEn: 'Marked by an ancestral infernal pact, with powers of demonic origin.',
    speed: 30,
    bonuses: [
      { ability: 'intelligence', value: 1 },
      { ability: 'charisma', value: 2 },
    ],
    traits: ['Visão no Escuro', 'Resistência Infernal', 'Herança Infernal'],
    traitsEn: ['Darkvision', 'Hellish Resistance', 'Infernal Legacy'],
  },
];

export const getRaceById = (id: string): Race | undefined =>
  RACES.find((r) => r.id === id);

