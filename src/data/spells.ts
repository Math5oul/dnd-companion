export type SpellSchool =
  | 'Abjuração'
  | 'Conjuração'
  | 'Adivinhação'
  | 'Encantamento'
  | 'Evocação'
  | 'Ilusão'
  | 'Necromancia'
  | 'Transmutação';

export const SCHOOL_ICON: Record<SpellSchool, string> = {
  'Abjuração': '🛡️',
  'Conjuração': '🌀',
  'Adivinhação': '🔮',
  'Encantamento': '💫',
  'Evocação': '⚡',
  'Ilusão': '👁️',
  'Necromancia': '💀',
  'Transmutação': '⚗️',
};

export const SCHOOL_COLOR: Record<SpellSchool, string> = {
  'Abjuração': '#4080ff',
  'Conjuração': '#20c0a0',
  'Adivinhação': '#a060ff',
  'Encantamento': '#ff60b0',
  'Evocação': '#ff8020',
  'Ilusão': '#90a0b0',
  'Necromancia': '#40c060',
  'Transmutação': '#c0a020',
};

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: SpellSchool;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  damage?: string; // e.g. '1d10 fogo', '8d6', '+1d6 necrótico'
  cantripScale?: boolean; // dobra os dados em níveis 5, 11, 17
  upcastDice?: string;   // dados extras POR nível de slot acima do mínimo, e.g. '1d6'
  classes: string[]; // class ids
}

