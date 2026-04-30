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
    damage: '3d6 fogo',
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
    damage: '2d8 trovejante',
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
    damage: '3d10 necrótico',
    classes: ['cleric'],
  },
  {
    id: 'divine-smite', name: 'Golpe Divino', level: 1, school: 'Evocação',
    castingTime: '1 ação bônus', range: 'Pessoal', duration: 'Instantânea',
    description: 'Ao acertar com arma corpo a corpo, cause 2d8 de dano radiante extra (+1d8 por slot maior, +1d8 vs mortos-vivos).',
    damage: '2d8 radiante',
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
    damage: '3d8 trovejante',
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
    damage: '2d10 radiante',
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
    damage: '8d6 fogo',
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
    damage: '8d6 elétrico',
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
    damage: '3d10 elétrico',
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
    damage: '3d8 radiante',
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
    damage: '8d8 necrótico',
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
    damage: '8d8 frio',
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
];

export function getSpellDamage(spell: Spell, charLevel: number): string | null {
  if (!spell.damage) return null;
  if (!spell.cantripScale) return spell.damage;
  const mult = charLevel >= 17 ? 4 : charLevel >= 11 ? 3 : charLevel >= 5 ? 2 : 1;
  if (mult === 1) return spell.damage;
  return spell.damage.replace(/^(\d+)(d\d+)/, (_, n, d) => `${Number(n) * mult}${d}`);
}

export const getSpellById = (id: string): Spell | undefined =>
  SPELLS.find((s) => s.id === id);

export const getSpellsByClass = (classId: string): Spell[] =>
  SPELLS.filter((s) => s.classes.includes(classId));

export const getSpellsByClassAndMaxLevel = (classId: string, maxLevel: number): Spell[] =>
  SPELLS.filter((s) => s.classes.includes(classId) && s.level <= maxLevel);
