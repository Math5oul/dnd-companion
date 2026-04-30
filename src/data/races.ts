import { AbilityName } from '../types/character';

export interface RacialBonus {
  ability: AbilityName;
  value: number;
}

export interface Race {
  id: string;
  name: string;
  description: string;
  speed: number;
  bonuses: RacialBonus[];
  traits: string[];
}

export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Humano',
    description: 'Versáteis e ambiciosos, os humanos são a raça mais comum nos reinos.',
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
  },
  {
    id: 'elf',
    name: 'Elfo',
    description: 'Seres mágicos de graça e elegância incomparáveis, que vivem por séculos.',
    speed: 30,
    bonuses: [{ ability: 'dexterity', value: 2 }],
    traits: ['Visão no Escuro', 'Aguçados Sentidos', 'Ancestral Feérico', 'Transe'],
  },
  {
    id: 'dwarf',
    name: 'Anão',
    description: 'Robustos e resistentes, os anões são conhecidos por sua tenacidade.',
    speed: 25,
    bonuses: [{ ability: 'constitution', value: 2 }],
    traits: ['Visão no Escuro', 'Resiliência Anã', 'Treinamento de Combate Anão', 'Especialização em Ferramentas'],
  },
  {
    id: 'halfling',
    name: 'Halfling',
    description: 'Pequenos e alegres, com uma sorte natural que os tira dos piores apuros.',
    speed: 25,
    bonuses: [{ ability: 'dexterity', value: 2 }],
    traits: ['Sortudo', 'Bravura', 'Agilidade Halfling'],
  },
  {
    id: 'gnome',
    name: 'Gnomo',
    description: 'Curiosos e inventivos, os gnomos vivem com entusiasmo e alegria.',
    speed: 25,
    bonuses: [{ ability: 'intelligence', value: 2 }],
    traits: ['Visão no Escuro', 'Astúcia Gnômica'],
  },
  {
    id: 'half-elf',
    name: 'Meio-Elfo',
    description: 'Carregam o melhor de dois mundos: a versatilidade humana e a graça élfica.',
    speed: 30,
    bonuses: [
      { ability: 'charisma', value: 2 },
      { ability: 'strength', value: 1 },
      { ability: 'dexterity', value: 1 },
    ],
    traits: ['Visão no Escuro', 'Ancestral Feérico', 'Habilidade de Versatilidade'],
  },
  {
    id: 'dragonborn',
    name: 'Draconato',
    description: 'Altivos e honrados, os draconatos carregam o sangue dos dragões.',
    speed: 30,
    bonuses: [
      { ability: 'strength', value: 2 },
      { ability: 'charisma', value: 1 },
    ],
    traits: ['Ancestral Dracônico', 'Sopro de Dragão', 'Resistência Elemental'],
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    description: 'Marcados por um pacto infernal ancestral, com poderes de origem demoníaca.',
    speed: 30,
    bonuses: [
      { ability: 'intelligence', value: 1 },
      { ability: 'charisma', value: 2 },
    ],
    traits: ['Visão no Escuro', 'Resistência Infernal', 'Herança Infernal'],
  },
];

export const getRaceById = (id: string): Race | undefined =>
  RACES.find((r) => r.id === id);