export const SPELLS: Spell[] = [
  // ─── CANTRIPS ───────────────────────────────────────────
  {
    id: 'fire-bolt', name: 'Raio de Fogo', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Instantânea',
    description: 'Lança um raio de fogo. Causa 1d10 de dano de fogo. Aumenta em 1d10 nos níveis 5, 11 e 17.',
    damage: '1d10 fogo', cantripScale: true,
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'ray-of-frost', name: 'Raio de Gelo', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Raio azul-branco. Causa 1d8 de dano frio e reduz a velocidade do alvo em 3m até seu próximo turno.',
    damage: '1d8 frio', cantripScale: true,
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'eldritch-blast', name: 'Explosão Mística', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Instantânea',
    description: 'Feixe crepitante de energia sinistra. Causa 1d10 de dano de força. Ganha feixes extras nos níveis 5, 11 e 17.',
    damage: '1d10 força', cantripScale: true,
    classes: ['warlock'],
  },
  {
    id: 'sacred-flame', name: 'Chama Sagrada', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Chama de luz divina cai sobre o alvo. CD de Destreza ou 1d8 de dano radiante. Ignora cobertura.',
    damage: '1d8 radiante', cantripScale: true,
    classes: ['cleric'],
  },
  {
    id: 'vicious-mockery', name: 'Zombaria Viciosa', level: 0, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Insultos mágicos. CD de Sabedoria ou 1d4 de dano psíquico e desvantagem no próximo ataque.',
    damage: '1d4 psíquico', cantripScale: true,
    classes: ['bard'],
  },
  {
    id: 'shillelagh', name: 'Shillelagh', level: 0, school: 'Transmutação',
    castingTime: '1 ação bônus', range: 'Toque', duration: '1 minuto',
    description: 'Madeira de um cajado ou porrete se torna mágica. Use Sabedoria para ataques e cause 1d8 de dano.',
    classes: ['druid'],
  },
  {
    id: 'guidance', name: 'Orientação', level: 0, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 minuto',
    description: 'Toque em uma criatura voluntária. Ela pode rolar 1d4 e adicionar ao resultado de uma jogada de habilidade.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'mage-hand', name: 'Mão do Mago', level: 0, school: 'Conjuração',
    castingTime: '1 ação', range: '9m', duration: '1 minuto',
    description: 'Mão espectral flutuante que pode manipular objetos, abrir portas, pegar itens e muito mais.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'minor-illusion', name: 'Ilusão Menor', level: 0, school: 'Ilusão',
    castingTime: '1 ação', range: '9m', duration: '1 minuto',
    description: 'Cria um som ou imagem de um objeto. Investigação contra sua CD de magia revela a ilusão.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'prestidigitation', name: 'Prestidigitação', level: 0, school: 'Transmutação',
    castingTime: '1 ação', range: '3m', duration: 'Até 1 hora',
    description: 'Efeitos mágicos menores: acender velas, limpar objetos, criar marcas, gerar cheiros, etc.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'chill-touch', name: 'Toque Gelado', level: 0, school: 'Necromancia',
    castingTime: '1 ação', range: '36m', duration: '1 rodada',
    description: 'Mão esquelética fantasmagórica. Causa 1d8 de dano necrótico e impede cura até o início do seu próximo turno.',
    damage: '1d8 necrótico', cantripScale: true,
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'thaumaturgy', name: 'Taumaturgia', level: 0, school: 'Transmutação',
    castingTime: '1 ação', range: '9m', duration: 'Até 1 minuto',
    description: 'Manifesta um prodígio menor: voz retumbante, chamas tremulam, tremores no chão, olhos brilham.',
    classes: ['cleric'],
  },
  {
    id: 'poison-spray', name: 'Jato de Veneno', level: 0, school: 'Conjuração',
    castingTime: '1 ação', range: '3m', duration: 'Instantânea',
    description: 'Projeta nuvem de gás venenoso. CD de Constituição ou 1d12 de dano de veneno.',
    damage: '1d12 veneno', cantripScale: true,
    classes: ['wizard', 'sorcerer', 'druid', 'warlock'],
  },
  {
    id: 'toll-the-dead', name: 'Toque da Morte', level: 0, school: 'Necromancia',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Sino fúnebre ressoa. CD de Sabedoria ou 1d8 de dano necrótico (1d12 se ferido).',
    damage: '1d8 necrótico', cantripScale: true,
    classes: ['wizard', 'cleric', 'warlock'],
  },
  {
    id: 'thunderclap', name: 'Estrondo', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '1,5m', duration: 'Instantânea',
    description: 'Som de trovão audível a 100m. CD de Constituição ou 1d6 de dano trovejante em todas as criaturas adjacentes.',
    damage: '1d6 trovejante', cantripScale: true,
    classes: ['wizard', 'sorcerer', 'druid', 'bard', 'warlock'],
  },

  // ─── NÍVEL 1 ────────────────────────────────────────────
  {
    id: 'magic-missile', name: 'Míssil Mágico', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Instantânea',
    description: '3 dardos de força mágica que sempre acertam. Cada dardo causa 1d4+1 de dano. +1 dardo por slot maior.',
    damage: '3d4+3',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'burning-hands', name: 'Mãos Flamejantes', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: '4,5m (cone)', duration: 'Instantânea',
    description: 'Cone de fogo de 4,5m. CD de Destreza ou 3d6 de dano de fogo (+1d6 por slot maior).',
    damage: '3d6 fogo', upcastDice: '1d6',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'cure-wounds', name: 'Curar Ferimentos', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Recupera 1d8 + mod. de conjuração de HP. +1d8 por slot maior.',
    classes: ['cleric', 'druid', 'bard', 'paladin', 'ranger'],
  },
  {
    id: 'healing-word', name: 'Palavra de Cura', level: 1, school: 'Evocação',
    castingTime: '1 ação bônus', range: '18m', duration: 'Instantânea',
    description: 'Recupera 1d4 + mod. de conjuração de HP a distância. +1d4 por slot maior.',
    classes: ['cleric', 'druid', 'bard'],
  },
  {
    id: 'shield', name: 'Escudo', level: 1, school: 'Abjuração',
    castingTime: '1 reação', range: 'Pessoal', duration: '1 rodada',
    description: 'Barreira invisível de força mágica. +5 CA até o início do próximo turno, incluindo contra o ataque que ativou.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'thunderwave', name: 'Onda de Trovão', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: '1,5m (cubo de 4,5m)', duration: 'Instantânea',
    description: 'Onda de força trovejante. CD de Constituição: 2d8 de dano trovejante e empurrado 3m (metade no sucesso).',
    damage: '2d8 trovejante', upcastDice: '1d8',
    classes: ['wizard', 'sorcerer', 'druid', 'bard'],
  },
  {
    id: 'charm-person', name: 'Enfeitiçar Pessoa', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: '1 hora',
    description: 'CD de Sabedoria ou o alvo é enfeitiçado. Você é amigo dele. Termina se você ou seus aliados o prejudicarem.',
    classes: ['wizard', 'sorcerer', 'druid', 'bard', 'warlock'],
  },
  {
    id: 'sleep', name: 'Sono', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '27m', duration: '1 minuto',
    description: 'Rola 5d8. Criaturas com HP até esse total adormecem (as mais fracas primeiro). +2d8 por slot maior.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'detect-magic', name: 'Detectar Magia', level: 1, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Pessoal (raio 9m)', duration: 'Concentração, 10 minutos',
    description: 'Percebe magia em 9m. Pode usar ação para ver aura ao redor de criaturas ou objetos mágicos.',
    classes: ['wizard', 'sorcerer', 'cleric', 'druid', 'bard', 'paladin', 'ranger'],
  },
  {
    id: 'mage-armor', name: 'Armadura do Mago', level: 1, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: '8 horas',
    description: 'CA da criatura torna-se 13 + mod. de Destreza enquanto não usar armadura. Dura 8 horas.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'bless', name: 'Abençoar', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: 'Até 3 criaturas rolam 1d4 adicional em ataques e testes de resistência. +1 alvo por slot maior.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'command', name: 'Comando', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: '1 rodada',
    description: 'CD de Sabedoria ou o alvo obedece a uma palavra de comando (fugir, rastejar, largar, parar, aproximar).',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'hex', name: 'Maldição', level: 1, school: 'Encantamento',
    castingTime: '1 ação bônus', range: '27m', duration: 'Concentração, 1 hora',
    description: '+1d6 de dano necrótico nos seus ataques contra o alvo. Escolha um atributo: desvantagem nos testes dele.',
    damage: '+1d6 necrótico',
    classes: ['warlock'],
  },
  {
    id: 'hunters-mark', name: 'Marca do Caçador', level: 1, school: 'Adivinhação',
    castingTime: '1 ação bônus', range: '27m', duration: 'Concentração, 1 hora',
    description: 'Marca um alvo. +1d6 de dano nos seus ataques contra ele. Vantagem em Percepção e Sobrevivência para rastreá-lo.',
    damage: '+1d6',
    classes: ['ranger'],
  },
  {
    id: 'entangle', name: 'Entrelaçar', level: 1, school: 'Conjuração',
    castingTime: '1 ação', range: '27m', duration: 'Concentração, 1 minuto',
    description: 'Plantas emaranham criaturas em área de 6m. CD de Força ou fica imobilizado. Terreno difícil na área.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'faerie-fire', name: 'Fogo das Fadas', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'CD de Destreza ou criaturas brilham com luz azul, verde ou violeta. Ataques contra elas têm vantagem.',
    classes: ['druid', 'bard'],
  },
  {
    id: 'inflict-wounds', name: 'Infligir Ferimentos', level: 1, school: 'Necromancia',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Ataque de toque. Causa 3d10 de dano necrótico (+1d10 por slot maior).',
    damage: '3d10 necrótico', upcastDice: '1d10',
    classes: ['cleric'],
  },
  {
    id: 'divine-smite', name: 'Golpe Divino', level: 1, school: 'Evocação',
    castingTime: '1 ação bônus', range: 'Pessoal', duration: 'Instantânea',
    description: 'Ao acertar com arma corpo a corpo, cause 2d8 de dano radiante extra (+1d8 por slot maior, +1d8 vs mortos-vivos).',
    damage: '2d8 radiante', upcastDice: '1d8',
    classes: ['paladin'],
  },
  {
    id: 'fog-cloud', name: 'Nuvem de Névoa', level: 1, school: 'Conjuração',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 hora',
    description: 'Esfera de névoa de raio 6m. Área fortemente obscurecida. +6m de raio por slot maior.',
    classes: ['wizard', 'sorcerer', 'druid', 'ranger'],
  },

  // ─── NÍVEL 2 ────────────────────────────────────────────
  {
    id: 'misty-step', name: 'Passo Enevoado', level: 2, school: 'Conjuração',
    castingTime: '1 ação bônus', range: 'Pessoal', duration: 'Instantânea',
    description: 'Envolto em névoa prateada, teleporta-se para espaço desocupado visível em 9m.',
    classes: ['wizard', 'sorcerer', 'warlock', 'paladin'],
  },
  {
    id: 'mirror-image', name: 'Imagem Espelhada', level: 2, school: 'Ilusão',
    castingTime: '1 ação', range: 'Pessoal', duration: '1 minuto',
    description: '3 duplicatas ilusórias aparecem ao seu redor. Ataques contra você podem acertar uma duplicata (CA 10 + mod DEX).',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'hold-person', name: 'Paralisar Pessoa', level: 2, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou humanoide fica paralisado. Repete o TR no fim de cada turno. +1 alvo por slot maior.',
    classes: ['wizard', 'sorcerer', 'cleric', 'druid', 'bard', 'warlock'],
  },
  {
    id: 'invisibility', name: 'Invisibilidade', level: 2, school: 'Ilusão',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 hora',
    description: 'Criatura tocada fica invisível. Termina se ela atacar ou conjurar. +1 alvo por slot maior.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'shatter', name: 'Estilhaçar', level: 2, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Som retumbante em raio 3m. CD de Constituição: 3d8 de dano trovejante. Objetos inorgânicos têm desvantagem.',
    damage: '3d8 trovejante', upcastDice: '1d8',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'spiritual-weapon', name: 'Arma Espiritual', level: 2, school: 'Evocação',
    castingTime: '1 ação bônus', range: '18m', duration: '1 minuto',
    description: 'Arma flutuante que ataca como ação bônus (1d8 + mod conjuração de dano de força). +1d8 por 2 slots maior.',
    damage: '1d8+mod',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'lesser-restoration', name: 'Restauração Menor', level: 2, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Remove uma doença, ou a condição envenenado, surdo, cego ou paralisado de uma criatura.',
    classes: ['cleric', 'druid', 'bard', 'paladin', 'ranger'],
  },
  {
    id: 'pass-without-trace', name: 'Passar Sem Rastros', level: 2, school: 'Abjuração',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 hora',
    description: 'Você e até 10 criaturas em 9m ganham +10 em Furtividade e não deixam rastros por 1 hora.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'scorching-ray', name: 'Raio Escaldante', level: 2, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Instantânea',
    description: '3 raios de fogo, cada um causando 2d6 de dano de fogo. Pode direcionar para alvos diferentes. +1 raio por slot maior.',
    damage: '3×2d6 fogo',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'moonbeam', name: 'Raio de Lua', level: 2, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'Coluna de luz pálida, raio 1,5m, altura 12m. 2d10 de dano radiante (CD Constituição, metade no sucesso).',
    damage: '2d10 radiante', upcastDice: '1d10',
    classes: ['druid'],
  },
  {
    id: 'suggestion', name: 'Sugestão', level: 2, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 8 horas',
    description: 'CD de Sabedoria ou o alvo segue uma sugestão razoável. Não pode ser claramente prejudicial.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'web', name: 'Teia', level: 2, school: 'Conjuração',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 hora',
    description: 'Teia pegajosa em cubo de 6m. Terreno difícil. CD de Destreza ou fica contido (CD de Força para escapar).',
    classes: ['wizard', 'sorcerer'],
  },

  // ─── NÍVEL 3 ────────────────────────────────────────────
  {
    id: 'fireball', name: 'Bola de Fogo', level: 3, school: 'Evocação',
    castingTime: '1 ação', range: '45m', duration: 'Instantânea',
    description: 'Explosão ardente em raio 6m. CD de Destreza: 8d6 de dano de fogo (+1d6 por slot maior).',
    damage: '8d6 fogo', upcastDice: '1d6',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'counterspell', name: 'Contrafeitiço', level: 3, school: 'Abjuração',
    castingTime: '1 reação', range: '18m', duration: 'Instantânea',
    description: 'Interrompe a conjuração de uma magia. Magias nível 3 ou menor são automaticamente negadas. Níveis maiores exigem teste.',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'fly', name: 'Voar', level: 3, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 10 minutos',
    description: 'Criatura tocada ganha velocidade de voo de 18m. +1 alvo por slot maior.',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'lightning-bolt', name: 'Raio', level: 3, school: 'Evocação',
    castingTime: '1 ação', range: '30m (linha de 30m)', duration: 'Instantânea',
    description: 'Raio de 30m × 1,5m. CD de Destreza: 8d6 de dano elétrico (+1d6 por slot maior).',
    damage: '8d6 elétrico', upcastDice: '1d6',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'hypnotic-pattern', name: 'Padrão Hipnótico', level: 3, school: 'Ilusão',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'Padrão de cores torcidas em cubo de 9m. CD de Sabedoria ou fica encantado e incapacitado.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'call-lightning', name: 'Invocar Relâmpago', level: 3, school: 'Conjuração',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 10 minutos',
    description: 'Nuvem de tempestade de 18m. Cada turno (ação): raio causa 3d10 elétrico em área de 1,5m.',
    damage: '3d10 elétrico', upcastDice: '1d10',
    classes: ['druid'],
  },
  {
    id: 'mass-healing-word', name: 'Palavra de Cura em Massa', level: 3, school: 'Evocação',
    castingTime: '1 ação bônus', range: '18m', duration: 'Instantânea',
    description: 'Até 6 criaturas recuperam 1d4 + mod. de conjuração de HP. +1d4 por slot maior.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'revivify', name: 'Revivificar', level: 3, school: 'Necromancia',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Ressuscita uma criatura morta há menos de 1 minuto com 1 HP. Consome diamantes no valor de 300 po.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'spirit-guardians', name: 'Guardiões Espirituais', level: 3, school: 'Conjuração',
    castingTime: '1 ação', range: 'Pessoal (raio 4,5m)', duration: 'Concentração, 10 minutos',
    description: 'Espíritos em raio 4,5m. Terreno difícil para inimigos. 3d8 de dano radiante (CD de Sabedoria, metade no sucesso).',
    damage: '3d8 radiante', upcastDice: '1d8',
    classes: ['cleric'],
  },
  {
    id: 'bestow-curse', name: 'Impor Maldição', level: 3, school: 'Necromancia',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou escolha: desvantagem em atributo, desvantagem em ataques, perder ação no turno, +1d8 dano necrótico.',
    damage: '+1d8 necrótico',
    classes: ['cleric', 'bard', 'warlock', 'wizard'],
  },

  // ─── NÍVEL 4 ────────────────────────────────────────────
  {
    id: 'banishment', name: 'Banimento', level: 4, school: 'Abjuração',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'CD de Carisma ou criatura é banida. Criaturas de outros planos são permanentemente banidas se a concentração durar.',
    classes: ['wizard', 'sorcerer', 'cleric', 'paladin', 'warlock'],
  },
  {
    id: 'dimension-door', name: 'Porta Dimensional', level: 4, school: 'Conjuração',
    castingTime: '1 ação', range: '150m', duration: 'Instantânea',
    description: 'Teleporta você e uma criatura voluntária para qualquer local em 150m que você conheça.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'polymorph', name: 'Polimorfismo', level: 4, school: 'Transmutação',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 hora',
    description: 'CD de Sabedoria ou transforma criatura em besta. HP temporário, usa Ficha do monstro. Termina quando HP chega a 0.',
    classes: ['wizard', 'sorcerer', 'druid', 'bard'],
  },
  {
    id: 'blight', name: 'Praga', level: 4, school: 'Necromancia',
    castingTime: '1 ação', range: '9m', duration: 'Instantânea',
    description: 'Drena a vida. CD de Constituição: 8d8 de dano necrótico (+1d8 por slot maior). Plantas sofrem máximo de dano sem TR.',
    damage: '8d8 necrótico', upcastDice: '1d8',
    classes: ['wizard', 'sorcerer', 'druid', 'warlock'],
  },
  {
    id: 'greater-invisibility', name: 'Invisibilidade Superior', level: 4, school: 'Ilusão',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 minuto',
    description: 'Criatura fica invisível mesmo quando ataca ou conjura magias.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'ice-storm', name: 'Tempestade de Gelo', level: 4, school: 'Evocação',
    castingTime: '1 ação', range: '90m', duration: 'Instantânea',
    description: 'Chuva de granizo em cilindro raio 6m, altura 12m. 2d8 frio + 4d6 perfurante (CD Destreza, metade no sucesso).',
    damage: '2d8+4d6',
    classes: ['wizard', 'sorcerer', 'druid'],
  },

  // ─── NÍVEL 5 ────────────────────────────────────────────
  {
    id: 'cone-of-cold', name: 'Cone de Frio', level: 5, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (cone 18m)', duration: 'Instantânea',
    description: 'Rajada de ar gélido em cone. CD de Constituição: 8d8 de dano frio (+1d8 por slot maior).',
    damage: '8d8 frio', upcastDice: '1d8',
    classes: ['wizard', 'sorcerer', 'druid'],
  },
  {
    id: 'hold-monster', name: 'Paralisar Monstro', level: 5, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'Como Paralisar Pessoa, mas funciona em qualquer criatura (exceto mortos-vivos). CD de Sabedoria.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'mass-cure-wounds', name: 'Curar Ferimentos em Massa', level: 5, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Até 6 criaturas recuperam 3d8 + mod. de conjuração de HP. +1d8 por slot maior.',
    classes: ['cleric', 'druid', 'bard'],
  },
  {
    id: 'wall-of-force', name: 'Muro de Força', level: 5, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 10 minutos',
    description: 'Painel invisível de força imóvel. Não pode ser danificado. Bloqueia completamente passagem e magias.',
    classes: ['wizard'],
  },
  {
    id: 'scrying', name: 'Adivinhação', level: 5, school: 'Adivinhação',
    castingTime: '10 minutos', range: 'Pessoal', duration: 'Concentração, 10 minutos',
    description: 'Vê e ouve uma criatura em qualquer plano. CD de Sabedoria baseada na familiaridade com o alvo.',
    classes: ['wizard', 'cleric', 'druid', 'bard', 'warlock'],
  },
  {
    id: 'telekinesis', name: 'Telecinesia', level: 5, school: 'Transmutação',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 10 minutos',
    description: 'Move objetos ou criaturas com a mente. Criaturas: CD de Força ou movida até 9m e fica restrita.',
    classes: ['wizard', 'sorcerer'],
  },

  // ─── CANTRIPS ADICIONAIS ─────────────────────────────────
  {
    id: 'acid-splash', name: 'Jato Ácido', level: 0, school: 'Conjuração',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Bolha de ácido. CD de Destreza ou 1d6 de dano ácido. Pode atingir 2 criaturas adjacentes.',
    damage: '1d6 ácido', cantripScale: true,
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'blade-ward', name: 'Proteção de Lâmina', level: 0, school: 'Abjuração',
    castingTime: '1 ação', range: 'Pessoal', duration: '1 rodada',
    description: 'Resistência a dano cortante, perfurante e contundente de ataques de arma até o fim do seu próximo turno.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'dancing-lights', name: 'Luzes Dançantes', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'Cria até 4 tochas flutuantes ou uma figura humanóide luminosa que se movem até 18m por turno.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'friends', name: 'Amigos', level: 0, school: 'Encantamento',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'Vantagem em Persuasão contra uma criatura não hostil. Ao terminar, ela percebe a magia e pode ficar hostil.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'light', name: 'Luz', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: 'Toque', duration: '1 hora',
    description: 'Objeto ou criatura emite luz brilhante em raio 6m e luz suave por mais 6m. CD de Destreza para criaturas não-voluntárias.',
    classes: ['wizard', 'sorcerer', 'cleric', 'bard'],
  },
  {
    id: 'mending', name: 'Reparar', level: 0, school: 'Transmutação',
    castingTime: '1 minuto', range: 'Toque', duration: 'Instantânea',
    description: 'Repara uma rasgadura ou quebra em um objeto. O reparo não é maior que 30 cm em qualquer dimensão.',
    classes: ['wizard', 'sorcerer', 'cleric', 'druid', 'bard'],
  },
  {
    id: 'message', name: 'Mensagem', level: 0, school: 'Transmutação',
    castingTime: '1 ação', range: '36m', duration: '1 rodada',
    description: 'Sussurra uma mensagem para uma criatura. Ela pode responder sussurrando. Apenas alvo e você ouvem.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'mind-sliver', name: 'Fragmento Mental', level: 0, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'CD de Inteligência ou 1d6 de dano psíquico e -1d4 na próxima TR do alvo antes do seu próximo turno.',
    damage: '1d6 psíquico', cantripScale: true,
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'resistance', name: 'Resistência', level: 0, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 minuto',
    description: 'A criatura tocada pode rolar 1d4 e adicionar o resultado a uma TR antes que a magia termine.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'spare-the-dying', name: 'Poupar os Moribundos', level: 0, school: 'Necromancia',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Criatura viva com 0 HP fica estável. Sem efeito em mortos-vivos ou constructos.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'sword-burst', name: 'Explosão de Espadas', level: 0, school: 'Conjuração',
    castingTime: '1 ação', range: '1,5m', duration: 'Instantânea',
    description: 'CD de Destreza ou 1d6 de dano de força em todas as criaturas em 1,5m.',
    damage: '1d6 força', cantripScale: true,
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'true-strike', name: 'Golpe Certeiro', level: 0, school: 'Adivinhação',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 rodada',
    description: 'Vantagem no seu próximo ataque contra o alvo antes do fim do seu próximo turno.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'word-of-radiance', name: 'Palavra de Radiância', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '1,5m', duration: 'Instantânea',
    description: 'Palavra sagrada provoca explosão radiante. CD de Constituição ou 1d6 de dano radiante em cada inimigo visível adjacente.',
    damage: '1d6 radiante', cantripScale: true,
    classes: ['cleric'],
  },
  {
    id: 'booming-blade', name: 'Lâmina Retumbante', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '1,5m', duration: 'Instantânea',
    description: 'Ataque normal com arma; se acertar, alvo fica envolto em energia trovejante. Se mover voluntariamente antes do próximo turno, sofre 1d8 trovejante extra (+2d8 no nível 5, etc.).',
    damage: '1d8 trovejante', cantripScale: true,
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'green-flame-blade', name: 'Lâmina de Chama Verde', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '1,5m', duration: 'Instantânea',
    description: 'Ataque com arma; chama salta para criatura adjacente causando mod. de conjuração em fogo (+1d8 no nível 5, etc.).',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },

  // ─── NÍVEL 1 ADICIONAL ──────────────────────────────────
  {
    id: 'absorb-elements', name: 'Absorver Elementos', level: 1, school: 'Abjuração',
    castingTime: '1 reação', range: 'Pessoal', duration: '1 rodada',
    description: 'Reação ao sofrer dano elemental: resistência a esse dano e +1d6 do mesmo tipo no próximo ataque corpo a corpo.',
    classes: ['wizard', 'sorcerer', 'druid', 'ranger'],
  },
  {
    id: 'animal-friendship', name: 'Amizade com Animais', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: '24 horas',
    description: 'CD de Sabedoria (Inteligência ≤ 3 falha automaticamente) ou besta fica encantada e amigável.',
    classes: ['druid', 'bard', 'ranger'],
  },
  {
    id: 'bane', name: 'Banir Bênção', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: 'Até 3 criaturas sofrem -1d4 em ataques e TRs. +1 alvo por slot maior.',
    classes: ['cleric', 'bard', 'paladin'],
  },
  {
    id: 'color-spray', name: 'Chuva de Cores', level: 1, school: 'Ilusão',
    castingTime: '1 ação', range: 'Pessoal (cone 4,5m)', duration: '1 rodada',
    description: 'Rola 6d10. Criaturas com HP até esse valor são cegas. +2d10 por slot maior.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'comprehend-languages', name: 'Compreender Idiomas', level: 1, school: 'Adivinhação',
    castingTime: '1 ação (ritual)', range: 'Pessoal', duration: '1 hora',
    description: 'Entende qualquer idioma falado ou escrito que veja/ouça. Não permite falar ou escrever.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'disguise-self', name: 'Disfarçar-se', level: 1, school: 'Ilusão',
    castingTime: '1 ação', range: 'Pessoal', duration: '1 hora',
    description: 'Muda aparência física incluindo roupas e equipamento. Não altera toque. Investigação vs CD de magia revela ilusão.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'dissonant-whispers', name: 'Sussurros Dissonantes', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'CD de Sabedoria: 3d6 de dano psíquico e usa reação para fugir (metade de dano e sem fuga no sucesso). +1d6 por slot maior.',
    damage: '3d6 psíquico', upcastDice: '1d6',
    classes: ['bard'],
  },
  {
    id: 'false-life', name: 'Vida Falsa', level: 1, school: 'Necromancia',
    castingTime: '1 ação', range: 'Pessoal', duration: '1 hora',
    description: 'Ganha 1d4+4 HP temporários. +5 HP temporários por slot maior.',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'feather-fall', name: 'Queda de Pena', level: 1, school: 'Transmutação',
    castingTime: '1 reação', range: '18m', duration: '1 minuto',
    description: 'Até 5 criaturas em queda descem a 18m/round e não sofrem dano de queda.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'find-familiar', name: 'Encontrar Familiar', level: 1, school: 'Conjuração',
    castingTime: '1 hora (ritual)', range: '3m', duration: 'Instantânea',
    description: 'Convoca familiar espiritual (gato, falcão, sapo, etc.). Pode ver/ouvir através dele e conjurar magias de toque.',
    classes: ['wizard'],
  },
  {
    id: 'goodberry', name: 'Bagas Saborosas', level: 1, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Cria até 10 bagas mágicas. Cada baga alimenta uma criatura por um dia e recupera 1 HP.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'grease', name: 'Graxa', level: 1, school: 'Conjuração',
    castingTime: '1 ação', range: '18m', duration: '1 minuto',
    description: 'Quadrado 3m×3m coberto de graxa escorregadia. CD de Destreza para ficar de pé; terreno difícil.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'guiding-bolt', name: 'Raio Guiador', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: '1 rodada',
    description: 'Ataque de toque: 4d6 de dano radiante. Próximo ataque contra o alvo tem vantagem. +1d6 por slot maior.',
    damage: '4d6 radiante', upcastDice: '1d6',
    classes: ['cleric'],
  },
  {
    id: 'heroism', name: 'Heroísmo', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 minuto',
    description: 'Imune a medo. Ganha HP temporários iguais ao mod. de conjuração no início de cada turno. +1 alvo por slot maior.',
    classes: ['bard', 'paladin'],
  },
  {
    id: 'identify', name: 'Identificar', level: 1, school: 'Adivinhação',
    castingTime: '1 minuto (ritual)', range: 'Toque', duration: 'Instantânea',
    description: 'Aprende as propriedades mágicas de um objeto, ou as magias afetando uma criatura. Não revela maldições.',
    classes: ['wizard', 'bard'],
  },
  {
    id: 'jump', name: 'Saltar', level: 1, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: '1 minuto',
    description: 'Distância de salto triplicada por 1 minuto.',
    classes: ['wizard', 'sorcerer', 'druid', 'ranger'],
  },
  {
    id: 'longstrider', name: 'Passo Largo', level: 1, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: '1 hora',
    description: 'Velocidade de movimento +3m por 1 hora. +1 alvo por slot maior.',
    classes: ['wizard', 'druid', 'bard', 'ranger'],
  },
  {
    id: 'protection-good-evil', name: 'Proteção contra o Bem e o Mal', level: 1, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 10 minutos',
    description: 'Proteção contra aberrações, celstiais, elementais, fadas, demônios e mortos-vivos: ataques deles têm desvantagem, imune a encantamento/possessão.',
    classes: ['wizard', 'sorcerer', 'cleric', 'druid', 'paladin', 'warlock'],
  },
  {
    id: 'ray-of-sickness', name: 'Raio de Doença', level: 1, school: 'Necromancia',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Ataque de magia à distância: 2d8 de dano de veneno. CD de Constituição ou fica envenenado até o fim do seu próximo turno.',
    damage: '2d8 veneno', upcastDice: '1d8',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'sanctuary', name: 'Santuário', level: 1, school: 'Abjuração',
    castingTime: '1 ação bônus', range: '9m', duration: '1 minuto',
    description: 'CD de Sabedoria para atacar criatura guardada. Termina se ela atacar ou conjurar magia prejudicial.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'shield-of-faith', name: 'Escudo da Fé', level: 1, school: 'Abjuração',
    castingTime: '1 ação bônus', range: '18m', duration: 'Concentração, 10 minutos',
    description: '+2 de CA enquanto a magia persistir.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'silent-image', name: 'Imagem Silenciosa', level: 1, school: 'Ilusão',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 10 minutos',
    description: 'Ilusão visual de objeto, criatura ou fenômeno em cubo de 4,5m. Investigação vs CD revela ilusão.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'speak-animals', name: 'Falar com Animais', level: 1, school: 'Adivinhação',
    castingTime: '1 ação (ritual)', range: 'Pessoal', duration: '10 minutos',
    description: 'Compreende e se comunica verbalmente com bestas. Elas podem fornecer informações sobre área local.',
    classes: ['druid', 'bard', 'ranger'],
  },
  {
    id: 'tashas-hideous-laughter', name: 'Risada Horrível de Tasha', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou alvo cai no chão rindo (incapacitado e caído). Repete TR no fim de cada turno.',
    classes: ['wizard', 'bard'],
  },
  {
    id: 'unseen-servant', name: 'Servo Invisível', level: 1, school: 'Conjuração',
    castingTime: '1 ação (ritual)', range: '18m', duration: '1 hora',
    description: 'Força invisível mindless (CA 10, 1 HP, Força 2) que executa tarefas simples a até 18m de você.',
    classes: ['wizard', 'bard', 'warlock'],
  },
  {
    id: 'witch-bolt', name: 'Raio da Bruxa', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: 'Ataque de magia: 1d12 de dano elétrico. Cada turno seguinte (ação): 1d12 automático se o alvo ainda estiver em alcance.',
    damage: '1d12 elétrico', upcastDice: '1d12',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'wrathful-smite', name: 'Golpe Iracundo', level: 1, school: 'Evocação',
    castingTime: '1 ação bônus', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'Próximo acerto com arma: +1d6 de dano psíquico. CD de Sabedoria ou fica assustado.',
    damage: '+1d6 psíquico',
    classes: ['paladin'],
  },

  // ─── NÍVEL 2 ADICIONAL ──────────────────────────────────
  {
    id: 'aid', name: 'Auxílio', level: 2, school: 'Abjuração',
    castingTime: '1 ação', range: '9m', duration: '8 horas',
    description: 'Até 3 criaturas: HP máximo e atual +5. +5 por slot maior.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'alter-self', name: 'Alterar-se', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 hora',
    description: 'Aquatic Adaptation, Change Appearance ou Natural Weapons (1d6 ataques de toque mágicos).',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'arcane-lock', name: 'Tranca Arcana', level: 2, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: 'Até ser removida',
    description: 'Porta, janela ou baú ficam fechados magicamente. Difícil de arrombar; você pode designar quem pode abrir.',
    classes: ['wizard'],
  },
  {
    id: 'augury', name: 'Presságio', level: 2, school: 'Adivinhação',
    castingTime: '1 minuto (ritual)', range: 'Pessoal', duration: 'Instantânea',
    description: 'Consulta poderes sobrenaturais: Weal, Woe, Weal and Woe ou Nothing sobre uma ação nas próximas 30 min.',
    classes: ['cleric'],
  },
  {
    id: 'barkskin', name: 'Casca de Árvore', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 hora',
    description: 'Pele da criatura endurece. CA mínima de 16.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'blur', name: 'Desfoque', level: 2, school: 'Ilusão',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'Contorno desfocado. Ataques contra você têm desvantagem (não funciona contra cegueira ou visão verdadeira).',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'calm-emotions', name: 'Acalmar Emoções', level: 2, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'Suprime encantamento/medo em humanoides em raio 6m. Ou torna criaturas indiferentes.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'cloud-of-daggers', name: 'Nuvem de Adagas', level: 2, school: 'Conjuração',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'Cubo 1,5m de facas giratórias. 4d4 de dano cortante a criaturas que entrem ou comecem o turno na área.',
    damage: '4d4 cortante',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'crown-of-madness', name: 'Coroa da Loucura', level: 2, school: 'Encantamento',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou humanoide é encantado; usa ação para atacar criaturas escolhidas por você.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'darkness', name: 'Escuridão', level: 2, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 10 minutos',
    description: 'Escuridão mágica de raio 4,5m que bloqueia visão não-mágica e darkvision.',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'darkvision', name: 'Visão no Escuro', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: '8 horas',
    description: 'Criatura tocada ganha visão no escuro de até 18m por 8 horas.',
    classes: ['wizard', 'sorcerer', 'druid', 'ranger'],
  },
  {
    id: 'detect-thoughts', name: 'Detectar Pensamentos', level: 2, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'Lê pensamentos superficiais (Inteligência > 3) em raio 9m. Pode sondar mais fundo (CD Sabedoria para resistir).',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'enhance-ability', name: 'Melhorar Habilidade', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 hora',
    description: 'Concede um benefício baseado em habilidade: Bull\'s Strength, Cat\'s Grace, Bear\'s Endurance, etc. +1 alvo por slot maior.',
    classes: ['wizard', 'sorcerer', 'cleric', 'druid', 'bard'],
  },
  {
    id: 'enlarge-reduce', name: 'Ampliar/Reduzir', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: 'Ampliar: dobra tamanho, +1d4 dano, vantagem em Força. Reduzir: metade do tamanho, -1d4 dano, desvantagem em Força.',
    classes: ['wizard', 'sorcerer', 'druid'],
  },
  {
    id: 'find-steed', name: 'Encontrar Corcel', level: 2, school: 'Conjuração',
    castingTime: '10 minutos', range: '9m', duration: 'Instantânea',
    description: 'Invoca corcel espiritual inteligente (cavalo de guerra, pônei, camelo, alce ou mastim). Link telepático.',
    classes: ['paladin'],
  },
  {
    id: 'flame-blade', name: 'Lâmina de Chama', level: 2, school: 'Evocação',
    castingTime: '1 ação bônus', range: 'Pessoal', duration: 'Concentração, 10 minutos',
    description: 'Cimitarra de fogo. Ataque de toque: 3d6 de dano de fogo. Emite luz. +1d6 por 2 slots maiores.',
    damage: '3d6 fogo',
    classes: ['druid'],
  },
  {
    id: 'flaming-sphere', name: 'Esfera Flamejante', level: 2, school: 'Conjuração',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'Esfera de fogo de 1,5m que você move como ação bônus. 2d6 de dano de fogo (CD Destreza, metade no sucesso). +1d6 por slot maior.',
    damage: '2d6 fogo', upcastDice: '1d6',
    classes: ['druid', 'wizard'],
  },
  {
    id: 'gentle-repose', name: 'Repouso Gentil', level: 2, school: 'Necromancia',
    castingTime: '1 ação (ritual)', range: 'Toque', duration: '10 dias',
    description: 'Preserva corpo morto. Não pode ser reanimado como morto-vivo. Conta como mais tempo para ressurreição.',
    classes: ['wizard', 'cleric'],
  },
  {
    id: 'gust-of-wind', name: 'Rajada de Vento', level: 2, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (linha 18m)', duration: 'Concentração, 1 minuto',
    description: 'Rajada de 1,5m × 18m. CD de Força ou empurrado 4,5m. Terreno difícil para entrar.',
    classes: ['wizard', 'sorcerer', 'druid'],
  },
  {
    id: 'heat-metal', name: 'Aquecer Metal', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: '2d8 de dano de fogo (CD Destreza, metade no sucesso) a criatura que toca o metal. CD de Constituição ou larga o objeto. +1d8 por slot maior.',
    damage: '2d8 fogo', upcastDice: '1d8',
    classes: ['druid', 'bard'],
  },
  {
    id: 'knock', name: 'Abrir', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Abre porta, janela, baú ou qualquer objeto trancado ou selado (incluindo Arcane Lock). Som de bater audível.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'levitate', name: 'Levitar', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 10 minutos',
    description: 'CD de Constituição (objetos falham automaticamente) ou criatura flutua até 6m verticalmente.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'locate-object', name: 'Localizar Objeto', level: 2, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 10 minutos',
    description: 'Percebe a direção de um objeto específico ou tipo de objeto em 300m. Bloqueado por Lead.',
    classes: ['wizard', 'cleric', 'druid', 'bard', 'ranger', 'paladin'],
  },
  {
    id: 'magic-weapon', name: 'Arma Mágica', level: 2, school: 'Transmutação',
    castingTime: '1 ação bônus', range: 'Toque', duration: 'Concentração, 1 hora',
    description: '+1 em jogadas de ataque e dano. Torna-se mágica. +2 no nível 4 de slot, +3 no nível 6.',
    classes: ['wizard', 'paladin'],
  },
  {
    id: 'prayer-of-healing', name: 'Oração de Cura', level: 2, school: 'Evocação',
    castingTime: '10 minutos', range: '9m', duration: 'Instantânea',
    description: 'Até 6 criaturas recuperam 2d8 + mod. de conjuração de HP. +1d8 por slot maior.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'ray-of-enfeeblement', name: 'Raio de Enfraquecimento', level: 2, school: 'Necromancia',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'Ataque de magia à distância. CD de Constituição ou causa metade do dano com ataques baseados em Força.',
    classes: ['wizard', 'warlock'],
  },
  {
    id: 'see-invisibility', name: 'Ver Invisibilidade', level: 2, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Pessoal', duration: '1 hora',
    description: 'Vê criaturas e objetos invisíveis como se fossem visíveis, e percebe plano etéreo em 18m.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'shadow-blade', name: 'Lâmina de Sombra', level: 2, school: 'Ilusão',
    castingTime: '1 ação bônus', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'Espada de sombra sólida (2d8 dano psíquico, propriedade de arremesso 6/18m, vantagem em luz fraca/escuridão). +1d8 por 2 slots maiores.',
    damage: '2d8 psíquico',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'silence', name: 'Silêncio', level: 2, school: 'Ilusão',
    castingTime: '1 ação (ritual)', range: '36m', duration: 'Concentração, 10 minutos',
    description: 'Esfera de raio 6m: nenhum som dentro. Imunidade a dano trovejante. Magias com componentes verbais falham.',
    classes: ['cleric', 'bard', 'ranger'],
  },
  {
    id: 'spike-growth', name: 'Crescimento de Espinhos', level: 2, school: 'Transmutação',
    castingTime: '1 ação', range: '45m', duration: 'Concentração, 10 minutos',
    description: 'Área de 6m coberta de espinhos. 2d4 de dano perfurante por cada 1,5m percorrido na área. Terreno difícil.',
    damage: '2d4 perfurante',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'warding-bond', name: 'Elo de Guarda', level: 2, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: '1 hora',
    description: 'Link entre você e aliado: ele ganha +1 CA/TRs e resistência a todos os danos. Você sofre o mesmo dano que ele.',
    classes: ['cleric', 'paladin'],
  },

  // ─── NÍVEL 3 ADICIONAL ──────────────────────────────────
  {
    id: 'animate-dead', name: 'Animar Mortos', level: 3, school: 'Necromancia',
    castingTime: '1 minuto', range: '3m', duration: 'Instantânea',
    description: 'Cria zumbi ou esqueleto a partir de ossos/cadáver. Obedece ordens verbais simples por 24h. +2 mortos por slot maior.',
    classes: ['wizard', 'cleric'],
  },
  {
    id: 'aura-of-vitality', name: 'Aura de Vitalidade', level: 3, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (raio 9m)', duration: 'Concentração, 1 minuto',
    description: 'Aura cura 2d6 HP como ação bônus a uma criatura visível na área por turno.',
    classes: ['paladin'],
  },
  {
    id: 'blink', name: 'Piscar', level: 3, school: 'Transmutação',
    castingTime: '1 ação', range: 'Pessoal', duration: '1 minuto',
    description: 'Ao fim de cada turno, rolagem de d20: em 11+ você some para o Plano Etéreo até o início do próximo turno.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'clairvoyance', name: 'Clarividência', level: 3, school: 'Adivinhação',
    castingTime: '10 minutos', range: '1,6 km', duration: 'Concentração, 10 minutos',
    description: 'Cria sensor invisível em lugar familiar no raio. Veja ou ouça através dele.',
    classes: ['wizard', 'sorcerer', 'cleric', 'bard'],
  },
  {
    id: 'crusaders-mantle', name: 'Manto do Cruzado', level: 3, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (raio 9m)', duration: 'Concentração, 1 minuto',
    description: 'Aliados em 9m causam +1d4 de dano radiante em ataques de arma.',
    damage: '+1d4 radiante',
    classes: ['paladin'],
  },
  {
    id: 'daylight', name: 'Luz do Dia', level: 3, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: '1 hora',
    description: 'Esfera de luz brilhante de raio 18m (mais 18m de luz fraca). Dissipa escuridão mágica de nível ≤3.',
    classes: ['sorcerer', 'cleric', 'druid', 'paladin', 'ranger'],
  },
  {
    id: 'dispel-magic', name: 'Dissipar Magia', level: 3, school: 'Abjuração',
    castingTime: '1 ação', range: '36m', duration: 'Instantânea',
    description: 'Termina magias em criatura, objeto ou área. Magias de nível 3 ou menos: automático. Maiores: teste de habilidade CD 10+nível.',
    classes: ['wizard', 'sorcerer', 'cleric', 'druid', 'bard', 'paladin', 'warlock'],
  },
  {
    id: 'fear', name: 'Medo', level: 3, school: 'Ilusão',
    castingTime: '1 ação', range: 'Pessoal (cone 9m)', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou criaturas ficam assustadas, dropam objetos e fogem em linha reta.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'gaseous-form', name: 'Forma Gasosa', level: 3, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 hora',
    description: 'Criatura vira nuvem de gás: voa 3m, resistência a dano não-mágico, imune a veneno/condições. Não pode atacar.',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'haste', name: 'Pressa', level: 3, school: 'Transmutação',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: '+2 CA, vantagem em TRs de DEX, velocidade dobrada, ação adicional (só ataque/Dash/Disengage/Hide/Use Object). Exaustão ao terminar.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'leomund-tiny-hut', name: 'Cabana Minúscula de Leomund', level: 3, school: 'Evocação',
    castingTime: '1 minuto (ritual)', range: 'Pessoal (raio 3m)', duration: '8 horas',
    description: 'Domo de força de raio 3m. Criaturas dentro escolhidas por você. Temperatura confortável.',
    classes: ['wizard', 'bard'],
  },
  {
    id: 'nondetection', name: 'Não-Detecção', level: 3, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: '8 horas',
    description: 'Criatura ou objeto não pode ser alvo de magia de adivinhação nem percebido por sensores mágicos.',
    classes: ['wizard', 'bard', 'ranger'],
  },
  {
    id: 'plant-growth', name: 'Crescimento de Plantas', level: 3, school: 'Transmutação',
    castingTime: '1 ação ou 8 horas', range: '45m', duration: 'Instantânea',
    description: '1 ação: vegetação em raio 30m torna-se terreno difícil. 8 horas: fertilidade mágica enriquece colheitas por 1 ano.',
    classes: ['druid', 'bard', 'ranger'],
  },
  {
    id: 'protection-energy', name: 'Proteção contra Energia', level: 3, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: 'Concentração, 1 hora',
    description: 'Resistência a um tipo de dano elemental (ácido, frio, fogo, raio ou trovão).',
    classes: ['wizard', 'sorcerer', 'cleric', 'druid', 'ranger'],
  },
  {
    id: 'remove-curse', name: 'Remover Maldição', level: 3, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Termina todas as maldições afetando a criatura tocada. Itens amaldiçoados soltos da criatura.',
    classes: ['wizard', 'cleric', 'paladin', 'warlock'],
  },
  {
    id: 'sending', name: 'Mensagem Telepática', level: 3, school: 'Evocação',
    castingTime: '1 ação', range: 'Ilimitado', duration: '1 rodada',
    description: 'Envia mensagem de 25 palavras a qualquer criatura familiar; ela pode responder.',
    classes: ['wizard', 'cleric', 'bard'],
  },
  {
    id: 'sleet-storm', name: 'Tempestade de Granizo', level: 3, school: 'Conjuração',
    castingTime: '1 ação', range: '45m', duration: 'Concentração, 1 minuto',
    description: 'Cilindro r:6m, h:9m. Terreno difícil. CD de Destreza ou fica caído. Chamas mágicas extintas.',
    classes: ['wizard', 'sorcerer', 'druid'],
  },
  {
    id: 'slow', name: 'Lentidão', level: 3, school: 'Transmutação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou até 6 criaturas: velocidade metade, -2 CA/DEX TRs, sem reações, alternância de ação.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'speak-dead', name: 'Falar com os Mortos', level: 3, school: 'Necromancia',
    castingTime: '1 ação', range: '3m', duration: '10 minutos',
    description: 'Cadáver (morto há menos de 10 dias) responde 5 perguntas. Não precisa ser verdadeiro e sabe apenas o que sabia em vida.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'stinking-cloud', name: 'Nuvem Fedorenta', level: 3, school: 'Conjuração',
    castingTime: '1 ação', range: '27m', duration: 'Concentração, 1 minuto',
    description: 'Esfera de névoa amarela de raio 6m. CD de Constituição ou perde ação pelo nojo. Fortemente obscurecida.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'thunder-step', name: 'Passo do Trovão', level: 3, school: 'Conjuração',
    castingTime: '1 ação', range: '27m', duration: 'Instantânea',
    description: 'Teleporta para local visível e emite trovão: 3d10 de dano trovejante (CD Constituição, metade no sucesso) em raio 1,5m.',
    damage: '3d10 trovejante', upcastDice: '1d10',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'tongues', name: 'Línguas', level: 3, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Toque', duration: '1 hora',
    description: 'Entende todos os idiomas falados e qualquer criatura que falar com você entende seu idioma.',
    classes: ['wizard', 'sorcerer', 'cleric', 'bard', 'warlock'],
  },
  {
    id: 'vampiric-touch', name: 'Toque Vampírico', level: 3, school: 'Necromancia',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'Ataque de toque: 3d6 de dano necrótico. Recupera HP igual à metade do dano causado. +1d6 por slot maior.',
    damage: '3d6 necrótico', upcastDice: '1d6',
    classes: ['wizard', 'warlock'],
  },
  {
    id: 'water-breathing', name: 'Respirar na Água', level: 3, school: 'Transmutação',
    castingTime: '1 ação (ritual)', range: '9m', duration: '24 horas',
    description: 'Até 10 criaturas respiram debaixo d\'água por 24h (sem perder o ar que tinham).',
    classes: ['wizard', 'sorcerer', 'druid', 'ranger'],
  },

  // ─── NÍVEL 4 ADICIONAL ──────────────────────────────────
  {
    id: 'aura-life', name: 'Aura de Vida', level: 4, school: 'Abjuração',
    castingTime: '1 ação', range: 'Pessoal (raio 9m)', duration: 'Concentração, 10 minutos',
    description: 'Aliados em 9m: resistência a dano necrótico, máximo de HP não reduzido e recuperam 1 HP no início do turno se tiverem 0 HP.',
    classes: ['paladin'],
  },
  {
    id: 'charm-monster', name: 'Enfeitiçar Monstro', level: 4, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: '1 hora',
    description: 'Como Enfeitiçar Pessoa, mas funciona em qualquer tipo de criatura. +1 alvo por slot maior.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock', 'druid'],
  },
  {
    id: 'compulsion', name: 'Compulsão', level: 4, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou humanoides visíveis se movem na direção que você indicar (ação bônus). Não provocam ataques de oportunidade.',
    classes: ['bard', 'paladin'],
  },
  {
    id: 'confusion', name: 'Confusão', level: 4, school: 'Encantamento',
    castingTime: '1 ação', range: '27m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou criaturas em raio 3m agem aleatoriamente (tabela d10): caminham, atacam aliados, ficam paradas, etc.',
    classes: ['wizard', 'sorcerer', 'druid', 'bard'],
  },
  {
    id: 'death-ward', name: 'Proteção contra a Morte', level: 4, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: '8 horas',
    description: 'Primeira vez que cair a 0 HP ou sofrer efeito de morte instantânea, fica em 1 HP em vez disso (magia é consumida).',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'dominate-beast', name: 'Dominar Besta', level: 4, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou besta fica encantada. Pode dar comandos telepáticos. +1 min de duração por slot maior.',
    classes: ['sorcerer', 'druid'],
  },
  {
    id: 'evards-black-tentacles', name: 'Tentáculos Negros de Evard', level: 4, school: 'Conjuração',
    castingTime: '1 ação', range: '27m', duration: 'Concentração, 1 minuto',
    description: 'Quadrado 6m×6m de tentáculos. CD de Destreza: 3d6 dano contundente e fica contido (CD Força/DEX para escapar).',
    damage: '3d6 contundente',
    classes: ['wizard'],
  },
  {
    id: 'fire-shield', name: 'Escudo de Fogo', level: 4, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal', duration: '10 minutos',
    description: 'Chamas calorosas ou frias. Resistência a frio/fogo. Ataques corpo-a-corpo causam 2d8 de dano de fogo/frio ao atacante.',
    damage: '2d8',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'freedom-movement', name: 'Liberdade de Movimento', level: 4, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: '1 hora',
    description: 'Ignora terreno difícil e não pode ser contido ou preso por efeitos mágicos. Move normalmente subaquaticamente.',
    classes: ['cleric', 'druid', 'bard', 'ranger'],
  },
  {
    id: 'guardian-faith', name: 'Guardião da Fé', level: 4, school: 'Conjuração',
    castingTime: '1 ação', range: '9m', duration: '8 horas',
    description: 'Guardião espectral de 3m ocupa espaço. Inimigos a menos de 3m: CD de Destreza ou 20 de dano radiante. Até 60 de dano total.',
    damage: '20 radiante',
    classes: ['cleric'],
  },
  {
    id: 'hallucinatory-terrain', name: 'Terreno Alucinatório', level: 4, school: 'Ilusão',
    castingTime: '10 minutos', range: '90m', duration: '24 horas',
    description: 'Cubo de terreno até 45m parece outro tipo (floresta por pântano, etc.). Investigação vs CD de magia revela ilusão.',
    classes: ['wizard', 'sorcerer', 'druid', 'bard', 'warlock'],
  },
  {
    id: 'locate-creature', name: 'Localizar Criatura', level: 4, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 hora',
    description: 'Percebe direção de criatura específica ou tipo de criatura mais próximo em 300m. Bloqueado por água corrente.',
    classes: ['wizard', 'cleric', 'druid', 'bard', 'ranger', 'paladin'],
  },
  {
    id: 'phantasmal-killer', name: 'Assassino Fantasmagórico', level: 4, school: 'Ilusão',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou assustado pelo pior medo. No fim de cada turno: CD de Sabedoria ou 4d10 dano psíquico. +1d10 por slot maior.',
    damage: '4d10 psíquico', upcastDice: '1d10',
    classes: ['wizard'],
  },
  {
    id: 'resilient-sphere', name: 'Esfera Resiliente de Otiluke', level: 4, school: 'Evocação',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: 'CD de Destreza ou criatura fica encerrada em esfera de força de 3m. Imune a dano; nada entra ou sai.',
    classes: ['wizard'],
  },
  {
    id: 'stone-shape', name: 'Moldar Pedra', level: 4, school: 'Transmutação',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Molda pedra de volume de até 1,5m³ em qualquer forma desejada (incluindo passagens, armas improvisadas, etc.).',
    classes: ['wizard', 'cleric', 'druid'],
  },
  {
    id: 'staggering-smite', name: 'Golpe Atordoante', level: 4, school: 'Evocação',
    castingTime: '1 ação bônus', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'Próximo acerto com arma: +4d6 de dano psíquico. CD de Sabedoria ou fica atordoado até o fim do próximo turno.',
    damage: '+4d6 psíquico',
    classes: ['paladin'],
  },
  {
    id: 'wall-of-fire', name: 'Muro de Fogo', level: 4, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'Muro de 18m×1,5m×6m ou anel de raio 6m. 5d8 de dano de fogo a criaturas que passem ou comecem turno no lado interior. +1d8 por slot maior.',
    damage: '5d8 fogo', upcastDice: '1d8',
    classes: ['wizard', 'sorcerer', 'druid'],
  },

  // ─── NÍVEL 5 ADICIONAL ──────────────────────────────────
  {
    id: 'animate-objects', name: 'Animar Objetos', level: 5, school: 'Transmutação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'Até 10 objetos não-mágicos ganham vida. Atacam como ação bônus. Minúsculos: 1d4+4; Pequenos: 1d8+2; etc.',
    damage: '1d4+4',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'commune', name: 'Comunhão', level: 5, school: 'Adivinhação',
    castingTime: '1 minuto (ritual)', range: 'Pessoal', duration: '1 minuto',
    description: 'Contata divindade ou intermediário. 3 perguntas de sim/não/irrelevante. Uma vez por descanso longo.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'conjure-volley', name: 'Conjurar Saraivada', level: 5, school: 'Conjuração',
    castingTime: '1 ação', range: '45m', duration: 'Instantânea',
    description: 'Arremessa munição/arma em cilindro raio 18m, altura 12m. 8d8 de dano (CD Destreza, metade no sucesso).',
    damage: '8d8',
    classes: ['ranger'],
  },
  {
    id: 'contact-other-plane', name: 'Contatar Outro Plano', level: 5, school: 'Adivinhação',
    castingTime: '1 minuto (ritual)', range: 'Pessoal', duration: '1 minuto',
    description: '5 perguntas ao cosmos (CD INT 15 ou 6d6 dano psíquico e insânia temporária). Respostas curtas e enigmáticas.',
    classes: ['wizard', 'warlock'],
  },
  {
    id: 'contagion', name: 'Contágio', level: 5, school: 'Necromancia',
    castingTime: '1 ação', range: 'Toque', duration: '7 dias',
    description: 'Ataque de toque. CD de Constituição por 3 rodadas; após 3 falhas, contrai doença (Blinding Sickness, Filth Fever, etc.).',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'destructive-wave', name: 'Onda Destrutiva', level: 5, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (raio 9m)', duration: 'Instantânea',
    description: 'Energia divina em raio 9m. CD de Constituição: 5d6 trovejante + 5d6 radiante ou necrótico (metade no sucesso). Pode derrubar criaturas.',
    damage: '5d6+5d6',
    classes: ['paladin'],
  },
  {
    id: 'dominate-person', name: 'Dominar Pessoa', level: 5, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou humanoide fica encantado. Controle telepático total. Dura mais com slots maiores.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'flame-strike', name: 'Golpe de Chamas', level: 5, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Coluna divina de fogo de raio 3m, altura 12m. CD de Destreza: 4d6 fogo + 4d6 radiante (+1d6 de cada por slot maior).',
    damage: '4d6+4d6',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'geas', name: 'Geas', level: 5, school: 'Encantamento',
    castingTime: '1 minuto', range: '18m', duration: '30 dias',
    description: 'CD de Sabedoria ou humanoides obedecem a um comando razoável. 5d10 de dano psíquico se agirem contra o comando.',
    damage: '5d10 psíquico',
    classes: ['wizard', 'cleric', 'druid', 'bard', 'paladin'],
  },
  {
    id: 'holy-weapon', name: 'Arma Sagrada', level: 5, school: 'Evocação',
    castingTime: '1 ação bônus', range: 'Toque', duration: 'Concentração, 1 hora',
    description: 'Infunde arma com poder sagrado: +2d8 de dano radiante. Como ação, detonação: 4d8 radiante (CD Constituição).',
    damage: '+2d8 radiante',
    classes: ['paladin'],
  },
  {
    id: 'insect-plague', name: 'Praga de Insetos', level: 5, school: 'Conjuração',
    castingTime: '1 ação', range: '90m', duration: 'Concentração, 10 minutos',
    description: 'Esfera de raio 6m infestada de gafanhotos. Fortemente obscurecida. 4d10 de dano perfurante (CD Constituição, metade). +1d10 por slot maior.',
    damage: '4d10 perfurante', upcastDice: '1d10',
    classes: ['cleric', 'druid', 'sorcerer'],
  },
  {
    id: 'legend-lore', name: 'Lenda e Lore', level: 5, school: 'Adivinhação',
    castingTime: '10 minutos', range: 'Pessoal', duration: 'Instantânea',
    description: 'Nomeie pessoa, lugar ou objeto lendário; receba informações sobre ele disponíveis nas lendas.',
    classes: ['wizard', 'cleric', 'bard'],
  },
  {
    id: 'mislead', name: 'Enganar', level: 5, school: 'Ilusão',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 hora',
    description: 'Fica invisível e cria duplo ilusório no seu lugar. Controla o duplo como ação bônus. Pode ver/ouvir pelo duplo.',
    classes: ['wizard', 'bard'],
  },
  {
    id: 'modify-memory', name: 'Modificar Memória', level: 5, school: 'Encantamento',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou alvo fica incapacitado; pode alterar uma memória dos últimos 24h (até 10 min). Slots maiores estendem o período.',
    classes: ['wizard', 'bard'],
  },
  {
    id: 'passwall', name: 'Passagem pelo Muro', level: 5, school: 'Transmutação',
    castingTime: '1 ação', range: '9m', duration: '1 hora',
    description: 'Cria passagem em madeira, pedra ou plástico: 1,5m × 2,4m × 6m. Fecha ao término.',
    classes: ['wizard'],
  },
  {
    id: 'raise-dead', name: 'Ressuscitar', level: 5, school: 'Necromancia',
    castingTime: '1 hora', range: 'Toque', duration: 'Instantânea',
    description: 'Ressuscita criatura morta há ≤10 dias com 1 HP. -4 em ataques/TRs/testes; reduz 1 por longo descanso. Consome 500 po em diamantes.',
    classes: ['cleric', 'bard', 'paladin'],
  },
  {
    id: 'steel-wind-strike', name: 'Golpe do Vento de Aço', level: 5, school: 'Conjuração',
    castingTime: '1 ação', range: '9m', duration: 'Instantânea',
    description: 'Ataque com arma corpo-a-corpo: até 5 alvos visíveis em raio, 6d10 de dano cortante cada. Teleporta para espaço de um dos alvos.',
    damage: '6d10 cortante',
    classes: ['wizard', 'ranger'],
  },
  {
    id: 'synaptic-static', name: 'Estática Sináptica', level: 5, school: 'Encantamento',
    castingTime: '1 ação', range: '36m', duration: 'Instantânea',
    description: 'CD de Inteligência: 8d6 de dano psíquico e -1d6 em ataques/testes de habilidade/testes de concentração por 1 minuto.',
    damage: '8d6 psíquico',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'wall-of-stone', name: 'Muro de Pedra', level: 5, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 10 minutos',
    description: 'Muro de pedra não-mágica: 10 painéis de 3m × 6m × 15 cm. Pode se tornar permanente.',
    classes: ['wizard', 'sorcerer', 'druid'],
  },

  // ─── NÍVEL 6 ────────────────────────────────────────────
  {
    id: 'blade-barrier', name: 'Barreira de Lâminas', level: 6, school: 'Evocação',
    castingTime: '1 ação', range: '27m', duration: 'Concentração, 10 minutos',
    description: 'Muro giratório de lâminas sagradas (30m × 9m × 1,5m ou anel). CD de Destreza: 6d10 de dano cortante.',
    damage: '6d10 cortante',
    classes: ['cleric'],
  },
  {
    id: 'chain-lightning', name: 'Raio em Cadeia', level: 6, school: 'Evocação',
    castingTime: '1 ação', range: '90m', duration: 'Instantânea',
    description: 'Raio atinge alvo primário e salta para mais 3 alvos em 9m. CD de Destreza: 10d8 de dano elétrico cada.',
    damage: '10d8 elétrico', upcastDice: '1d8',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'circle-of-death', name: 'Círculo da Morte', level: 6, school: 'Necromancia',
    castingTime: '1 ação', range: '45m', duration: 'Instantânea',
    description: 'Esfera de raio 18m de energia negativa. CD de Constituição: 8d6 de dano necrótico (metade no sucesso). +2d6 por slot maior.',
    damage: '8d6 necrótico', upcastDice: '2d6',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'create-undead', name: 'Criar Mortos-Vivos', level: 6, school: 'Necromancia',
    castingTime: '1 minuto', range: '3m', duration: 'Instantânea',
    description: 'Cria até 3 ghouls a partir de cadáveres (1 wight com slot 7°, 2 wights com 8°, 1 momia com 9°). Obedece ordens.',
    classes: ['wizard', 'cleric', 'warlock'],
  },
  {
    id: 'disintegrate', name: 'Desintegrar', level: 6, school: 'Transmutação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Ataque de magia à distância: 10d6+40 de dano de força. Se reduzir a 0 HP, vira pó. +3d6 por slot maior.',
    damage: '10d6+40 força', upcastDice: '3d6',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'eyebite', name: 'Mordida de Olho', level: 6, school: 'Necromancia',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'A cada turno (ação bônus), olhe para criatura em 18m: adormece, fica doente (-2d6 a ataques/TRs) ou fica assustada.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'flesh-to-stone', name: 'Carne em Pedra', level: 6, school: 'Transmutação',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'CD de Constituição ou criatura se transforma em pedra gradualmente (restrained → petrified após 3 falhas).',
    classes: ['wizard', 'warlock'],
  },
  {
    id: 'globe-invulnerability', name: 'Globo de Invulnerabilidade', level: 6, school: 'Abjuração',
    castingTime: '1 ação', range: 'Pessoal (raio 3m)', duration: 'Concentração, 1 minuto',
    description: 'Esfera de força: magias de nível 5 ou menor não podem entrar. +1 ao nível bloqueado por slot maior.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'harm', name: 'Dano', level: 6, school: 'Necromancia',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'CD de Constituição: 14d6 de dano necrótico (metade no sucesso). HP máximo reduzido pelo dano por 1 hora.',
    damage: '14d6 necrótico',
    classes: ['cleric'],
  },
  {
    id: 'heal', name: 'Curar', level: 6, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Cura 70 HP. Remove cegueira, surdez e doenças. +10 HP por slot maior.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'heroes-feast', name: 'Banquete dos Heróis', level: 6, school: 'Conjuração',
    castingTime: '10 minutos', range: '9m', duration: 'Instantânea',
    description: 'Banquete mágico para 12: cura 2d10 max HP, imunidade a veneno/medo, resistência a magias de encantamento e vantagem em WIS TRs.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'mass-suggestion', name: 'Sugestão em Massa', level: 6, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: '24 horas',
    description: 'Como Sugestão, mas em até 12 criaturas. +durações maiores com slots maiores.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'otiluke-freezing-sphere', name: 'Esfera Congelante de Otiluke', level: 6, school: 'Evocação',
    castingTime: '1 ação', range: '90m', duration: 'Instantânea',
    description: 'Esfera de frio de raio 18m. CD de Constituição: 10d6 de dano frio (metade no sucesso). Pode lançar a esfera depois.',
    damage: '10d6 frio',
    classes: ['wizard'],
  },
  {
    id: 'sunbeam', name: 'Raio de Sol', level: 6, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (linha 18m)', duration: 'Concentração, 1 minuto',
    description: 'Linha de luz solar. CD de Constituição: 6d8 de dano radiante e cego até próximo turno. Por turno como ação.',
    damage: '6d8 radiante',
    classes: ['wizard', 'sorcerer', 'druid', 'cleric'],
  },
  {
    id: 'true-seeing', name: 'Visão Verdadeira', level: 6, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Toque', duration: '1 hora',
    description: 'Visão verdadeira de 36m: vê formas verdadeiras, invisível, plano etéreo e lê idiomas secretos.',
    classes: ['wizard', 'sorcerer', 'cleric', 'bard', 'warlock'],
  },
  {
    id: 'wall-of-ice', name: 'Muro de Gelo', level: 6, school: 'Evocação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 10 minutos',
    description: 'Muro de gelo de 10 painéis (3m×3m×30cm). 10d6 de dano frio ao surgir (CD Destreza). +2d6 por slot maior.',
    damage: '10d6 frio', upcastDice: '2d6',
    classes: ['wizard'],
  },
  {
    id: 'word-of-recall', name: 'Palavra de Retorno', level: 6, school: 'Conjuração',
    castingTime: '1 ação', range: '1,5m', duration: 'Instantânea',
    description: 'Teleporta você e até 5 criaturas voluntárias para um santuário sagrado designado previamente.',
    classes: ['cleric'],
  },

  // ─── NÍVEL 7 ────────────────────────────────────────────
  {
    id: 'conjure-celestial', name: 'Conjurar Celestial', level: 7, school: 'Conjuração',
    castingTime: '1 minuto', range: '9m', duration: 'Concentração, 1 hora',
    description: 'Convoca celestial de NC 4 ou menor que luta a seu favor. NC 5 com slot 8°, NC 6 com slot 9°.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'crown-of-stars', name: 'Coroa de Estrelas', level: 7, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal', duration: '1 hora',
    description: 'Cria 7 motes de luz radiante. Como ação bônus, lança um mote (ataque à distância): 4d12 de dano radiante.',
    damage: '4d12 radiante',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'delayed-blast-fireball', name: 'Bola de Fogo de Detonação Atrasada', level: 7, school: 'Evocação',
    castingTime: '1 ação', range: '45m', duration: 'Concentração, 1 minuto',
    description: 'Como Bola de Fogo (12d6), mas pode atrasar a explosão (aumenta dano em 1d6/turno). CD de Destreza. +1d6 por slot maior.',
    damage: '12d6 fogo', upcastDice: '1d6',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'divine-word', name: 'Palavra Divina', level: 7, school: 'Evocação',
    castingTime: '1 ação bônus', range: '9m', duration: 'Instantânea',
    description: 'CD de Carisma: efeito baseado no HP atual (surdez, cegueira, atordoamento ou morte). Criaturas de outros planos banidas.',
    classes: ['cleric'],
  },
  {
    id: 'etherealness', name: 'Evanescência', level: 7, school: 'Transmutação',
    castingTime: '1 ação', range: 'Pessoal', duration: '8 horas',
    description: 'Entra no Plano Etéreo. Visível mas intangível. Pode passar por objetos físicos. Volta ao plano original com ação.',
    classes: ['wizard', 'sorcerer', 'cleric', 'bard', 'warlock'],
  },
  {
    id: 'finger-of-death', name: 'Dedo da Morte', level: 7, school: 'Necromancia',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'CD de Constituição: 7d8+30 de dano necrótico (metade no sucesso). Humanoide morto por isso revive como zumbi obediente.',
    damage: '7d8+30 necrótico',
    classes: ['wizard', 'sorcerer', 'warlock'],
  },
  {
    id: 'fire-storm', name: 'Tempestade de Fogo', level: 7, school: 'Evocação',
    castingTime: '1 ação', range: '90m', duration: 'Instantânea',
    description: 'Área de até 10 cubos de 3m. CD de Destreza: 7d10 de dano de fogo (metade no sucesso). Vegetação pode pegar fogo.',
    damage: '7d10 fogo',
    classes: ['cleric', 'druid', 'sorcerer'],
  },
  {
    id: 'forcecage', name: 'Gaiola de Força', level: 7, school: 'Evocação',
    castingTime: '1 ação', range: '27m', duration: '1 hora',
    description: 'Cubo de 3m de barras de força ou cubo sólido de 3m. Escape requer CD de Carisma ou magia de teleporte.',
    classes: ['wizard', 'bard', 'warlock'],
  },
  {
    id: 'mirage-arcane', name: 'Miragem Arcana', level: 7, school: 'Ilusão',
    castingTime: '10 minutos', range: 'Visível', duration: '10 dias',
    description: 'Terreno de até 1,6 km por 1,6 km parece completamente diferente. Investigação vs CD de magia revela ilusão.',
    classes: ['wizard', 'druid', 'bard'],
  },
  {
    id: 'plane-shift', name: 'Mudar de Plano', level: 7, school: 'Conjuração',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Você e até 8 criaturas voluntárias teletransportam-se para outro plano. Versão ofensiva: ataque de toque (CD de Carisma) bane criatura.',
    classes: ['wizard', 'cleric', 'druid', 'paladin', 'warlock'],
  },
  {
    id: 'prismatic-spray', name: 'Spray Prismático', level: 7, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (cone 18m)', duration: 'Instantânea',
    description: 'Cada criatura no cone é atingida por raio de cor aleatória (d8): fogo 10d6, gelo 10d6, raio 10d6, ácido 10d6, veneno, petrificação, banimento, ou dois raios.',
    damage: '10d6',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'regenerate', name: 'Regenerar', level: 7, school: 'Transmutação',
    castingTime: '1 minuto', range: 'Toque', duration: '1 hora',
    description: 'Reganha 4d8+15 HP. Regenera 10 HP a cada turno. Membros cortados regeneram após 2 minutos.',
    classes: ['cleric', 'druid', 'bard'],
  },
  {
    id: 'resurrection', name: 'Ressurreição', level: 7, school: 'Necromancia',
    castingTime: '1 hora', range: 'Toque', duration: 'Instantânea',
    description: 'Ressuscita criatura morta há ≤100 anos com HP máximo. Requer 1000 po em diamantes. Dissolve alma presa.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'reverse-gravity', name: 'Reverter a Gravidade', level: 7, school: 'Transmutação',
    castingTime: '1 ação', range: '30m', duration: 'Concentração, 1 minuto',
    description: 'Cilindro raio 15m, altura 30m: gravidade invertida. CD de Destreza ou criaturas caem para cima.',
    classes: ['wizard', 'sorcerer', 'druid'],
  },
  {
    id: 'symbol', name: 'Símbolo', level: 7, school: 'Abjuração',
    castingTime: '1 minuto', range: 'Toque', duration: 'Até ser acionado ou removido',
    description: 'Glifo de armadilha mágica. Ao ser acionado: morte (50 HP dano necrótico), discórdia, medo, incapacitação, loucura, dor, aturdimento ou sono.',
    classes: ['wizard', 'cleric', 'bard'],
  },
  {
    id: 'teleport', name: 'Teletransporte', level: 7, school: 'Conjuração',
    castingTime: '1 ação', range: '3m', duration: 'Instantânea',
    description: 'Você e até 8 criaturas voluntárias teletransportam-se para destino no mesmo plano. Familiaridade afeta precisão.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },

  // ─── NÍVEL 8 ────────────────────────────────────────────
  {
    id: 'antimagic-field', name: 'Campo Antimagia', level: 8, school: 'Abjuração',
    castingTime: '1 ação', range: 'Pessoal (raio 3m)', duration: 'Concentração, 1 hora',
    description: 'Esfera de 3m suspende toda magia. Magias, ítens mágicos e mortos-vivos criados magicamente não funcionam.',
    classes: ['wizard', 'cleric'],
  },
  {
    id: 'clone', name: 'Clone', level: 8, school: 'Necromancia',
    castingTime: '1 hora', range: 'Toque', duration: 'Instantânea',
    description: 'Cria clone inerte. Se morrer, sua alma migra para o clone (que amadurece em 120 dias).',
    classes: ['wizard'],
  },
  {
    id: 'control-weather', name: 'Controlar o Clima', level: 8, school: 'Transmutação',
    castingTime: '10 minutos', range: 'Pessoal (raio 8 km)', duration: 'Concentração, 8 horas',
    description: 'Altera condições climáticas locais (temperatura, precipitação, vento, nuvens) em fases de 10 minutos.',
    classes: ['wizard', 'cleric', 'druid'],
  },
  {
    id: 'demiplane', name: 'Semiplano', level: 8, school: 'Conjuração',
    castingTime: '1 ação', range: '18m', duration: '1 hora',
    description: 'Porta para sala de 9m×9m×9m em semiplano. Porta fecha após 1 hora; conteúdo permanece.',
    classes: ['wizard', 'warlock'],
  },
  {
    id: 'dominate-monster', name: 'Dominar Monstro', level: 8, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 hora',
    description: 'CD de Sabedoria ou qualquer criatura fica sob controle telepático por 1 hora.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'earthquake', name: 'Terremoto', level: 8, school: 'Evocação',
    castingTime: '1 ação', range: '150m', duration: 'Concentração, 1 minuto',
    description: 'Tremor em círculo de raio 30m: terreno difícil, rachaduras, concentração CD 15, estruturas sofrem dano, criaturas podem cair.',
    classes: ['cleric', 'druid', 'sorcerer'],
  },
  {
    id: 'feeblemind', name: 'Imbecilização', level: 8, school: 'Encantamento',
    castingTime: '1 ação', range: '45m', duration: 'Instantânea',
    description: 'CD de Inteligência: 4d6 de dano psíquico e INT/CAR ficam 1. Não pode conjurar magias. TR novamente a cada 30 dias.',
    damage: '4d6 psíquico',
    classes: ['wizard', 'druid', 'bard', 'warlock'],
  },
  {
    id: 'holy-aura', name: 'Aura Sagrada', level: 8, school: 'Abjuração',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 minuto',
    description: 'Criaturas escolhidas em 9m: vantagem em TRs, ataques contra elas têm desvantagem, fiends e undead que acertam: cegados.',
    classes: ['cleric'],
  },
  {
    id: 'incendiary-cloud', name: 'Nuvem Incendiária', level: 8, school: 'Conjuração',
    castingTime: '1 ação', range: '45m', duration: 'Concentração, 1 minuto',
    description: 'Esfera de fumaça e chamas de raio 6m. 10d8 de dano de fogo (CD Destreza, metade). Move 3m/turno.',
    damage: '10d8 fogo',
    classes: ['wizard', 'sorcerer', 'druid'],
  },
  {
    id: 'maze', name: 'Labirinto', level: 8, school: 'Conjuração',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 10 minutos',
    description: 'Bane criatura para labirinto extradimensional. Pode escapar com ação e CD INT 20. Minotauros escapam automaticamente.',
    classes: ['wizard'],
  },
  {
    id: 'mind-blank', name: 'Mente em Branco', level: 8, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', duration: '24 horas',
    description: 'Imunidade a dano psíquico, adivinhação, encantamento e leitura de pensamentos por 24h.',
    classes: ['wizard', 'bard'],
  },
  {
    id: 'power-word-stun', name: 'Palavra de Poder — Atordoar', level: 8, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Até a criatura se recuperar',
    description: 'Criatura com ≤150 HP fica atordoada. CD de Constituição ao fim de cada turno para terminar.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'sunburst', name: 'Explosão Solar', level: 8, school: 'Evocação',
    castingTime: '1 ação', range: '45m', duration: 'Instantânea',
    description: 'Explosão de luz solar de raio 18m. CD de Constituição: 12d6 de dano radiante e cegueira por 1 min.',
    damage: '12d6 radiante',
    classes: ['wizard', 'sorcerer', 'druid', 'cleric'],
  },
  {
    id: 'tsunami', name: 'Tsunami', level: 8, school: 'Conjuração',
    castingTime: '1 minuto', range: 'Visível', duration: 'Concentração, 6 rodadas',
    description: 'Parede de água de 90m × 90m × 3m que avança. 6d10 contundente (CD Força) e pode arrastar criaturas.',
    damage: '6d10 contundente',
    classes: ['druid'],
  },

  // ─── NÍVEL 9 ────────────────────────────────────────────
  {
    id: 'astral-projection', name: 'Projeção Astral', level: 9, school: 'Necromancia',
    castingTime: '1 hora', range: '3m', duration: 'Especial',
    description: 'Você e até 8 criaturas voluntárias entram no Plano Astral. Cordão prateado conecta ao corpo físico. Termina com Disrupt Mortal.',
    classes: ['wizard', 'cleric', 'warlock'],
  },
  {
    id: 'foresight', name: 'Presciência', level: 9, school: 'Adivinhação',
    castingTime: '1 minuto', range: 'Toque', duration: '8 horas',
    description: 'Criatura tocada não pode ser surpreendida, tem vantagem em ataques/testes/TRs, ataques contra ela têm desvantagem.',
    classes: ['wizard', 'druid', 'bard', 'warlock'],
  },
  {
    id: 'gate', name: 'Portal', level: 9, school: 'Conjuração',
    castingTime: '1 ação', range: '18m', duration: 'Concentração, 1 minuto',
    description: 'Portal interplanar circular de raio 3m. Chama uma criatura específica (CD de Carisma para resistir a ser puxada). Passagem nos dois sentidos.',
    classes: ['wizard', 'sorcerer', 'cleric'],
  },
  {
    id: 'imprisonment', name: 'Aprisionamento', level: 9, school: 'Abjuração',
    castingTime: '1 minuto', range: '9m', duration: 'Até ser removida',
    description: 'CD de Sabedoria ou criatura aprisionada (sono, acorrentamento, sepultamento, miniaturização, cercamento extraplanar). Wish pode libertar.',
    classes: ['wizard', 'warlock'],
  },
  {
    id: 'mass-heal', name: 'Cura em Massa', level: 9, school: 'Evocação',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Distribui 700 HP de cura entre criaturas visíveis. Remove cegueira, surdez e doenças.',
    classes: ['cleric'],
  },
  {
    id: 'mass-polymorph', name: 'Polimorfismo em Massa', level: 9, school: 'Transmutação',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 hora',
    description: 'Até 10 criaturas em raio 18m: CD de Sabedoria ou transforma inimigos em bestas NC 1 ou menos. Aliados voluntários transformam-se sem TR.',
    classes: ['wizard', 'sorcerer', 'bard'],
  },
  {
    id: 'meteor-swarm', name: 'Chuva de Meteoros', level: 9, school: 'Evocação',
    castingTime: '1 ação', range: '1,6 km', duration: 'Instantânea',
    description: '4 meteoros em pontos visíveis (mín. 36m entre si), raio 13,5m cada. CD de Destreza: 20d6 fogo + 20d6 contundente (metade no sucesso).',
    damage: '20d6+20d6',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'power-word-heal', name: 'Palavra de Poder — Curar', level: 9, school: 'Evocação',
    castingTime: '1 ação', range: 'Toque', duration: 'Instantânea',
    description: 'Recupera todos os HP. Remove charmed, frightened, paralyzed e stunned. Levanta da morte com 1d4 HP se estiver morrendo.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'power-word-kill', name: 'Palavra de Poder — Matar', level: 9, school: 'Encantamento',
    castingTime: '1 ação', range: '18m', duration: 'Instantânea',
    description: 'Criatura com ≤100 HP morre instantaneamente. Sem TR, sem salvação.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'prismatic-wall', name: 'Muro Prismático', level: 9, school: 'Abjuração',
    castingTime: '1 ação', range: '18m', duration: '10 minutos',
    description: 'Muro de 18m×9m×3cm de 7 camadas coloridas. Cada camada tem efeito e fraqueza diferentes.',
    classes: ['wizard'],
  },
  {
    id: 'shapechange', name: 'Troca de Forma', level: 9, school: 'Transmutação',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Concentração, 1 hora',
    description: 'Transforma em qualquer criatura de NC ≤ nível, retendo sua personalidade e habilidades. Recupera HP ao mudar de forma.',
    classes: ['wizard', 'druid'],
  },
  {
    id: 'storm-of-vengeance', name: 'Tempestade de Vingança', level: 9, school: 'Conjuração',
    castingTime: '1 ação', range: 'Visível', duration: 'Concentração, 1 minuto',
    description: 'Nuvem de tempestade de raio 180m. Por turnos: raios (2d6 trovejante), ácido (1d6), granizo (2d6 contundente), vento (desvantagem em ataques).',
    damage: '2d6 trovejante',
    classes: ['druid', 'cleric'],
  },
  {
    id: 'time-stop', name: 'Parar o Tempo', level: 9, school: 'Transmutação',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Instantânea',
    description: 'Tempo para para todos exceto você. Age 1d4+1 turnos extras. Termina se afetar outra criatura.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'true-polymorph', name: 'Polimorfismo Verdadeiro', level: 9, school: 'Transmutação',
    castingTime: '1 ação', range: '9m', duration: 'Concentração, 1 hora',
    description: 'Transforma criatura ou objeto em qualquer criatura ou objeto de NC ≤ nível. Permanente se mantido por 1 hora.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock'],
  },
  {
    id: 'true-resurrection', name: 'Ressurreição Verdadeira', level: 9, school: 'Necromancia',
    castingTime: '1 hora', range: 'Toque', duration: 'Instantânea',
    description: 'Ressuscita criatura morta há ≤200 anos, restaurando o corpo completamente mesmo sem restos. 25.000 po em diamantes.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'weird', name: 'Horrores', level: 9, school: 'Ilusão',
    castingTime: '1 ação', range: '36m', duration: 'Concentração, 1 minuto',
    description: 'CD de Sabedoria ou criaturas em raio 9m ficam assustadas. No fim de cada turno: CD de Sabedoria ou 4d10 de dano psíquico.',
    damage: '4d10 psíquico',
    classes: ['wizard'],
  },
  {
    id: 'wish', name: 'Desejo', level: 9, school: 'Conjuração',
    castingTime: '1 ação', range: 'Pessoal', duration: 'Instantânea',
    description: 'A magia mais poderosa. Duplica qualquer outra magia ≤ 8°, ou solicita um efeito impossível ao universo. Risco de não poder conjurar Wish novamente.',
    classes: ['wizard', 'sorcerer'],
  },
];

