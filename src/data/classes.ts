export interface DnDClass {
  id: string;
  name: string;
  description: string;
  hitDie: number;
  primaryAbility: string;
  savingThrows: string[];
  spellcaster: boolean;
  spellSlotsByLevel?: Record<number, number[]>; // level -> [slots per spell level]
  /** Número de truques (cantrips) conhecidos por nível (índice 0 = nível 1) */
  knownCantrips?: number[];
  /** Número de magias conhecidas/preparadas por nível (índice 0 = nível 1) */
  knownSpells?: number[];
}

export const CLASSES: DnDClass[] = [
  {
    id: 'barbarian',
    name: 'Bárbaro',
    description: 'Guerreiro feroz que entra em frenesi de batalha alimentado por uma raiva primitiva.',
    hitDie: 12,
    primaryAbility: 'Força',
    savingThrows: ['Força', 'Constituição'],
    spellcaster: false,
  },
  {
    id: 'bard',
    name: 'Bardo',
    description: 'Artista mágico que usa música e magia para inspirar aliados e frustrar inimigos.',
    hitDie: 8,
    primaryAbility: 'Carisma',
    savingThrows: ['Destreza', 'Carisma'],
    spellcaster: true,
    spellSlotsByLevel: {
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    },
    knownCantrips: [2, 2, 2, 3, 3],
    knownSpells:   [4, 5, 6, 7, 8],
  },
  {
    id: 'cleric',
    name: 'Clérigo',
    description: 'Servo divino que empunha o poder de seu deus para curar aliados e punir inimigos.',
    hitDie: 8,
    primaryAbility: 'Sabedoria',
    savingThrows: ['Sabedoria', 'Carisma'],
    spellcaster: true,
    spellSlotsByLevel: {
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    },
    knownCantrips: [3, 3, 3, 4, 4],
    knownSpells:   [4, 5, 6, 7, 8],
  },
  {
    id: 'druid',
    name: 'Druida',
    description: 'Guardião da natureza com o poder de transformar-se em animais e conjurar magias da natureza.',
    hitDie: 8,
    primaryAbility: 'Sabedoria',
    savingThrows: ['Inteligência', 'Sabedoria'],
    spellcaster: true,
    spellSlotsByLevel: {
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    },
    knownCantrips: [2, 2, 2, 3, 3],
    knownSpells:   [4, 5, 6, 7, 8],
  },
  {
    id: 'fighter',
    name: 'Guerreiro',
    description: 'Mestre do combate com acesso ao maior número de estilos de luta e equipamentos.',
    hitDie: 10,
    primaryAbility: 'Força ou Destreza',
    savingThrows: ['Força', 'Constituição'],
    spellcaster: false,
  },
  {
    id: 'monk',
    name: 'Monge',
    description: 'Artista marcial que canaliza ki para realizar feitos sobre-humanos.',
    hitDie: 8,
    primaryAbility: 'Destreza e Sabedoria',
    savingThrows: ['Força', 'Destreza'],
    spellcaster: false,
  },
  {
    id: 'paladin',
    name: 'Paladino',
    description: 'Guerreiro sagrado que combina habilidade marcial com magia divina.',
    hitDie: 10,
    primaryAbility: 'Força e Carisma',
    savingThrows: ['Sabedoria', 'Carisma'],
    spellcaster: true,
    spellSlotsByLevel: {
      2: [2, 0, 0, 0, 0],
      3: [3, 0, 0, 0, 0],
      5: [4, 2, 0, 0, 0],
    },
    knownCantrips: [0, 0, 0, 0, 0],
    knownSpells:   [0, 2, 2, 3, 3],
  },
  {
    id: 'ranger',
    name: 'Patrulheiro',
    description: 'Explorador habilidoso com magias da natureza e um laço profundo com animais.',
    hitDie: 10,
    primaryAbility: 'Destreza e Sabedoria',
    savingThrows: ['Força', 'Destreza'],
    spellcaster: true,
    spellSlotsByLevel: {
      2: [2, 0, 0, 0, 0],
      3: [3, 0, 0, 0, 0],
      5: [4, 2, 0, 0, 0],
    },
    knownCantrips: [0, 0, 0, 0, 0],
    knownSpells:   [0, 2, 3, 3, 4],
  },
  {
    id: 'rogue',
    name: 'Ladino',
    description: 'Especialista furtivo com habilidades de arrombamento, furtividade e ataques certeiros.',
    hitDie: 8,
    primaryAbility: 'Destreza',
    savingThrows: ['Destreza', 'Inteligência'],
    spellcaster: false,
  },
  {
    id: 'sorcerer',
    name: 'Feiticeiro',
    description: 'Conjurador com magia em seu sangue, moldando feitiços com sua força inata.',
    hitDie: 6,
    primaryAbility: 'Carisma',
    savingThrows: ['Constituição', 'Carisma'],
    spellcaster: true,
    spellSlotsByLevel: {
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    },
    knownCantrips: [4, 4, 4, 5, 5],
    knownSpells:   [2, 3, 4, 5, 6],
  },
  {
    id: 'warlock',
    name: 'Bruxo',
    description: 'Conjurador que fez um pacto com uma entidade poderosa em troca de poder arcano.',
    hitDie: 8,
    primaryAbility: 'Carisma',
    savingThrows: ['Sabedoria', 'Carisma'],
    spellcaster: true,
    spellSlotsByLevel: {
      1: [1, 0, 0, 0, 0],
      2: [2, 0, 0, 0, 0],
      3: [2, 2, 0, 0, 0],
      5: [2, 2, 2, 0, 0],
    },
    knownCantrips: [2, 2, 2, 3, 3],
    knownSpells:   [2, 3, 4, 5, 6],
  },
  {
    id: 'wizard',
    name: 'Mago',
    description: 'Estudioso da magia arcana que aprende feitiços copiando-os de grimórios.',
    hitDie: 6,
    primaryAbility: 'Inteligência',
    savingThrows: ['Inteligência', 'Sabedoria'],
    spellcaster: true,
    spellSlotsByLevel: {
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    },
    knownCantrips: [3, 3, 3, 4, 4],
    knownSpells:   [6, 8, 10, 12, 14],
  },
];

export const getClassById = (id: string): DnDClass | undefined =>
  CLASSES.find((c) => c.id === id);
