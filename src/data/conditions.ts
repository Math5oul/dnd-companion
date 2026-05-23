export type ConditionId =
  | 'blinded'
  | 'charmed'
  | 'deafened'
  | 'exhaustion'
  | 'frightened'
  | 'grappled'
  | 'incapacitated'
  | 'invisible'
  | 'paralyzed'
  | 'petrified'
  | 'poisoned'
  | 'prone'
  | 'restrained'
  | 'stunned'
  | 'unconscious';

export interface Condition {
  id: ConditionId;
  namePt: string;
  nameEn: string;
  icon: string;
  color: string;
  effectsPt: string[];
  effectsEn: string[];
}

export const CONDITIONS: Condition[] = [
  {
    id: 'blinded',
    namePt: 'Cego', nameEn: 'Blinded',
    icon: '🙈', color: '#888888',
    effectsPt: [
      'Falha automaticamente em testes de habilidade que dependam de visão.',
      'Jogadas de ataque contra a criatura têm vantagem.',
      'Jogadas de ataque da criatura têm desvantagem.',
    ],
    effectsEn: [
      'Auto-fails ability checks requiring sight.',
      'Attack rolls against have advantage.',
      'Attack rolls made have disadvantage.',
    ],
  },
  {
    id: 'charmed',
    namePt: 'Encantado', nameEn: 'Charmed',
    icon: '💘', color: '#ff69b4',
    effectsPt: [
      'Não pode atacar o encantador nem visá-lo com efeitos prejudiciais.',
      'O encantador tem vantagem em testes de habilidade social com a criatura.',
    ],
    effectsEn: [
      'Cannot attack the charmer or target them with harmful effects.',
      'The charmer has advantage on social ability checks against the creature.',
    ],
  },
  {
    id: 'deafened',
    namePt: 'Surdo', nameEn: 'Deafened',
    icon: '🔇', color: '#888888',
    effectsPt: [
      'Não consegue ouvir.',
      'Falha automaticamente em testes que dependam de audição.',
    ],
    effectsEn: [
      'Cannot hear.',
      'Auto-fails ability checks requiring hearing.',
    ],
  },
  {
    id: 'exhaustion',
    namePt: 'Exaustão', nameEn: 'Exhaustion',
    icon: '😩', color: '#b8860b',
    effectsPt: [
      'Nível 1: Desvantagem em testes de habilidade.',
      'Nível 2: Velocidade pela metade.',
      'Nível 3: Desvantagem em jogadas de ataque e JR.',
      'Nível 4: Máximo de HP pela metade.',
      'Nível 5: Velocidade 0.',
      'Nível 6: Morte.',
    ],
    effectsEn: [
      'Level 1: Disadvantage on ability checks.',
      'Level 2: Speed halved.',
      'Level 3: Disadvantage on attack rolls and saving throws.',
      'Level 4: HP maximum halved.',
      'Level 5: Speed 0.',
      'Level 6: Death.',
    ],
  },
  {
    id: 'frightened',
    namePt: 'Amedrontado', nameEn: 'Frightened',
    icon: '😨', color: '#9370db',
    effectsPt: [
      'Desvantagem em testes de habilidade e jogadas de ataque quando a fonte do medo estiver na linha de visão.',
      'Não pode se mover voluntariamente para mais perto da fonte do medo.',
    ],
    effectsEn: [
      'Disadvantage on ability checks and attack rolls while source of fear is in sight.',
      'Cannot willingly move closer to the source of fear.',
    ],
  },
  {
    id: 'grappled',
    namePt: 'Agarrado', nameEn: 'Grappled',
    icon: '🤼', color: '#cd853f',
    effectsPt: [
      'Velocidade 0.',
      'Termina se o agarrador ficar incapacitado ou se a criatura for afastada do alcance.',
    ],
    effectsEn: [
      'Speed 0.',
      'Ends if grappler is incapacitated or creature is moved out of reach.',
    ],
  },
  {
    id: 'incapacitated',
    namePt: 'Incapacitado', nameEn: 'Incapacitated',
    icon: '💫', color: '#ff8c00',
    effectsPt: [
      'Não pode realizar ações nem reações.',
    ],
    effectsEn: [
      'Cannot take actions or reactions.',
    ],
  },
  {
    id: 'invisible',
    namePt: 'Invisível', nameEn: 'Invisible',
    icon: '👻', color: '#aaaaaa',
    effectsPt: [
      'Impossível de ver sem magia ou sentido especial.',
      'Jogadas de ataque têm vantagem; jogadas de ataque contra têm desvantagem.',
    ],
    effectsEn: [
      'Impossible to see without magic or special sense.',
      'Attack rolls have advantage; attack rolls against have disadvantage.',
    ],
  },
  {
    id: 'paralyzed',
    namePt: 'Paralisado', nameEn: 'Paralyzed',
    icon: '⚡', color: '#ffff00',
    effectsPt: [
      'Incapacitado e não pode se mover ou falar.',
      'Falha automaticamente em JR de FOR e DES.',
      'Jogadas de ataque contra têm vantagem.',
      'Acertos a até 1,5m são automaticamente acertos críticos.',
    ],
    effectsEn: [
      'Incapacitated and cannot move or speak.',
      'Auto-fails STR and DEX saving throws.',
      'Attack rolls against have advantage.',
      'Hits within 5 ft are automatically critical.',
    ],
  },
  {
    id: 'petrified',
    namePt: 'Petrificado', nameEn: 'Petrified',
    icon: '🪨', color: '#808080',
    effectsPt: [
      'Transformado em substância sólida inanimada.',
      'Incapacitado, não pode se mover ou falar.',
      'Resistência a todos os danos.',
      'Imune a veneno e doença.',
      'Falha em JR de FOR e DES.',
      'Jogadas de ataque contra têm vantagem.',
    ],
    effectsEn: [
      'Transformed into inanimate solid substance.',
      'Incapacitated, cannot move or speak.',
      'Resistance to all damage.',
      'Immune to poison and disease.',
      'Fails STR and DEX saving throws.',
      'Attack rolls against have advantage.',
    ],
  },
  {
    id: 'poisoned',
    namePt: 'Envenenado', nameEn: 'Poisoned',
    icon: '🤢', color: '#32cd32',
    effectsPt: [
      'Desvantagem em jogadas de ataque e testes de habilidade.',
    ],
    effectsEn: [
      'Disadvantage on attack rolls and ability checks.',
    ],
  },
  {
    id: 'prone',
    namePt: 'Caído', nameEn: 'Prone',
    icon: '🧎', color: '#cd853f',
    effectsPt: [
      'Só pode se arrastar (custo duplo de movimento) ou gastar metade do movimento para se levantar.',
      'Desvantagem em jogadas de ataque.',
      'Ataques têm vantagem se o atacante estiver a 1,5m; caso contrário, desvantagem.',
    ],
    effectsEn: [
      'Can only crawl (double cost) or spend half speed to stand up.',
      'Disadvantage on attack rolls.',
      'Attacks have advantage if attacker is within 5 ft; otherwise disadvantage.',
    ],
  },
  {
    id: 'restrained',
    namePt: 'Contido', nameEn: 'Restrained',
    icon: '⛓️', color: '#c0a020',
    effectsPt: [
      'Velocidade 0.',
      'Desvantagem em jogadas de ataque.',
      'Jogadas de ataque contra têm vantagem.',
      'Desvantagem em JR de DES.',
    ],
    effectsEn: [
      'Speed 0.',
      'Disadvantage on attack rolls.',
      'Attack rolls against have advantage.',
      'Disadvantage on DEX saving throws.',
    ],
  },
  {
    id: 'stunned',
    namePt: 'Atordoado', nameEn: 'Stunned',
    icon: '🌀', color: '#4169e1',
    effectsPt: [
      'Incapacitado, não pode se mover.',
      'Só pode falar de forma vacilante.',
      'Falha em JR de FOR e DES.',
      'Jogadas de ataque contra têm vantagem.',
    ],
    effectsEn: [
      'Incapacitated, cannot move.',
      'Can only speak falteringly.',
      'Fails STR and DEX saving throws.',
      'Attack rolls against have advantage.',
    ],
  },
  {
    id: 'unconscious',
    namePt: 'Inconsciente', nameEn: 'Unconscious',
    icon: '💤', color: '#4682b4',
    effectsPt: [
      'Incapacitado, não pode se mover ou falar.',
      'Não tem consciência dos arredores.',
      'Larga o que estiver segurando e fica caído.',
      'Falha em JR de FOR e DES.',
      'Jogadas de ataque contra têm vantagem.',
      'Acertos a até 1,5m são críticos automáticos.',
    ],
    effectsEn: [
      'Incapacitated, cannot move or speak.',
      'Unaware of surroundings.',
      'Drops held items and falls prone.',
      'Fails STR and DEX saving throws.',
      'Attack rolls against have advantage.',
      'Hits within 5 ft are automatically critical.',
    ],
  },
];

export const CONDITION_MAP = Object.fromEntries(
  CONDITIONS.map((c) => [c.id, c]),
) as Record<ConditionId, Condition>;