export function getSpellDamage(spell: Spell, charLevel: number): string | null {
  if (!spell.damage) return null;
  if (!spell.cantripScale) return spell.damage;
  const mult = charLevel >= 17 ? 4 : charLevel >= 11 ? 3 : charLevel >= 5 ? 2 : 1;
  if (mult === 1) return spell.damage;
  return spell.damage.replace(/^(\d+)(d\d+)/, (_, n, d) => `${Number(n) * mult}${d}`);
}

/** Retorna o dano de uma magia nivelada quando conjurada num slot específico (upcast). */
export function getSpellDamageAtSlot(spell: Spell, slotLevel: number): string | null {
  if (!spell.damage) return null;
  // Cantrips não fazem upcast por slot
  if (spell.cantripScale) return null;
  // Sem dado de escala ou slot igual ao nível nativo → dano base
  if (!spell.upcastDice || slotLevel <= spell.level) return spell.damage;

  const extraLevels = slotLevel - spell.level;

  // Tenta somar os dados quando são do mesmo tipo (ex: '2d8 veneno' + '1d8' → '4d8 veneno')
  const baseParts = spell.damage.match(/^(\d+)(d\d+)(.*)/);
  const bonusParts = spell.upcastDice.match(/^(\d+)(d\d+)$/);

  if (baseParts && bonusParts && baseParts[2] === bonusParts[2]) {
    const totalN = Number(baseParts[1]) + Number(bonusParts[1]) * extraLevels;
    return `${totalN}${baseParts[2]}${baseParts[3]}`;
  }

  // Dados diferentes: mantém base e concatena bônus (ex: '5d6+5d6' para Destructive Wave)
  const bonusN = bonusParts ? Number(bonusParts[1]) * extraLevels : extraLevels;
  const bonusD = bonusParts ? bonusParts[2] : spell.upcastDice;
  return `${spell.damage} +${bonusN}${bonusD}`;
}

export const getSpellById = (id: string): Spell | undefined =>
  SPELLS.find((s) => s.id === id);

export const getSpellsByClass = (classId: string): Spell[] =>
  SPELLS.filter((s) => s.classes.includes(classId));

export const getSpellsByClassAndMaxLevel = (classId: string, maxLevel: number): Spell[] =>
  SPELLS.filter((s) => s.classes.includes(classId) && s.level <= maxLevel);
