import type { FeatureAction, FeatureEffect } from '../types/featureEffect';

/**
 * Mapa de efeitos declarativos por feature ID.
 * Cada entrada descreve bônus de atributo, magias concedidas e ações usáveis.
 * Features sem entrada aqui são puramente descritivas (sem efeito mecânico rastreado).
 */
export const FEATURE_EFFECTS: Record<string, FeatureEffect> = {

  // ──────────────────────────────────────────────────────────────────────────
  // BÁRBARO
  // ──────────────────────────────────────────────────────────────────────────
  barbarian_rage: {
    // Resistências só aplicam enquanto o toggle de Furia estiver ativo
    resistances: ['bludgeoning', 'piercing', 'slashing'],
    actions: [{
      id: 'rage',
      namePt: 'Fúria', nameEn: 'Rage',
      descPt: 'Bônus de dano em ataques de FOR, resistência a dano físico, vantagem em FOR. Dura 1 minuto.',
      descEn: 'Bonus damage on STR attacks, resistance to physical damage, advantage on STR checks. Lasts 1 minute.',
      useType: 'long_rest', maxUses: 2,
      effectTag: 'rage', isToggle: true, activationCost: 'bonus',
    }],
  },
  barbarian_rage_3:  { resistances: ['bludgeoning', 'piercing', 'slashing'], actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Usos aumentados para 3.', descEn: 'Uses increased to 3.', useType: 'long_rest', maxUses: 3, effectTag: 'rage', isToggle: true, activationCost: 'bonus' }] },
  barbarian_rage_4:  { resistances: ['bludgeoning', 'piercing', 'slashing'], actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Usos aumentados para 4.', descEn: 'Uses increased to 4.', useType: 'long_rest', maxUses: 4, effectTag: 'rage', isToggle: true, activationCost: 'bonus' }] },
  barbarian_rage_5:  { resistances: ['bludgeoning', 'piercing', 'slashing'], actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Usos aumentados para 5.', descEn: 'Uses increased to 5.', useType: 'long_rest', maxUses: 5, effectTag: 'rage', isToggle: true, activationCost: 'bonus' }] },
  barbarian_rage_6:  { resistances: ['bludgeoning', 'piercing', 'slashing'], actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Usos ilimitados.', descEn: 'Unlimited uses.', useType: 'at_will', effectTag: 'rage', isToggle: true, activationCost: 'bonus' }] },
  barbarian_rage_unlimited: { resistances: ['bludgeoning', 'piercing', 'slashing'], actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Fúria Ilimitada.', descEn: 'Unlimited Rage.', useType: 'at_will', effectTag: 'rage', isToggle: true, activationCost: 'bonus' }] },

  // ──────────────────────────────────────────────────────────────────────────
  // BARDO
  // ──────────────────────────────────────────────────────────────────────────
  bard_bardic_inspiration_d6: {
    actions: [{
      id: 'bardic_inspiration',
      namePt: 'Inspiração Bárdica (d6)', nameEn: 'Bardic Inspiration (d6)',
      descPt: 'Conceda 1d6 de bônus à rolagem de um aliado como ação bônus. Usos = mod. de CAR por descanso curto.',
      descEn: 'Grant an ally 1d6 bonus to a roll as a bonus action. Uses = CHA mod per short rest.',
      useType: 'short_rest', maxUses: 3, damageDice: '1d6', activationCost: 'bonus',
    }],
  },
  bard_bardic_inspiration_d8: {
    actions: [{
      id: 'bardic_inspiration',
      namePt: 'Inspiração Bárdica (d8)', nameEn: 'Bardic Inspiration (d8)',
      descPt: 'Dado de inspiração aumentado para d8.',
      descEn: 'Inspiration die increased to d8.',
      useType: 'short_rest', maxUses: 3, damageDice: '1d8', activationCost: 'bonus',
    }],
  },
  bard_bardic_inspiration_d10: {
    actions: [{
      id: 'bardic_inspiration',
      namePt: 'Inspiração Bárdica (d10)', nameEn: 'Bardic Inspiration (d10)',
      descPt: 'Dado de inspiração aumentado para d10.',
      descEn: 'Inspiration die increased to d10.',
      useType: 'short_rest', maxUses: 3, damageDice: '1d10', activationCost: 'bonus',
    }],
  },
  bard_bardic_inspiration_d12: {
    actions: [{
      id: 'bardic_inspiration',
      namePt: 'Inspiração Bárdica (d12)', nameEn: 'Bardic Inspiration (d12)',
      descPt: 'Dado de inspiração aumentado para d12.',
      descEn: 'Inspiration die increased to d12.',
      useType: 'short_rest', maxUses: 4, damageDice: '1d12', activationCost: 'bonus',
    }],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLÉRIGO
  // ──────────────────────────────────────────────────────────────────────────
  cleric_channel_divinity_1: {
    actions: [{
      id: 'channel_divinity',
      namePt: 'Canalizar Divindade', nameEn: 'Channel Divinity',
      descPt: 'Canaliza energia divina. 1 uso por descanso curto.',
      descEn: 'Channel divine energy. 1 use per short rest.',
      useType: 'short_rest', maxUses: 1,
    }],
  },
  cleric_channel_divinity_2: {
    actions: [{
      id: 'channel_divinity',
      namePt: 'Canalizar Divindade (2x)', nameEn: 'Channel Divinity (2x)',
      descPt: '2 usos por descanso curto.',
      descEn: '2 uses per short rest.',
      useType: 'short_rest', maxUses: 2,
    }],
  },
  cleric_channel_divinity_3: {
    actions: [{
      id: 'channel_divinity',
      namePt: 'Canalizar Divindade (3x)', nameEn: 'Channel Divinity (3x)',
      descPt: '3 usos por descanso curto.',
      descEn: '3 uses per short rest.',
      useType: 'short_rest', maxUses: 3,
    }],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // DRUIDA
  // ──────────────────────────────────────────────────────────────────────────
  druid_wild_shape: {
    actions: [{
      id: 'wild_shape',
      namePt: 'Forma Selvagem', nameEn: 'Wild Shape',
      descPt: 'Transforme-se em um animal como ação. 2 usos por descanso curto.',
      descEn: 'Transform into a beast as an action. 2 uses per short rest.',
      useType: 'short_rest', maxUses: 2,
    }],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // GUERREIRO
  // ──────────────────────────────────────────────────────────────────────────
  fighter_second_wind: {
    actions: [{
      id: 'second_wind',
      namePt: 'Segundo Fôlego', nameEn: 'Second Wind',
      descPt: 'Ação bônus: recupere 1d10 + nível do guerreiro HP. 1 uso por descanso curto.',
      descEn: 'Bonus action: regain 1d10 + fighter level HP. 1 use per short rest.',
      useType: 'short_rest', maxUses: 1, damageDice: '1d10', activationCost: 'bonus',
    }],
  },
  fighter_action_surge_1: {
    actions: [{
      id: 'action_surge',
      namePt: 'Surto de Ação', nameEn: 'Action Surge',
      descPt: 'Ganhe uma ação extra neste turno. 1 uso por descanso curto.',
      descEn: 'Gain one extra action this turn. 1 use per short rest.',
      useType: 'short_rest', maxUses: 1,
      activationCost: 'free', grantsExtraActions: 1,
    }],
  },
  fighter_action_surge_2: {
    actions: [{
      id: 'action_surge',
      namePt: 'Surto de Ação (2x)', nameEn: 'Action Surge (2x)',
      descPt: '2 usos por descanso curto.',
      descEn: '2 uses per short rest.',
      useType: 'short_rest', maxUses: 2,
      activationCost: 'free', grantsExtraActions: 1,
    }],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // MONGE
  // ──────────────────────────────────────────────────────────────────────────
  monk_ki_2: {
    actions: [
      {
        id: 'ki_flurry',
        namePt: 'Torrente de Golpes', nameEn: 'Flurry of Blows',
        descPt: 'Gaste 1 ponto de ki: faça 2 ataques desarmados como ação bônus.',
        descEn: 'Spend 1 ki point: make 2 unarmed strikes as a bonus action.',
        useType: 'at_will', effectTag: 'ki_flurry', kiCost: 1, activationCost: 'bonus',
      },
      {
        id: 'ki_step',
        namePt: 'Passo do Vento', nameEn: 'Step of the Wind',
        descPt: 'Gaste 1 ponto de ki: Desviar ou Correr como ação bônus; salto dobrado.',
        descEn: 'Spend 1 ki point: Disengage or Dash as a bonus action; jump distance doubled.',
        useType: 'at_will', effectTag: 'ki_step', isToggle: true, kiCost: 1, activationCost: 'bonus',
      },
      {
        id: 'ki_defense',
        namePt: 'Defesa sem Armadura', nameEn: 'Patient Defense',
        descPt: 'Gaste 1 ponto de ki: Esquivar como ação bônus.',
        descEn: 'Spend 1 ki point: Dodge as a bonus action.',
        useType: 'at_will', effectTag: 'ki_dodge', isToggle: true, kiCost: 1, activationCost: 'bonus',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PALADINO
  // ──────────────────────────────────────────────────────────────────────────
  paladin_divine_sense: {
    actions: [{
      id: 'divine_sense',
      namePt: 'Sentido Divino', nameEn: 'Divine Sense',
      descPt: 'Detecte celestiais, aberrações e mortos-vivos a 18m até o fim do próximo turno. Usos = 1 + mod. de CAR.',
      descEn: 'Detect celestials, fiends, and undead within 60 ft until end of next turn. Uses = 1 + CHA mod.',
      useType: 'long_rest', maxUses: 3,
    }],
  },
  paladin_lay_on_hands: {
    actions: [{
      id: 'lay_on_hands',
      namePt: 'Impor as Mãos', nameEn: 'Lay on Hands',
      descPt: 'Recupere HP de um reservatório igual a 5 × nível do paladino. Ação.',
      descEn: 'Restore HP from a pool equal to 5 × paladin level. Action.',
      useType: 'long_rest', maxUses: 5,
    }],
  },
  paladin_aura_of_courage: {
    // Modelado como imunidade pessoal à condição; o efeito em aliados depende
    // de posição no mapa e será tratado quando houver sistema de aura por distância.
    conditionImmunities: ['frightened'],
  },
  paladin_cleansing_touch: {
    actions: [{
      id: 'cleansing_touch',
      namePt: 'Toque Purificador', nameEn: 'Cleansing Touch',
      descPt: 'Ação: termine um efeito mágico em você ou em um aliado tocado.',
      descEn: 'Action: end one spell effect on yourself or a touched ally.',
      // RAW usa mod. CHA (mínimo 1); por ora usamos baseline estável para rastreio.
      useType: 'long_rest', maxUses: 3,
    }],
  },
  oath_devotion: {
    actions: [
      {
        id: 'oath_devotion_sacred_weapon',
        namePt: 'Arma Sagrada', nameEn: 'Sacred Weapon',
        descPt: 'Canalizar Divindade: torne sua arma sagrada para melhorar suas jogadas de ataque por 1 minuto.',
        descEn: 'Channel Divinity: imbue your weapon with holy power to improve attack rolls for 1 minute.',
        useType: 'short_rest', maxUses: 1, activationCost: 'action',
      },
      {
        id: 'oath_devotion_turn_unholy',
        namePt: 'Repelir o Profano', nameEn: 'Turn the Unholy',
        descPt: 'Canalizar Divindade: afasta mortos-vivos e ínferos próximos.',
        descEn: 'Channel Divinity: turn nearby undead and fiends.',
        useType: 'short_rest', maxUses: 1, activationCost: 'action',
      },
    ],
  },
  oath_ancients: {
    actions: [
      {
        id: 'oath_ancients_natures_wrath',
        namePt: 'Ira da Natureza', nameEn: "Nature's Wrath",
        descPt: 'Canalizar Divindade: vinhas espectrais tentam conter um alvo próximo.',
        descEn: 'Channel Divinity: spectral vines attempt to restrain a nearby target.',
        useType: 'short_rest', maxUses: 1, activationCost: 'action',
      },
      {
        id: 'oath_ancients_turn_faithless',
        namePt: 'Afastar os Infiéis', nameEn: 'Turn the Faithless',
        descPt: 'Canalizar Divindade: expulsa fadas e ínferos próximos.',
        descEn: 'Channel Divinity: turn nearby fey and fiends.',
        useType: 'short_rest', maxUses: 1, activationCost: 'action',
      },
    ],
  },
  oath_vengeance: {
    actions: [
      {
        id: 'oath_vengeance_abjure_enemy',
        namePt: 'Abjurar Inimigo', nameEn: 'Abjure Enemy',
        descPt: 'Canalizar Divindade: assusta e desacelera um inimigo.',
        descEn: 'Channel Divinity: frighten and hinder an enemy.',
        useType: 'short_rest', maxUses: 1, activationCost: 'action',
      },
      {
        id: 'oath_vengeance_vow_enmity',
        namePt: 'Voto de Inimizade', nameEn: 'Vow of Enmity',
        descPt: 'Canalizar Divindade: ganha vantagem em ataques contra um alvo por 1 minuto.',
        descEn: 'Channel Divinity: gain advantage on attacks against one target for 1 minute.',
        useType: 'short_rest', maxUses: 1, activationCost: 'bonus',
      },
    ],
  },
  oath_conquest: {
    actions: [
      {
        id: 'oath_conquest_conquering_presence',
        namePt: 'Presença Conquistadora', nameEn: 'Conquering Presence',
        descPt: 'Canalizar Divindade: criaturas escolhidas próximas fazem teste ou ficam amedrontadas.',
        descEn: 'Channel Divinity: chosen nearby creatures save or become frightened.',
        useType: 'short_rest', maxUses: 1, activationCost: 'action',
      },
      {
        id: 'oath_conquest_guided_strike',
        namePt: 'Golpe Guiado', nameEn: 'Guided Strike',
        descPt: 'Canalizar Divindade: adicione +10 a uma jogada de ataque após rolar o d20.',
        descEn: 'Channel Divinity: add +10 to an attack roll after seeing the d20 roll.',
        useType: 'short_rest', maxUses: 1, activationCost: 'free',
      },
    ],
  },
  oath_redemption: {
    actions: [
      {
        id: 'oath_redemption_emissary_peace',
        namePt: 'Emissário da Paz', nameEn: 'Emissary of Peace',
        descPt: 'Canalizar Divindade: +5 em Persuasão por 10 minutos.',
        descEn: 'Channel Divinity: gain +5 to Persuasion checks for 10 minutes.',
        useType: 'short_rest', maxUses: 1, activationCost: 'action',
      },
      {
        id: 'oath_redemption_rebuke_violent',
        namePt: 'Repreender o Violento', nameEn: 'Rebuke the Violent',
        descPt: 'Canalizar Divindade (reação): reflita dano para um agressor próximo.',
        descEn: 'Channel Divinity (reaction): reflect damage to a nearby aggressor.',
        useType: 'short_rest', maxUses: 1, activationCost: 'reaction',
      },
    ],
  },
  oath_glory: {
    actions: [{
      id: 'oath_glory_inspiring_smite',
      namePt: 'Golpe Inspirador', nameEn: 'Inspiring Smite',
      descPt: 'Após Golpe Divino, distribua HP temporários entre aliados visíveis.',
      descEn: 'After Divine Smite, distribute temporary HP among visible allies.',
      useType: 'short_rest', maxUses: 1, activationCost: 'bonus',
    }],
  },
  oath_watchers: {
    actions: [{
      id: 'oath_watchers_abjure_extraplanar',
      namePt: 'Abjurar o Extraplanar', nameEn: 'Abjure the Extraplanar',
      descPt: 'Canalizar Divindade: força criatura extraplanar próxima a recuar/ficar incapacitada.',
      descEn: 'Channel Divinity: force a nearby extraplanar creature to retreat or become incapacitated.',
      useType: 'short_rest', maxUses: 1, activationCost: 'action',
    }],
  },
  oath_oathbreaker: {
    actions: [{
      id: 'oathbreaker_dreadful_aspect',
      namePt: 'Aspecto Aterrador', nameEn: 'Dreadful Aspect',
      descPt: 'Canalizar Divindade: criaturas escolhidas próximas fazem teste ou ficam amedrontadas.',
      descEn: 'Channel Divinity: chosen nearby creatures save or become frightened.',
      useType: 'short_rest', maxUses: 1, activationCost: 'action',
    }],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PATRULHEIRO
  // ──────────────────────────────────────────────────────────────────────────
  ranger_vanish: {
    actions: [{
      id: 'ranger_vanish',
      namePt: 'Desaparecer', nameEn: 'Vanish',
      descPt: 'Use Esconder como ação bônus.',
      descEn: 'Use Hide as a bonus action.',
      useType: 'at_will', activationCost: 'bonus',
    }],
  },
  ranger_hide_in_plain_sight: {
    actions: [{
      id: 'hide_in_plain_sight',
      namePt: 'Esconder-se à Vista', nameEn: 'Hide in Plain Sight',
      descPt: 'Gaste 1 minuto para criar camuflagem e ganhar +10 em Furtividade enquanto permanecer imóvel.',
      descEn: 'Spend 1 minute to camouflage and gain +10 Stealth while remaining still.',
      useType: 'at_will', activationCost: 'action',
    }],
  },
  ranger_l7_horizon_walker: {
    actions: [{
      id: 'ethereal_step',
      namePt: 'Passo Etéreo', nameEn: 'Ethereal Step',
      descPt: 'Ação bônus: entre no Plano Etéreo até o fim do turno.',
      descEn: 'Bonus action: enter the Ethereal Plane until end of turn.',
      useType: 'short_rest', maxUses: 1, activationCost: 'bonus',
    }],
  },
  ranger_l7_swarmkeeper: {
    actions: [{
      id: 'writhing_tide',
      namePt: 'Maré Retorcida', nameEn: 'Writhing Tide',
      descPt: 'Ação bônus: o enxame concede voo por 1 minuto. Recarrega no descanso longo.',
      descEn: 'Bonus action: your swarm grants flight for 1 minute. Recharges on long rest.',
      useType: 'long_rest', maxUses: 1, activationCost: 'bonus',
    }],
  },
  ranger_l7_fey_wanderer: {
    actions: [{
      id: 'beguiling_twist',
      namePt: 'Torção Sedutora', nameEn: 'Beguiling Twist',
      descPt: 'Reação: quando criatura próxima resistir a encanto/medo, redirecione o efeito para outro alvo em 9m.',
      descEn: 'Reaction: when a nearby creature resists charm/fear, redirect the effect to another target within 30 ft.',
      useType: 'at_will', activationCost: 'reaction',
    }],
  },
  ranger_l7_beast_master: {
    actions: [{
      id: 'exceptional_training',
      namePt: 'Treinamento Excepcional', nameEn: 'Exceptional Training',
      descPt: 'Ação bônus: ordene ao companheiro Dash, Disengage, Dodge ou Help; ataques dele contam como mágicos.',
      descEn: 'Bonus action: command companion to Dash, Disengage, Dodge, or Help; its attacks count as magical.',
      useType: 'at_will', activationCost: 'bonus',
    }],
  },
  ranger_l7_gloom_stalker: {
    actions: [{
      id: 'iron_mind',
      namePt: 'Mente de Ferro', nameEn: 'Iron Mind',
      descPt: 'Passiva: fortalece suas resistências mentais (proficiência em Sabedoria, ou INT/CHA se já tiver).',
      descEn: 'Passive: strengthens your mental defenses (Wisdom save proficiency, or INT/CHA if already proficient).',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_l7_hunter: {
    actions: [{
      id: 'defensive_tactics',
      namePt: 'Táticas Defensivas', nameEn: 'Defensive Tactics',
      descPt: 'Escolha um modo defensivo: evitar ataques de oportunidade, +4 CA contra multiataque, ou vantagem contra medo.',
      descEn: 'Choose a defensive mode: avoid opportunity attacks, +4 AC versus multiattack, or advantage against fear.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_l7_monster_slayer: {
    actions: [{
      id: 'supernatural_defense',
      namePt: 'Defesa Sobrenatural', nameEn: 'Supernatural Defense',
      descPt: 'Reação/defesa contra sua presa: adicione 1d6 em resistências e proteção contra ataques dela.',
      descEn: 'Defensive reaction against your prey: add 1d6 to saves and protection against its attacks.',
      useType: 'at_will', damageDice: '1d6', activationCost: 'reaction',
    }],
  },
  ranger_l11_horizon_walker: {
    actions: [{
      id: 'distant_strike',
      namePt: 'Golpe Distante', nameEn: 'Distant Strike',
      descPt: 'Ao atacar, pode se teletransportar 3m antes de cada ataque; se atingir alvos diferentes, ganha um terceiro ataque.',
      descEn: 'When attacking, you can teleport 10 ft before each attack; if you hit different targets, gain a third attack.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_l11_hunter: {
    actions: [{
      id: 'hunter_multiattack',
      namePt: 'Multiataque do Caçador', nameEn: 'Hunter Multiattack',
      descPt: 'Escolha: Volley (ataque à distância em área) ou Whirlwind Attack (ataque corpo-a-corpo em todas criaturas em alcance).',
      descEn: 'Choose: Volley (ranged area attack) or Whirlwind Attack (melee attack against all creatures in reach).',
      useType: 'at_will', activationCost: 'action',
    }],
  },
  ranger_l11_gloom_stalker: {
    actions: [{
      id: 'stalkers_flurry',
      namePt: 'Rajada do Espreitador', nameEn: "Stalker's Flurry",
      descPt: 'Uma vez por turno, quando errar um ataque, pode fazer outro ataque imediatamente com a mesma arma.',
      descEn: 'Once per turn, when you miss an attack, you can make another attack immediately with the same weapon.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_l11_monster_slayer: {
    actions: [{
      id: 'slayers_counter',
      namePt: 'Contragolpe do Caçador', nameEn: "Slayer's Counter",
      descPt: 'Reação: quando sua presa forçar resistência, ataque-a; se acertar, o dano pode interromper o efeito.',
      descEn: 'Reaction: when your prey forces a saving throw, attack it; on hit, the damage may interrupt the effect.',
      useType: 'at_will', activationCost: 'reaction',
    }],
  },
  ranger_l11_beast_master: {
    actions: [{
      id: 'beasts_defense',
      namePt: 'Defesa da Fera', nameEn: "Beast's Defense",
      descPt: 'Passiva: enquanto o companheiro puder vê-lo, ele recebe vantagem em testes de resistência.',
      descEn: 'Passive: while your companion can see you, it has advantage on saving throws.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_l11_swarmkeeper: {
    actions: [{
      id: 'mighty_swarm',
      namePt: 'Enxame Poderoso', nameEn: 'Mighty Swarm',
      descPt: 'Passiva: aprimora o Gathered Swarm para empurrar/derrubar e impor desvantagem em ataques.',
      descEn: 'Passive: enhances Gathered Swarm to push/knock and impose disadvantage on attacks.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_l15_gloom_stalker: {
    actions: [{
      id: 'shadowy_dodge',
      namePt: 'Esquiva Sombria', nameEn: 'Shadowy Dodge',
      descPt: 'Reação ao ser atacado: imponha desvantagem no ataque contra você.',
      descEn: 'Reaction when targeted by an attack: impose disadvantage on the attack against you.',
      useType: 'at_will', activationCost: 'reaction',
    }],
  },
  ranger_l15_hunter: {
    actions: [{
      id: 'stand_against_the_tide',
      namePt: 'Resistir à Maré', nameEn: 'Stand Against the Tide',
      descPt: 'Reação quando um inimigo errar você em corpo a corpo: force-o a atacar outro alvo em alcance.',
      descEn: 'Reaction when a melee attack misses you: force the attacker to target another creature in range.',
      useType: 'at_will', activationCost: 'reaction',
    }],
  },
  ranger_l15_horizon_walker: {
    actions: [{
      id: 'spectral_defense',
      namePt: 'Defesa Espectral', nameEn: 'Spectral Defense',
      descPt: 'Reação ao sofrer dano de ataque: ganhe resistência a todos os danos desse ataque.',
      descEn: 'Reaction when hit by an attack: gain resistance to all damage from that attack.',
      useType: 'at_will', activationCost: 'reaction',
    }],
  },
  ranger_l15_monster_slayer: {
    actions: [{
      id: 'slayers_prey_advanced',
      namePt: 'Presa do Caçador (Aprimorado)', nameEn: "Slayer's Prey (Advanced)",
      descPt: 'Pode marcar um segundo alvo sem gastar ação bônus; quando o primeiro cair, o segundo é marcado automaticamente.',
      descEn: 'You can mark a second target without a bonus action; when the first falls, the second is marked automatically.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_l15_beast_master: {
    actions: [{
      id: 'share_spells',
      namePt: 'Compartilhar Magias', nameEn: 'Share Spells',
      descPt: 'Passiva: magias que afetam apenas você podem também afetar seu companheiro em alcance.',
      descEn: 'Passive: spells that affect only you can also affect your companion within range.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_l15_fey_wanderer: {
    actions: [{
      id: 'fey_reinforcements',
      namePt: 'Reforços Feéricos', nameEn: 'Fey Reinforcements',
      descPt: 'Ação: conjure Summon Fey sem concentração por 1 minuto. Recarrega no descanso longo.',
      descEn: 'Action: cast Summon Fey without concentration for 1 minute. Recharges on long rest.',
      useType: 'long_rest', maxUses: 1, activationCost: 'action',
    }],
  },
  ranger_l15_swarmkeeper: {
    actions: [{
      id: 'swarming_dispersal',
      namePt: 'Dispersão do Enxame', nameEn: 'Swarming Dispersal',
      descPt: 'Reação ao sofrer dano: reduza o impacto com o enxame e teleporte-se até 9m.',
      descEn: 'Reaction when taking damage: mitigate the impact with your swarm and teleport up to 30 ft.',
      useType: 'at_will', activationCost: 'reaction',
    }],
  },
  ranger_feral_senses: {
    actions: [{
      id: 'feral_senses',
      namePt: 'Sentidos Ferozes', nameEn: 'Feral Senses',
      descPt: 'Passiva: detecta criaturas invisíveis próximas mesmo sem vê-las diretamente.',
      descEn: 'Passive: detect nearby invisible creatures even without direct sight.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_foe_slayer: {
    actions: [{
      id: 'foe_slayer',
      namePt: 'Assassino de Inimigos', nameEn: 'Foe Slayer',
      descPt: 'Passiva: uma vez por turno, adicione seu modificador de Sabedoria em ataque ou dano contra Inimigo Favorito.',
      descEn: 'Passive: once per turn, add your Wisdom modifier to attack or damage against a Favored Enemy.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_extra_attack: {
    actions: [{
      id: 'ranger_extra_attack',
      namePt: 'Ataque Extra', nameEn: 'Extra Attack',
      descPt: 'Quando usar a ação Atacar, pode atacar duas vezes.',
      descEn: 'When you take the Attack action, you can attack twice.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_favored_enemy: {
    actions: [{
      id: 'favored_enemy',
      namePt: 'Inimigo Favorito', nameEn: 'Favored Enemy',
      descPt: 'Passiva: vantagem para rastrear e recordar informações sobre o tipo de criatura escolhido, além de aprender um idioma associado.',
      descEn: 'Passive: advantage to track and recall information about the chosen creature type, plus learn an associated language.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_favored_enemy_2: {
    actions: [{
      id: 'favored_enemy_2',
      namePt: 'Inimigo Favorito (2°)', nameEn: 'Favored Enemy (2nd)',
      descPt: 'Passiva: adiciona um segundo tipo de inimigo favorito e idioma associado.',
      descEn: 'Passive: adds a second favored enemy type and associated language.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_favored_enemy_3: {
    actions: [{
      id: 'favored_enemy_3',
      namePt: 'Inimigo Favorito (3°)', nameEn: 'Favored Enemy (3rd)',
      descPt: 'Passiva: adiciona um terceiro tipo de inimigo favorito e idioma associado.',
      descEn: 'Passive: adds a third favored enemy type and associated language.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_natural_explorer: {
    actions: [{
      id: 'natural_explorer',
      namePt: 'Explorador Natural', nameEn: 'Natural Explorer',
      descPt: 'Passiva: escolha um terreno favorito para navegar, rastrear e sobreviver com mais eficiência.',
      descEn: 'Passive: choose a favored terrain to travel, track, and survive more efficiently.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_natural_explorer_2: {
    actions: [{
      id: 'natural_explorer_2',
      namePt: 'Explorador Natural (2° terreno)', nameEn: 'Natural Explorer (2nd terrain)',
      descPt: 'Passiva: adiciona um segundo terreno favorito para benefícios de exploração.',
      descEn: 'Passive: adds a second favored terrain for exploration benefits.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_natural_explorer_3: {
    actions: [{
      id: 'natural_explorer_3',
      namePt: 'Explorador Natural (3° terreno)', nameEn: 'Natural Explorer (3rd terrain)',
      descPt: 'Passiva: adiciona um terceiro terreno favorito para benefícios de exploração.',
      descEn: 'Passive: adds a third favored terrain for exploration benefits.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_fighting_style: {
    actions: [{
      id: 'ranger_fighting_style_passive',
      namePt: 'Estilo de Combate (passivo)', nameEn: 'Fighting Style (passive)',
      descPt: 'Passiva: marco de escolha de estilo de combate do patrulheiro.',
      descEn: 'Passive: ranger fighting style selection milestone.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_spellcasting: {
    actions: [{
      id: 'ranger_spellcasting_passive',
      namePt: 'Conjuração de Magias (passivo)', nameEn: 'Spellcasting (passive)',
      descPt: 'Passiva: habilita conjuração de magias de patrulheiro baseada em Sabedoria.',
      descEn: 'Passive: enables Wisdom-based ranger spellcasting.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_spells_3rd: {
    actions: [{
      id: 'ranger_spells_3rd_passive',
      namePt: 'Magias de 3° Nível (passivo)', nameEn: '3rd-Level Spells (passive)',
      descPt: 'Passiva: acesso a espaços de magia de 3° nível.',
      descEn: 'Passive: access to 3rd-level spell slots.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_spells_4th: {
    actions: [{
      id: 'ranger_spells_4th_passive',
      namePt: 'Magias de 4° Nível (passivo)', nameEn: '4th-Level Spells (passive)',
      descPt: 'Passiva: acesso a espaços de magia de 4° nível.',
      descEn: 'Passive: access to 4th-level spell slots.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_spells_5th: {
    actions: [{
      id: 'ranger_spells_5th_passive',
      namePt: 'Magias de 5° Nível (passivo)', nameEn: '5th-Level Spells (passive)',
      descPt: 'Passiva: acesso a espaços de magia de 5° nível.',
      descEn: 'Passive: access to 5th-level spell slots.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_spells_bonus: {
    actions: [{
      id: 'ranger_spells_bonus_passive',
      namePt: 'Magias Bônus de Patrulheiro (passivo)', nameEn: 'Ranger Bonus Spells (passive)',
      descPt: 'Passiva: marca progressão de magias bônus concedidas por feature/subclasse.',
      descEn: 'Passive: marks progression of bonus spells granted by features/subclass.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  // Ranger ASI markers/options are handled by derived rules and characterStore
  // auto-ASI merge, but explicit keys keep static coverage complete.
  ranger_asi_4: {},
  ranger_asi_8: {},
  ranger_asi_12: {},
  ranger_asi_16: {},
  ranger_asi_19: {},
  ranger_asi4_dex2: {},
  ranger_asi4_wis2: {},
  ranger_asi4_dex1wis1: {},
  ranger_asi4_feat_sharpshooter: {},
  ranger_asi4_feat_crossbow: {},
  ranger_asi4_feat_mobile: {},
  ranger_asi8_dex2: {},
  ranger_asi8_wis2: {},
  ranger_asi8_dex1wis1: {},
  ranger_asi8_feat_sharpshooter: {},
  ranger_asi8_feat_alert: {},
  ranger_asi8_feat_lucky: {},
  ranger_asi12_dex2: {},
  ranger_asi12_wis2: {},
  ranger_asi12_dex1wis1: {},
  ranger_asi12_feat_sharpshooter: {},
  ranger_asi12_feat_resilient: {},
  ranger_asi12_feat_tough: {},
  ranger_asi16_dex2: {},
  ranger_asi16_wis2: {},
  ranger_asi16_dex1wis1: {},
  ranger_asi16_feat_sharpshooter: {},
  ranger_asi16_feat_alert: {},
  ranger_asi16_feat_lucky: {},
  ranger_asi19_dex2: {},
  ranger_asi19_wis2: {},
  ranger_asi19_dex1wis1: {},
  ranger_asi19_feat_sharpshooter: {},
  ranger_asi19_feat_alert: {},
  ranger_asi19_feat_lucky: {},
  ranger_primeval_awareness: {
    actions: [{
      id: 'primeval_awareness',
      namePt: 'Consciência Primeva', nameEn: 'Primeval Awareness',
      descPt: 'Ação: gaste um espaço de magia para detectar inimigos favoritos a longa distância por 1 minuto por nível do espaço.',
      descEn: 'Action: expend a spell slot to detect favored enemies at long range for 1 minute per slot level.',
      useType: 'at_will', activationCost: 'action',
    }],
  },
  ranger_lands_stride: {
    actions: [{
      id: 'lands_stride',
      namePt: 'Passada da Terra', nameEn: 'Lands Stride',
      descPt: 'Passiva: terreno difícil não mágico não custa movimento extra; atravessa vegetação não mágica sem redução.',
      descEn: 'Passive: nonmagical difficult terrain costs no extra movement; nonmagical plants do not slow you.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_archetype: {
    actions: [{
      id: 'ranger_archetype_passive',
      namePt: 'Conclave de Patrulheiro (passivo)', nameEn: 'Ranger Conclave (passive)',
      descPt: 'Passiva: define seu conclave e habilita as features especificas dos niveis 3, 7, 11 e 15.',
      descEn: 'Passive: defines your conclave and enables subclass features at levels 3, 7, 11, and 15.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_conclave_feature_7: {
    actions: [{
      id: 'ranger_conclave_feature_7_passive',
      namePt: 'Feature do Conclave (7) (passivo)', nameEn: 'Conclave Feature (7) (passive)',
      descPt: 'Passiva: marco de subclass do nivel 7 do patrulheiro.',
      descEn: 'Passive: ranger subclass milestone at level 7.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_conclave_feature_11: {
    actions: [{
      id: 'ranger_conclave_feature_11_passive',
      namePt: 'Feature do Conclave (11) (passivo)', nameEn: 'Conclave Feature (11) (passive)',
      descPt: 'Passiva: marco de subclass do nivel 11 do patrulheiro.',
      descEn: 'Passive: ranger subclass milestone at level 11.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_conclave_feature_15: {
    actions: [{
      id: 'ranger_conclave_feature_15_passive',
      namePt: 'Feature do Conclave (15) (passivo)', nameEn: 'Conclave Feature (15) (passive)',
      descPt: 'Passiva: marco de subclass do nivel 15 do patrulheiro.',
      descEn: 'Passive: ranger subclass milestone at level 15.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_style_archery: {
    actions: [{
      id: 'ranger_style_archery_passive',
      namePt: 'Arqueirismo (passivo)', nameEn: 'Archery (passive)',
      descPt: 'Passiva: +2 nas jogadas de ataque com armas a distancia.',
      descEn: 'Passive: +2 bonus to attack rolls with ranged weapons.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_style_defense: {
    actions: [{
      id: 'ranger_style_defense_passive',
      namePt: 'Defesa (passivo)', nameEn: 'Defense (passive)',
      descPt: 'Passiva: +1 na CA enquanto estiver usando armadura.',
      descEn: 'Passive: +1 AC while wearing armor.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_style_dueling: {
    actions: [{
      id: 'ranger_style_dueling_passive',
      namePt: 'Duelo (passivo)', nameEn: 'Dueling (passive)',
      descPt: 'Passiva: +2 de dano com arma corpo a corpo empunhada em uma mao.',
      descEn: 'Passive: +2 damage with one-handed melee weapon attacks.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_style_two_weapon: {
    actions: [{
      id: 'ranger_style_two_weapon_passive',
      namePt: 'Duas Armas (passivo)', nameEn: 'Two-Weapon Fighting (passive)',
      descPt: 'Passiva: adiciona modificador no dano do ataque com a segunda arma.',
      descEn: 'Passive: add ability modifier to off-hand attack damage.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_style_thrown_weapon: {
    actions: [{
      id: 'ranger_style_thrown_weapon_passive',
      namePt: 'Armas de Arremesso (passivo)', nameEn: 'Thrown Weapon Fighting (passive)',
      descPt: 'Passiva: +1 de dano com ataques de arremesso e sacar arma de arremesso como parte do ataque.',
      descEn: 'Passive: +1 damage with thrown attacks and draw thrown weapon as part of the attack.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  ranger_style_blind_fighting: {
    actions: [{
      id: 'ranger_style_blind_fighting_passive',
      namePt: 'Combate as Cegas (passivo)', nameEn: 'Blind Fighting (passive)',
      descPt: 'Passiva: percepcao cega em 3 metros.',
      descEn: 'Passive: blindsight within 10 feet.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // BRUXO
  // ──────────────────────────────────────────────────────────────────────────
  warlock_pact_magic: {
    // Alguns personagens antigos não recebem o truque automaticamente via UI,
    // então garantimos aqui a concessão mecânica da magia.
    grantedSpells: ['eldritch-blast'],
  },
  wlock_inv_armor_shadows: { grantedSpells: ['mage-armor'] },
  wlock_inv_fiendish_vigor: { grantedSpells: ['false-life'] },
  wlock_inv_mask_many_faces: { grantedSpells: ['disguise-self'] },
  wlock_inv_misty_visions: { grantedSpells: ['silent-image'] },
  wlock_inv3_mire_mind: { grantedSpells: ['slow'] },
  wlock_inv3_chains_carceri: { grantedSpells: ['hold-monster'] },
  wlock_inv5_mire_mind: { grantedSpells: ['slow'] },
  wlock_inv5_sign_ill_omen: { grantedSpells: ['bestow-curse'] },
  wlock_inv5_dreadful_word: { grantedSpells: ['confusion'] },
  wlock_inv5_sculptor_flesh: { grantedSpells: ['flesh-to-stone'] },
  wlock_inv7_bewitching_whispers: { grantedSpells: ['compulsion'] },
  wlock_inv7_sculptor_flesh: { grantedSpells: ['polymorph'] },
  wlock_inv7_trickster_escape: { grantedSpells: ['freedom-of-movement'] },
  wlock_inv9_ascendant_step: { grantedSpells: ['levitate'] },
  wlock_inv9_otherworldly_leap: { grantedSpells: ['jump'] },
  wlock_inv9_whispers_grave: { grantedSpells: ['speak-with-dead'] },
  wlock_inv9_minions_chaos: { grantedSpells: ['conjure-elemental'] },
  wlock_inv11_shroud_shadow: { grantedSpells: ['invisibility'] },
  wlock_inv11_master_myriad_forms: { grantedSpells: ['alter-self'] },
  wlock_inv11_visions_distant: { grantedSpells: ['arcane-eye'] },
  wlock_inv11_chains_carceri: { grantedSpells: ['hold-monster'] },
  wlock_inv15_shroud_shadow: { grantedSpells: ['invisibility'] },
  wlock_inv15_chains_carceri: { grantedSpells: ['hold-monster'] },
  wlock_inv15_master_forms: { grantedSpells: ['alter-self'] },
  wlock_inv15_visions: { grantedSpells: ['arcane-eye'] },
  wlock_inv18_shroud_shadow: { grantedSpells: ['invisibility'] },
  wlock_inv18_master_forms: { grantedSpells: ['alter-self'] },
  wlock_inv18_visions: { grantedSpells: ['arcane-eye'] },
  wlock_inv18_chains: { grantedSpells: ['hold-monster'] },

  // Patronos de Bruxo — traits que antes eram só textuais
  wlock_l6_archfey: {
    actions: [{
      id: 'misty_escape',
      namePt: 'Fuga Enevoada', nameEn: 'Misty Escape',
      descPt: 'Reação ao sofrer dano: fica invisível e se teleporta até 18m. Recarrega no descanso curto.',
      descEn: 'Reaction when taking damage: become invisible and teleport up to 60 ft. Recharges on short rest.',
      useType: 'short_rest', maxUses: 1, activationCost: 'reaction',
    }],
  },
  wlock_l6_fiend: {
    actions: [{
      id: 'dark_ones_own_luck',
      namePt: 'Sorte do Demônio', nameEn: "Dark One's Own Luck",
      descPt: 'Reação: adicione 1d10 a um teste de atributo ou resistência. Recarrega no descanso curto.',
      descEn: 'Reaction: add 1d10 to an ability check or saving throw. Recharges on short rest.',
      useType: 'short_rest', maxUses: 1, damageDice: '1d10', activationCost: 'reaction',
    }],
  },
  wlock_l6_goo: {
    actions: [{
      id: 'entropic_ward',
      namePt: 'Proteção Entrópica', nameEn: 'Entropic Ward',
      descPt: 'Reação: imponha desvantagem em um ataque contra você; se errar, você ganha vantagem no próximo ataque contra o alvo. Recarrega no descanso curto.',
      descEn: 'Reaction: impose disadvantage on one attack against you; if it misses, you gain advantage on your next attack against that target. Recharges on short rest.',
      useType: 'short_rest', maxUses: 1, activationCost: 'reaction',
    }],
  },
  wlock_l6_fathomless: { resistances: ['cold'] },
  wlock_l10_goo: { resistances: ['psychic'] },
  wlock_l10_celestial: { resistances: ['necrotic', 'radiant'] },
  wlock_l10_archfey: { conditionImmunities: ['charmed'] },

  wlock_l14_fathomless: { grantedSpells: ['evards-black-tentacles'] },
  conclave_horizon_walker: { grantedSpells: ['misty-step'] },
  ranger_l11_fey_wanderer: { grantedSpells: ['misty-step'] },

  // ──────────────────────────────────────────────────────────────────────────
  // LADINO
  // ──────────────────────────────────────────────────────────────────────────
  rogue_archetype: {
    actions: [{
      id: 'rogue_archetype_passive',
      namePt: 'Arquetipo de Ladino (passivo)', nameEn: 'Rogue Archetype (passive)',
      descPt: 'Passiva: define seu arquetipo e habilita features especificas nos niveis 3, 9, 13 e 17.',
      descEn: 'Passive: defines your archetype and enables subclass features at levels 3, 9, 13, and 17.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_archetype_feature_9: {
    actions: [{
      id: 'rogue_archetype_feature_9_passive',
      namePt: 'Feature do Arquetipo (9) (passivo)', nameEn: 'Archetype Feature (9) (passive)',
      descPt: 'Passiva: marco de subclass do nivel 9 do ladino.',
      descEn: 'Passive: rogue subclass milestone at level 9.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_archetype_feature_13: {
    actions: [{
      id: 'rogue_archetype_feature_13_passive',
      namePt: 'Feature do Arquetipo (13) (passivo)', nameEn: 'Archetype Feature (13) (passive)',
      descPt: 'Passiva: marco de subclass do nivel 13 do ladino.',
      descEn: 'Passive: rogue subclass milestone at level 13.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_archetype_feature_17: {
    actions: [{
      id: 'rogue_archetype_feature_17_passive',
      namePt: 'Feature do Arquetipo (17) (passivo)', nameEn: 'Archetype Feature (17) (passive)',
      descPt: 'Passiva: marco de subclass do nivel 17 do ladino.',
      descEn: 'Passive: rogue subclass milestone at level 17.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  // Rogue ASI markers/options are handled by derived feat rules and ASI logic.
  rogue_asi_4: {},
  rogue_asi_8: {},
  rogue_asi_10: {},
  rogue_asi_12: {},
  rogue_asi_16: {},
  rogue_asi_19: {},
  rogue_asi4_dex2: {},
  rogue_asi4_int2: {},
  rogue_asi4_dex1int1: {},
  rogue_asi4_feat_skulker: {},
  rogue_asi4_feat_alert: {},
  rogue_asi4_feat_mobile: {},
  rogue_asi8_dex2: {},
  rogue_asi8_int2: {},
  rogue_asi8_dex1int1: {},
  rogue_asi8_feat_skulker: {},
  rogue_asi8_feat_lucky: {},
  rogue_asi8_feat_resilient: {},
  rogue_asi10_dex2: {},
  rogue_asi10_int2: {},
  rogue_asi10_dex1int1: {},
  rogue_asi10_feat_alert: {},
  rogue_asi10_feat_mobile: {},
  rogue_asi10_feat_lucky: {},
  rogue_asi12_dex2: {},
  rogue_asi12_int2: {},
  rogue_asi12_dex1int1: {},
  rogue_asi12_feat_skulker: {},
  rogue_asi12_feat_lucky: {},
  rogue_asi12_feat_resilient: {},
  rogue_asi16_dex2: {},
  rogue_asi16_int2: {},
  rogue_asi16_dex1int1: {},
  rogue_asi16_feat_alert: {},
  rogue_asi16_feat_lucky: {},
  rogue_asi16_feat_mobile: {},
  rogue_asi19_dex2: {},
  rogue_asi19_int2: {},
  rogue_asi19_dex1int1: {},
  rogue_asi19_feat_alert: {},
  rogue_asi19_feat_lucky: {},
  rogue_asi19_feat_resilient: {},
  rogue_arch_arcane_trickster: {
    // Arcane Trickster recebe Mage Hand como parte central do arquétipo.
    grantedSpells: ['mage-hand'],
  },
  rogue_l9_inquisitive: {
    actions: [{
      id: 'unerring_eye',
      namePt: 'Olho Infalível', nameEn: 'Unerring Eye',
      descPt: 'Ação: detecte ilusões, disfarces mágicos e transmutações em 9m. Usos por descanso longo.',
      descEn: 'Action: detect illusions, magical disguises, and transmutations within 30 ft. Uses per long rest.',
      useType: 'long_rest', maxUses: 3, activationCost: 'action',
    }],
  },
  rogue_l9_arcane_trickster: {
    actions: [{
      id: 'magical_ambush',
      namePt: 'Emboscada Mágica', nameEn: 'Magical Ambush',
      descPt: 'Enquanto escondido, magias que você conjura impõem desvantagem na resistência do alvo.',
      descEn: 'While hidden, spells you cast impose disadvantage on the target\'s saving throw.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l9_mastermind: {
    actions: [{
      id: 'master_of_intrigue',
      namePt: 'Mestre da Intriga', nameEn: 'Master of Intrigue',
      descPt: 'Ação utilitária: imite sotaques e use talentos de disfarce/falsificação para infiltração social.',
      descEn: 'Utility action: mimic speech and leverage disguise/forgery talents for social infiltration.',
      useType: 'at_will', activationCost: 'action',
    }],
  },
  rogue_l9_thief: {
    actions: [{
      id: 'supreme_sneak',
      namePt: 'Furtividade Suprema', nameEn: 'Supreme Sneak',
      descPt: 'Passiva: vantagem em Furtividade quando se mover até metade do deslocamento no turno.',
      descEn: 'Passive: advantage on Stealth when moving up to half speed during the turn.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l9_assassin: {
    actions: [{
      id: 'infiltration_expertise',
      namePt: 'Especialista em Infiltração', nameEn: 'Infiltration Expertise',
      descPt: 'Ação de preparo: construa identidade falsa convincente para infiltração prolongada.',
      descEn: 'Preparation action: build a convincing false identity for long-term infiltration.',
      useType: 'at_will', activationCost: 'action',
    }],
  },
  rogue_l9_scout: {
    speedBonus: 10,
    actions: [{
      id: 'superior_mobility',
      namePt: 'Mobilidade Superior', nameEn: 'Superior Mobility',
      descPt: 'Passiva: +3m de deslocamento; ao usar Dash, evita ataques de oportunidade.',
      descEn: 'Passive: +10 ft speed; when using Dash, you avoid opportunity attacks.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l9_phantom: {
    actions: [{
      id: 'tokens_of_the_departed',
      namePt: 'Fragmentos dos Partidos', nameEn: 'Tokens of the Departed',
      descPt: 'Passiva/ação utilitária: capture fragmentos de alma para ganhar benefícios situacionais.',
      descEn: 'Passive/utility action: capture soul trinkets to gain situational benefits.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_expertise: {
    actions: [{
      id: 'expertise',
      namePt: 'Especialização', nameEn: 'Expertise',
      descPt: 'Passiva: escolha duas perícias para dobrar a proficiência.',
      descEn: 'Passive: choose two skills to double your proficiency bonus.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_expertise_2: {
    actions: [{
      id: 'expertise_2',
      namePt: 'Especialização (2ª)', nameEn: 'Expertise (2nd)',
      descPt: 'Passiva: escolha mais duas perícias para dobrar a proficiência.',
      descEn: 'Passive: choose two more skills to double your proficiency bonus.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_thieves_cant: {
    actions: [{
      id: 'thieves_cant',
      namePt: 'Linguagem dos Ladrões', nameEn: "Thieves' Cant",
      descPt: 'Passiva: você conhece a linguagem secreta dos ladrões e mensagens ocultas.',
      descEn: 'Passive: you know the secret language of thieves and hidden messages.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l9_soulknife: {
    actions: [{
      id: 'psychic_teleportation',
      namePt: 'Teleporte Psíquico', nameEn: 'Psychic Teleportation',
      descPt: 'Ação bônus: gaste um dado psi e teleporte-se usando uma Lâmina Psíquica arremessada como foco.',
      descEn: 'Bonus action: spend a psionic die and teleport using a thrown Psychic Blade as focus.',
      useType: 'short_rest', maxUses: 3, activationCost: 'bonus',
    }],
  },
  rogue_l13_soulknife: {
    actions: [{
      id: 'psychic_veil',
      namePt: 'Véu Psíquico', nameEn: 'Psychic Veil',
      descPt: 'Ação: fique invisível por até 1 hora (ou até atacar/conjurar/forçar resistência).',
      descEn: 'Action: become invisible for up to 1 hour (or until you attack/cast/force a save).',
      useType: 'long_rest', maxUses: 1, activationCost: 'action',
    }],
  },
  rogue_l13_arcane_trickster: {
    actions: [{
      id: 'versatile_trickster',
      namePt: 'Trapaceiro Versátil', nameEn: 'Versatile Trickster',
      descPt: 'Ação bônus: use Mão Mágica para distrair um alvo e ganhar vantagem no ataque contra ele neste turno.',
      descEn: 'Bonus action: use Mage Hand to distract a target and gain advantage on attacks against it this turn.',
      useType: 'at_will', activationCost: 'bonus',
    }],
  },
  rogue_l13_mastermind: {
    actions: [{
      id: 'misdirection',
      namePt: 'Desorientação', nameEn: 'Misdirection',
      descPt: 'Ação bônus: redirecione atenção/rastros para confundir uma criatura observadora.',
      descEn: 'Bonus action: redirect attention/traces to mislead an observing creature.',
      useType: 'at_will', activationCost: 'bonus',
    }],
  },
  rogue_l13_assassin: {
    actions: [{
      id: 'impostor',
      namePt: 'Impostor', nameEn: 'Impostor',
      descPt: 'Ação de preparo: após estudo, replique voz e maneirismos com alta precisão para disfarce avançado.',
      descEn: 'Preparation action: after study, replicate voice and mannerisms for advanced disguise.',
      useType: 'at_will', activationCost: 'action',
    }],
  },
  rogue_l13_inquisitive: {
    actions: [{
      id: 'steady_eye',
      namePt: 'Olhar Firme', nameEn: 'Steady Eye',
      descPt: 'Passiva: vantagem em Percepção e Investigação se mover no máximo metade do deslocamento.',
      descEn: 'Passive: advantage on Perception and Investigation if you move at most half speed.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l13_scout: {
    actions: [{
      id: 'ambush_master',
      namePt: 'Mestre da Emboscada', nameEn: 'Ambush Master',
      descPt: 'Passiva: vantagem em iniciativa; no 1º turno, alvo atacado por você fica vulnerável à ofensiva de aliados.',
      descEn: 'Passive: advantage on initiative; on round 1, your attacked target is more exposed to allies.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l13_swashbuckler: {
    actions: [{
      id: 'daring_fancy',
      namePt: 'Audácia Elegante', nameEn: 'Daring Fancy',
      descPt: 'Ação bônus: mova-se até seu deslocamento sem provocar ataques de oportunidade; vantagem contra medo.',
      descEn: 'Bonus action: move up to your speed without provoking opportunity attacks; advantage versus fear.',
      useType: 'at_will', activationCost: 'bonus',
    }],
  },
  rogue_l13_thief: {
    actions: [{
      id: 'use_magic_device',
      namePt: 'Usar Dispositivo Mágico', nameEn: 'Use Magic Device',
      descPt: 'Passiva: ignore requisitos de classe, raça e nível para usar itens mágicos.',
      descEn: 'Passive: ignore class, race, and level requirements to use magic items.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l13_phantom: {
    actions: [{
      id: 'ghost_walk',
      namePt: 'Caminhada Fantasma', nameEn: 'Ghost Walk',
      descPt: 'Ação bônus: forma espectral por 10 minutos.',
      descEn: 'Bonus action: enter ghostly form for 10 minutes.',
      useType: 'long_rest', maxUses: 1, activationCost: 'bonus',
    }],
  },
  rogue_l17_arcane_trickster: {
    actions: [{
      id: 'spell_thief',
      namePt: 'Ladrão de Magias', nameEn: 'Spell Thief',
      descPt: 'Reação ao ser alvo de magia: tente roubar a magia por 8 horas.',
      descEn: 'Reaction when targeted by a spell: attempt to steal the spell for 8 hours.',
      useType: 'long_rest', maxUses: 1, activationCost: 'reaction',
    }],
  },
  rogue_l17_soulknife: {
    actions: [{
      id: 'rend_mind',
      namePt: 'Dilacerar Mente', nameEn: 'Rend Mind',
      descPt: 'Ao acertar com Lâmina Psíquica, gaste 3 dados psi para forçar resistência de Sabedoria ou atordoar o alvo.',
      descEn: 'When you hit with a Psychic Blade, spend 3 psionic dice to force a Wisdom save or stun the target.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l17_inquisitive: {
    actions: [{
      id: 'eye_for_weakness',
      namePt: 'Olho para Fraqueza', nameEn: 'Eye for Weakness',
      descPt: 'Contra alvo de Insightful Fighting, some +3d6 ao Ataque Furtivo.',
      descEn: 'Against an Insightful Fighting target, add +3d6 to Sneak Attack.',
      useType: 'at_will', damageDice: '3d6', activationCost: 'free',
    }],
  },
  rogue_l17_assassin: {
    actions: [{
      id: 'death_strike',
      namePt: 'Golpe Mortal', nameEn: 'Death Strike',
      descPt: 'Passiva: ao acertar criatura surpreendida, ela testa CON; falha resulta em dano dobrado.',
      descEn: 'Passive: when you hit a surprised creature, it saves CON; on fail, damage is doubled.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l17_mastermind: {
    actions: [{
      id: 'soul_of_deceit',
      namePt: 'Alma do Engano', nameEn: 'Soul of Deceit',
      descPt: 'Passiva: mente protegida contra leitura; você pode projetar pensamentos falsos de forma convincente.',
      descEn: 'Passive: mind shielded from reading; you can project convincing false thoughts.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l17_phantom: {
    actions: [{
      id: 'deaths_friend',
      namePt: 'Amigo da Morte', nameEn: "Death's Friend",
      descPt: 'Passiva: melhora o uso de Tokens of the Departed e concede percepção sobrenatural quando sem tokens.',
      descEn: 'Passive: improves Tokens of the Departed usage and grants supernatural perception when you have none.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l17_thief: {
    actions: [{
      id: 'thiefs_reflexes',
      namePt: 'Reflexos do Ladrão', nameEn: "Thief's Reflexes",
      descPt: 'Passiva: no primeiro turno de combate, você age duas vezes (segunda vez em iniciativa reduzida).',
      descEn: 'Passive: on the first combat round, you act twice (second turn at reduced initiative).',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_blindsense: {
    actions: [{
      id: 'blindsense',
      namePt: 'Sentido Cego', nameEn: 'Blindsense',
      descPt: 'Passivo: se puder ouvir, detecta a localização de criaturas invisíveis ou ocultas em 3m.',
      descEn: 'Passive: if you can hear, you detect the location of invisible or hidden creatures within 10 ft.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_elusive: {
    actions: [{
      id: 'elusive',
      namePt: 'Evasivo', nameEn: 'Elusive',
      descPt: 'Enquanto não estiver incapacitado, ataques contra você nunca têm vantagem.',
      descEn: 'While not incapacitated, attacks against you never have advantage.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_reliable_talent: {
    actions: [{
      id: 'reliable_talent',
      namePt: 'Talento Confiável', nameEn: 'Reliable Talent',
      descPt: 'Em testes de habilidade com proficiência, resultados 9 ou menos contam como 10.',
      descEn: 'On proficient ability checks, results of 9 or lower count as 10.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_slippery_mind: {
    actions: [{
      id: 'slippery_mind',
      namePt: 'Mente Escorregadia', nameEn: 'Slippery Mind',
      descPt: 'Você ganha proficiência em resistências de Sabedoria.',
      descEn: 'You gain proficiency in Wisdom saving throws.',
      useType: 'at_will', activationCost: 'free',
    }],
  },
  rogue_l17_scout: {
    actions: [{
      id: 'sudden_strike',
      namePt: 'Golpe Súbito', nameEn: 'Sudden Strike',
      descPt: 'Após Cunning Action (Hide), faça um ataque extra como ação bônus no mesmo turno.',
      descEn: 'After Cunning Action (Hide), make an extra attack as a bonus action in the same turn.',
      useType: 'at_will', activationCost: 'bonus',
    }],
  },
  rogue_l17_swashbuckler: {
    actions: [{
      id: 'master_duelist',
      namePt: 'Mestre Duelista', nameEn: 'Master Duelist',
      descPt: 'Quando errar um ataque, pode refazê-lo com vantagem. Recarrega no descanso curto.',
      descEn: 'When you miss an attack, you may reroll it with advantage. Recharges on short rest.',
      useType: 'short_rest', maxUses: 1, activationCost: 'free',
    }],
  },
  rogue_stroke_of_luck: {
    actions: [{
      id: 'stroke_of_luck',
      namePt: 'Golpe de Sorte', nameEn: 'Stroke of Luck',
      descPt: 'Quando errar um ataque, transforme-o em acerto; ou trate um teste de atributo falho como 20.',
      descEn: 'When you miss an attack, turn it into a hit; or treat a failed ability check as a 20.',
      useType: 'short_rest', maxUses: 1, activationCost: 'free',
    }],
  },
  rogue_sneak_attack_1d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (1d6)', nameEn: 'Sneak Attack (1d6)', descPt: '+1d6 de dano ao atacar com vantagem ou com aliado adjacente.', descEn: '+1d6 damage when attacking with advantage or with an adjacent ally.', useType: 'at_will', damageDice: '1d6' }] },
  rogue_sneak_attack_1d6_2: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (1d6)', nameEn: 'Sneak Attack (1d6)', descPt: '+1d6 de dano furtivo.', descEn: '+1d6 sneak damage.', useType: 'at_will', damageDice: '1d6' }] },
  rogue_sneak_attack_2d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (2d6)', nameEn: 'Sneak Attack (2d6)', descPt: '+2d6 de dano furtivo.', descEn: '+2d6 sneak damage.', useType: 'at_will', damageDice: '2d6' }] },
  rogue_sneak_attack_2d6_l4: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (2d6)', nameEn: 'Sneak Attack (2d6)', descPt: '+2d6 de dano furtivo.', descEn: '+2d6 sneak damage.', useType: 'at_will', damageDice: '2d6' }] },
  rogue_sneak_attack_3d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (3d6)', nameEn: 'Sneak Attack (3d6)', descPt: '+3d6 de dano furtivo.', descEn: '+3d6 sneak damage.', useType: 'at_will', damageDice: '3d6' }] },
  rogue_sneak_attack_3d6_l6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (3d6)', nameEn: 'Sneak Attack (3d6)', descPt: '+3d6 de dano furtivo.', descEn: '+3d6 sneak damage.', useType: 'at_will', damageDice: '3d6' }] },
  rogue_sneak_attack_4d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (4d6)', nameEn: 'Sneak Attack (4d6)', descPt: '+4d6 de dano furtivo.', descEn: '+4d6 sneak damage.', useType: 'at_will', damageDice: '4d6' }] },
  rogue_sneak_attack_4d6_l8: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (4d6)', nameEn: 'Sneak Attack (4d6)', descPt: '+4d6 de dano furtivo.', descEn: '+4d6 sneak damage.', useType: 'at_will', damageDice: '4d6' }] },
  rogue_sneak_attack_5d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (5d6)', nameEn: 'Sneak Attack (5d6)', descPt: '+5d6 de dano furtivo.', descEn: '+5d6 sneak damage.', useType: 'at_will', damageDice: '5d6' }] },
  rogue_sneak_attack_5d6_l10: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (5d6)', nameEn: 'Sneak Attack (5d6)', descPt: '+5d6 de dano furtivo.', descEn: '+5d6 sneak damage.', useType: 'at_will', damageDice: '5d6' }] },
  rogue_sneak_attack_6d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (6d6)', nameEn: 'Sneak Attack (6d6)', descPt: '+6d6 de dano furtivo.', descEn: '+6d6 sneak damage.', useType: 'at_will', damageDice: '6d6' }] },
  rogue_sneak_attack_6d6_l12: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (6d6)', nameEn: 'Sneak Attack (6d6)', descPt: '+6d6 de dano furtivo.', descEn: '+6d6 sneak damage.', useType: 'at_will', damageDice: '6d6' }] },
  rogue_sneak_attack_7d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (7d6)', nameEn: 'Sneak Attack (7d6)', descPt: '+7d6 de dano furtivo.', descEn: '+7d6 sneak damage.', useType: 'at_will', damageDice: '7d6' }] },
  rogue_sneak_attack_7d6_l14: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (7d6)', nameEn: 'Sneak Attack (7d6)', descPt: '+7d6 de dano furtivo.', descEn: '+7d6 sneak damage.', useType: 'at_will', damageDice: '7d6' }] },
  rogue_sneak_attack_8d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (8d6)', nameEn: 'Sneak Attack (8d6)', descPt: '+8d6 de dano furtivo.', descEn: '+8d6 sneak damage.', useType: 'at_will', damageDice: '8d6' }] },
  rogue_sneak_attack_8d6_l16: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (8d6)', nameEn: 'Sneak Attack (8d6)', descPt: '+8d6 de dano furtivo.', descEn: '+8d6 sneak damage.', useType: 'at_will', damageDice: '8d6' }] },
  rogue_sneak_attack_9d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (9d6)', nameEn: 'Sneak Attack (9d6)', descPt: '+9d6 de dano furtivo.', descEn: '+9d6 sneak damage.', useType: 'at_will', damageDice: '9d6' }] },
  rogue_sneak_attack_9d6_l18: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (9d6)', nameEn: 'Sneak Attack (9d6)', descPt: '+9d6 de dano furtivo.', descEn: '+9d6 sneak damage.', useType: 'at_will', damageDice: '9d6' }] },
  rogue_sneak_attack_10d6: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (10d6)', nameEn: 'Sneak Attack (10d6)', descPt: '+10d6 de dano furtivo.', descEn: '+10d6 sneak damage.', useType: 'at_will', damageDice: '10d6' }] },
  rogue_sneak_attack_10d6_l20: { actions: [{ id: 'sneak_attack', namePt: 'Ataque Furtivo (10d6)', nameEn: 'Sneak Attack (10d6)', descPt: '+10d6 de dano furtivo.', descEn: '+10d6 sneak damage.', useType: 'at_will', damageDice: '10d6' }] },

  // Ação Ardilosa — 3 opções de ação bônus exclusivas do Ladino (nível 2)
  rogue_cunning_action: {
    actions: [
      {
        id: 'cunning_action_hide',
        namePt: 'Ação Ardilosa: Esconder',
        nameEn: 'Cunning Action: Hide',
        descPt: 'Esconde-se como ação bônus. Configura o próximo Ataque Furtivo sem precisar de aliado adjacente.',
        descEn: 'Hide as a bonus action. Sets up your next Sneak Attack without needing an adjacent ally.',
        useType: 'at_will',
        activationCost: 'bonus',
      },
      {
        id: 'cunning_action_disengage',
        namePt: 'Ação Ardilosa: Desengajar',
        nameEn: 'Cunning Action: Disengage',
        descPt: 'Desengaja como ação bônus. Seu movimento não provoca ataques de oportunidade até o fim do turno.',
        descEn: 'Disengage as a bonus action. Your movement does not provoke opportunity attacks until end of turn.',
        useType: 'at_will',
        activationCost: 'bonus',
      },
      {
        id: 'cunning_action_dash',
        namePt: 'Ação Ardilosa: Avançar',
        nameEn: 'Cunning Action: Dash',
        descPt: 'Avança como ação bônus, dobrando o deslocamento total no turno.',
        descEn: 'Dash as a bonus action, doubling total movement for the turn.',
        useType: 'at_will',
        activationCost: 'bonus',
      },
    ],
  },

  // Esquiva Instintiva (nível 5) — reação para reduzir dano à metade
  rogue_uncanny_dodge: {
    actions: [{
      id: 'uncanny_dodge',
      namePt: 'Esquiva Instintiva',
      nameEn: 'Uncanny Dodge',
      descPt: 'Reação: ao ser acertado por um atacante que você possa ver, reduza o dano sofrido à metade.',
      descEn: 'Reaction: when hit by an attacker you can see, halve the damage taken.',
      useType: 'at_will',
      activationCost: 'reaction',
    }],
  },

  // Evasão (nível 7) — passiva (sem ação, informativa)
  rogue_evasion: {
    actions: [{
      id: 'evasion_rogue',
      namePt: 'Evasão (passiva)',
      nameEn: 'Evasion (passive)',
      descPt: 'Em resistências de DEX para metade do dano: sem dano se passar, metade se falhar.',
      descEn: 'On DEX saves for half damage: no damage on pass, half on fail.',
      useType: 'at_will',
      activationCost: 'free',
    }],
  },

  // ── Arquétipos de Ladino ─────────────────────────────────────────────────
  rogue_arch_assassin: {
    actions: [{
      id: 'assassinate',
      namePt: 'Assassinar (passiva)',
      nameEn: 'Assassinate (passive)',
      descPt: 'Vantagem em ataques contra criaturas que ainda não tomaram turno no combate. Crítico automático contra alvos surpreendidos.',
      descEn: 'Advantage on attacks against creatures that have not taken a turn. Auto-crit on surprised targets.',
      useType: 'at_will',
      activationCost: 'free',
    }],
  },
  rogue_arch_thief: {
    actions: [{
      id: 'fast_hands',
      namePt: 'Mãos Rápidas',
      nameEn: 'Fast Hands',
      descPt: 'Ação bônus: use ferramentas de ladrão, ative/manipule um objeto, Prestidigitação ou tente furtar.',
      descEn: 'Bonus action: use thieves\' tools, activate/manipulate an object, Sleight of Hand, or pickpocket.',
      useType: 'at_will',
      activationCost: 'bonus',
    }],
  },
  rogue_arch_swashbuckler: {
    actions: [{
      id: 'fancy_footwork',
      namePt: 'Passos Elegantes (passiva)',
      nameEn: 'Fancy Footwork (passive)',
      descPt: 'Ao atacar uma criatura em combate corpo-a-corpo, ela não pode usar ataque de oportunidade contra você neste turno.',
      descEn: 'When you make a melee attack against a creature, it cannot make opportunity attacks against you this turn.',
      useType: 'at_will',
      activationCost: 'free',
    }],
  },
  rogue_arch_mastermind: {
    actions: [{
      id: 'master_of_tactics',
      namePt: 'Mestre das Táticas',
      nameEn: 'Master of Tactics',
      descPt: 'Ação bônus: use a ação Ajuda para auxiliar aliados em ataques a até 9 metros (em vez dos 1,5m normais).',
      descEn: 'Bonus action: use the Help action to aid ally attacks within 9m (instead of normal 5ft).',
      useType: 'at_will',
      activationCost: 'bonus',
    }],
  },
  rogue_arch_inquisitive: {
    actions: [{
      id: 'insightful_fighting',
      namePt: 'Combate Perspicaz',
      nameEn: 'Insightful Fighting',
      descPt: 'Ação bônus: teste de Intuição contra Enganação do alvo. Se passar, pode usar Ataque Furtivo contra ele por 1 minuto (sem precisar de vantagem ou aliado).',
      descEn: 'Bonus action: Insight vs. target\'s Deception. On success, can Sneak Attack that target for 1 min without advantage or ally.',
      useType: 'at_will',
      activationCost: 'bonus',
    }],
  },
  rogue_arch_scout: {
    actions: [{
      id: 'skirmisher',
      namePt: 'Guerrilheiro',
      nameEn: 'Skirmisher',
      descPt: 'Reação: quando um inimigo termina o movimento adjacente a você, mova metade do deslocamento sem provocar ataques de oportunidade.',
      descEn: 'Reaction: when an enemy ends its move adjacent to you, move up to half speed without provoking opportunity attacks.',
      useType: 'at_will',
      activationCost: 'reaction',
    }],
  },
  rogue_arch_phantom: {
    actions: [{
      id: 'wails_from_grave',
      namePt: 'Lamentos do Além',
      nameEn: 'Wails from the Grave',
      descPt: 'Após acertar um Ataque Furtivo, cause dano necrótico = metade dos dados de Ataque Furtivo a outra criatura em 9m. Usos = bônus de proficiência por descanso longo.',
      descEn: 'After a Sneak Attack, deal necrotic damage equal to half your Sneak Attack dice to another creature within 9m. Uses = prof. bonus per long rest.',
      useType: 'long_rest',
      maxUses: 4,
      damageType: 'necrotic',
      activationCost: 'free',
    }],
  },
  rogue_arch_soulknife: {
    actions: [{
      id: 'psychic_blades',
      namePt: 'Lâminas Psíquicas',
      nameEn: 'Psychic Blades',
      descPt: 'Materializa uma lâmina psíquica. Ataque corpo-a-corpo ou à distância (9m) com DEX/STR, dano 1d6 psíquico. Ação bônus: segunda lâmina com 1d4 psíquico.',
      descEn: 'Materialize a psychic blade. Melee or ranged attack (30ft) with DEX/STR, deals 1d6 psychic. Bonus action: second blade for 1d4 psychic.',
      useType: 'at_will',
      damageDice: '1d6',
      damageType: 'psychic',
      range: '9m',
      activationCost: 'action',
    }],
  },
  rogue_l9_swashbuckler: {
    actions: [{
      id: 'elegant_maneuver',
      namePt: 'Manobra Elegante',
      nameEn: 'Elegant Maneuver',
      descPt: 'Ação bônus: ganhe vantagem no próximo teste de Acrobacia ou Atletismo neste turno.',
      descEn: 'Bonus action: gain advantage on your next Acrobatics or Athletics check this turn.',
      useType: 'at_will',
      activationCost: 'bonus',
    }],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // BÁRBARO — Movimento Rápido (nível 7)
  // ────────────────────────────────────────────────────────────────────────────
  barbarian_fast_movement: {
    speedBonus: 10,
    speedRequiresUnarmored: true, // sem armadura pesada (mapeado como sem armadura)
  },

  // ────────────────────────────────────────────────────────────────────────────
  // MONGE — Movimento Sem Armadura
  // ────────────────────────────────────────────────────────────────────────────
  monk_unarmored_movement_10ft: { speedBonus: 10, speedRequiresUnarmored: true },
  monk_unarmored_movement_15ft: { speedBonus: 15, speedRequiresUnarmored: true },
  monk_unarmored_movement_20ft: { speedBonus: 20, speedRequiresUnarmored: true },
  monk_unarmored_movement_25ft: { speedBonus: 25, speedRequiresUnarmored: true },

  // ────────────────────────────────────────────────────────────────────────────
  // RAÇAS — resistências e ações raciais
  // ────────────────────────────────────────────────────────────────────────────
  // (Bônus de atributos raciais estão em races.ts e são aplicados na criação)
  // Resistências raciais são tratadas diretamente em computeCharacterStats
};

/**
 * Resolve efeitos derivados que dependem de combinação de traits.
 * Ex.: features genéricas de Paladino (7/15/20) + juramento escolhido.
 */
function getDerivedFeatureEffects(traitIds: string[]): FeatureEffect[] {
  const traits = new Set(traitIds);
  const derived: FeatureEffect[] = [];

  const has = (id: string) => traits.has(id);

  if (has('paladin_oath_feature_7')) {
    if (has('oath_devotion')) {
      derived.push({
        conditionImmunities: ['charmed'],
      });
    }
    if (has('oath_ancients')) {
      derived.push({
        actions: [{
          id: 'aura_of_warding',
          namePt: 'Aura de Proteção Anciã', nameEn: 'Aura of Warding',
          descPt: 'Passiva: você (e aliados próximos) têm resistência a dano de magias.',
          descEn: 'Passive: you (and nearby allies) have resistance to damage from spells.',
          useType: 'at_will', activationCost: 'free',
        }],
      });
    }
    if (has('oath_vengeance')) {
      derived.push({
        actions: [{
          id: 'relentless_avenger',
          namePt: 'Vingador Implacável', nameEn: 'Relentless Avenger',
          descPt: 'Passiva: após ataque de oportunidade, mova-se até metade do deslocamento sem provocar ataques.',
          descEn: 'Passive: after an opportunity attack, move up to half your speed without provoking attacks.',
          useType: 'at_will', activationCost: 'free',
        }],
      });
    }
    if (has('oath_conquest')) {
      derived.push({
        actions: [{
          id: 'aura_of_conquest',
          namePt: 'Aura de Conquista', nameEn: 'Aura of Conquest',
          descPt: 'Passiva: criaturas amedrontadas em sua aura têm deslocamento reduzido a 0 e sofrem dano psíquico.',
          descEn: 'Passive: frightened creatures in your aura have speed reduced to 0 and take psychic damage.',
          useType: 'at_will', activationCost: 'free',
        }],
      });
    }
    if (has('oath_redemption')) {
      derived.push({
        actions: [{
          id: 'aura_guardian',
          namePt: 'Aura Guardiã', nameEn: 'Aura of the Guardian',
          descPt: 'Reação: quando aliado próximo sofre dano, você pode receber esse dano no lugar dele.',
          descEn: 'Reaction: when a nearby ally takes damage, you can take that damage instead.',
          useType: 'at_will', activationCost: 'reaction',
        }],
      });
    }
  }

  if (has('paladin_oath_feature_15')) {
    if (has('oath_devotion')) {
      derived.push({
        actions: [{
          id: 'holy_nimbus',
          namePt: 'Auréola Sagrada', nameEn: 'Holy Nimbus',
          descPt: 'Ação: por 1 minuto, brilhe com luz intensa e cause dano radiante em inimigos próximos.',
          descEn: 'Action: for 1 minute, shine with bright light and deal radiant damage to nearby enemies.',
          useType: 'long_rest', maxUses: 1, activationCost: 'action',
        }],
      });
    }
    if (has('oath_ancients')) {
      derived.push({
        actions: [{
          id: 'undying_sentinel',
          namePt: 'Sentinela Imorredoura', nameEn: 'Undying Sentinel',
          descPt: 'Passiva: uma vez por descanso longo, quando cair a 0 HP, fica com 1 HP em vez disso.',
          descEn: 'Passive: once per long rest, when reduced to 0 HP, drop to 1 HP instead.',
          useType: 'long_rest', maxUses: 1, activationCost: 'free',
        }],
      });
    }
    if (has('oath_vengeance')) {
      derived.push({
        actions: [{
          id: 'soul_of_vengeance',
          namePt: 'Alma da Vingança', nameEn: 'Soul of Vengeance',
          descPt: 'Reação: quando alvo do Voto de Inimizade atacar, faça um ataque corpo-a-corpo contra ele.',
          descEn: 'Reaction: when your Vow of Enmity target attacks, make a melee attack against it.',
          useType: 'at_will', activationCost: 'reaction',
        }],
      });
    }
    if (has('oath_conquest')) {
      derived.push({
        actions: [{
          id: 'scornful_rebuke',
          namePt: 'Repreensão Desdenhosa', nameEn: 'Scornful Rebuke',
          descPt: 'Passiva: quando criatura lhe causar dano, ela sofre dano psíquico do seu modificador de Carisma.',
          descEn: 'Passive: when a creature damages you, it takes psychic damage equal to your Charisma modifier.',
          useType: 'at_will', activationCost: 'free',
        }],
      });
    }
    if (has('oath_redemption')) {
      derived.push({
        actions: [{
          id: 'protective_spirit',
          namePt: 'Espírito Protetor', nameEn: 'Protective Spirit',
          descPt: 'Passiva: no fim do turno, se tiver menos da metade dos HP e não estiver a 0, recupere 1d6 + metade do nível.',
          descEn: 'Passive: at end of turn, if below half HP and not at 0, regain 1d6 + half your level HP.',
          useType: 'at_will', damageDice: '1d6', activationCost: 'free',
        }],
      });
    }
    if (has('oath_glory')) {
      derived.push({
        actions: [{
          id: 'glorious_defense',
          namePt: 'Defesa Gloriosa', nameEn: 'Glorious Defense',
          descPt: 'Reação: adicione CAR à CA de um alvo visível contra um ataque que o acertaria; se errar, faça um ataque imediato.',
          descEn: 'Reaction: add CHA to AC of a visible target against a hit; if it misses, make an immediate attack.',
          useType: 'at_will', activationCost: 'reaction',
        }],
      });
    }
    if (has('oath_watchers')) {
      derived.push({
        actions: [{
          id: 'vigilant_rebuke',
          namePt: 'Repreensão Vigilante', nameEn: 'Vigilant Rebuke',
          descPt: 'Reação: quando criatura em sua aura passar em resistência mental, cause dano psíquico nela.',
          descEn: 'Reaction: when a creature in your aura succeeds on a mental save, deal psychic damage to it.',
          useType: 'at_will', activationCost: 'reaction',
        }],
      });
    }
    if (has('oath_oathbreaker')) {
      derived.push({
        resistances: ['bludgeoning', 'piercing', 'slashing'],
      });
    }
  }

  if (has('paladin_oath_capstone')) {
    if (has('oath_devotion')) {
      derived.push({
        actions: [{
          id: 'holy_nimbus_capstone',
          namePt: 'Avatar de Devoção', nameEn: 'Holy Nimbus (Capstone)',
          descPt: 'Ação: por 1 minuto, emite auréola sagrada, concede imunidade pessoal a encantado/amedrontado e dano radiante em inimigos próximos.',
          descEn: 'Action: for 1 minute, emit holy aura, gain personal immunity to charmed/frightened, and damage nearby enemies with radiant power.',
          useType: 'long_rest', maxUses: 1, activationCost: 'action', effectTag: 'holy_nimbus_capstone', isToggle: true,
        }],
        conditionImmunities: ['charmed', 'frightened'],
      });
    }
    if (has('oath_ancients')) {
      derived.push({
        actions: [{
          id: 'elder_champion',
          namePt: 'Campeão Ancião', nameEn: 'Elder Champion',
          descPt: 'Ação: por 1 minuto, regenera HP e melhora conjuração. Recarrega no descanso longo.',
          descEn: 'Action: for 1 minute, regenerate HP and improve spellcasting. Recharges on long rest.',
          useType: 'long_rest', maxUses: 1, activationCost: 'action',
        }],
      });
    }
    if (has('oath_vengeance')) {
      derived.push({
        actions: [{
          id: 'avenging_angel',
          namePt: 'Anjo Vingador', nameEn: 'Avenging Angel',
          descPt: 'Ação: por 1 hora, ganhe voo e aura de medo. Recarrega no descanso longo.',
          descEn: 'Action: for 1 hour, gain flight and fear aura. Recharges on long rest.',
          useType: 'long_rest', maxUses: 1, activationCost: 'action',
        }],
      });
    }
    if (has('oath_conquest')) {
      derived.push({
        actions: [{
          id: 'invincible_conqueror',
          namePt: 'Conquistador Invencível', nameEn: 'Invincible Conqueror',
          descPt: 'Ação: por 1 minuto, ganha resistência, ataque extra e críticos ampliados. Recarrega no descanso longo.',
          descEn: 'Action: for 1 minute, gain resistance, extra attacks, and expanded criticals. Recharges on long rest.',
          useType: 'long_rest', maxUses: 1, activationCost: 'action',
        }],
      });
    }
    if (has('oath_redemption')) {
      derived.push({
        actions: [{
          id: 'emissary_of_redemption',
          namePt: 'Emissário da Redenção', nameEn: 'Emissary of Redemption',
          descPt: 'Passiva: enquanto não atacar nem conjurar magia ofensiva, recebe resistência e reflete parte do dano sofrido.',
          descEn: 'Passive: while you do not attack or cast offensive spells, gain resistance and reflect part of damage taken.',
          useType: 'at_will', activationCost: 'free',
        }],
      });
    }
    if (has('oath_glory')) {
      derived.push({
        actions: [{
          id: 'living_legend',
          namePt: 'Lenda Viva', nameEn: 'Living Legend',
          descPt: 'Ação bônus: por 1 minuto, vantagem em testes de Carisma e rerrolagens de ataques/conjurações. Recarrega no descanso longo.',
          descEn: 'Bonus action: for 1 minute, gain advantage on Charisma checks and rerolls for attacks/spells. Recharges on long rest.',
          useType: 'long_rest', maxUses: 1, activationCost: 'bonus',
        }],
      });
    }
  }

  // Feats comuns em opcoes de ASI de Ranger/Rogue modelados por padrao de ID.
  // Isso evita mapear manualmente cada nivel (4/8/10/12/16/19).
  if (traitIds.some((id) => id.includes('_feat_lucky'))) {
    derived.push({
      actions: [{
        id: 'feat_lucky',
        namePt: 'Talento: Sortudo', nameEn: 'Feat: Lucky',
        descPt: '3 usos por descanso longo para rerrolar d20 de ataque, teste ou resistencia.',
        descEn: '3 uses per long rest to reroll an attack roll, ability check, or saving throw d20.',
        useType: 'long_rest', maxUses: 3, activationCost: 'free',
      }],
    });
  }

  if (traitIds.some((id) => id.includes('_feat_mobile'))) {
    derived.push({
      speedBonus: 10,
      actions: [{
        id: 'feat_mobile',
        namePt: 'Talento: Movel', nameEn: 'Feat: Mobile',
        descPt: 'Passiva: +3m de deslocamento e mobilidade aprimorada.',
        descEn: 'Passive: +10 ft speed and improved mobility.',
        useType: 'at_will', activationCost: 'free',
      }],
    });
  }

  if (traitIds.some((id) => id.includes('_feat_sharpshooter'))) {
    derived.push({
      actions: [{
        id: 'feat_sharpshooter',
        namePt: 'Talento: Atirador de Elite', nameEn: 'Feat: Sharpshooter',
        descPt: 'Passiva: ignora cobertura parcial e permite troca -5 para acertar por +10 de dano a distancia.',
        descEn: 'Passive: ignore partial cover and allow -5 to hit for +10 damage on ranged attacks.',
        useType: 'at_will', activationCost: 'free',
      }],
    });
  }

  if (traitIds.some((id) => id.includes('_feat_crossbow'))) {
    derived.push({
      actions: [{
        id: 'feat_crossbow_expert',
        namePt: 'Talento: Especialista em Besta', nameEn: 'Feat: Crossbow Expert',
        descPt: 'Passiva: remove carregamento de bestas, evita desvantagem adjacente e libera ataque bonus com besta de mao.',
        descEn: 'Passive: ignore crossbow loading, avoid adjacent disadvantage, and gain bonus hand crossbow attack.',
        useType: 'at_will', activationCost: 'free',
      }],
    });
  }

  if (traitIds.some((id) => id.includes('_feat_resilient'))) {
    derived.push({
      actions: [{
        id: 'feat_resilient',
        namePt: 'Talento: Resiliente', nameEn: 'Feat: Resilient',
        descPt: 'Passiva: proficiencia em uma resistencia escolhida e maior consistencia defensiva.',
        descEn: 'Passive: gain proficiency in one chosen saving throw and improve defensive consistency.',
        useType: 'at_will', activationCost: 'free',
      }],
    });
  }

  if (traitIds.some((id) => id.includes('_feat_tough'))) {
    derived.push({
      actions: [{
        id: 'feat_tough',
        namePt: 'Talento: Resistente', nameEn: 'Feat: Tough',
        descPt: 'Passiva: aumenta consideravelmente seus pontos de vida maximos.',
        descEn: 'Passive: significantly increases your maximum hit points.',
        useType: 'at_will', activationCost: 'free',
      }],
    });
  }

  if (traitIds.some((id) => id.includes('_feat_skulker'))) {
    derived.push({
      actions: [{
        id: 'feat_skulker',
        namePt: 'Talento: Espreitador', nameEn: 'Feat: Skulker',
        descPt: 'Passiva: melhores opcoes de furtividade em pouca luz e apos ataques a distancia.',
        descEn: 'Passive: improved stealth options in dim light and after ranged attacks.',
        useType: 'at_will', activationCost: 'free',
      }],
    });
  }

  if (traitIds.some((id) => id.includes('_feat_alert'))) {
    derived.push({
      actions: [{
        id: 'feat_alert',
        namePt: 'Talento: Alerta', nameEn: 'Feat: Alert',
        descPt: 'Passiva: +5 iniciativa, nao pode ser surpreendido enquanto consciente.',
        descEn: 'Passive: +5 initiative, cannot be surprised while conscious.',
        useType: 'at_will', activationCost: 'free',
      }],
    });
  }

  return derived;
}

/** Retorna efeitos diretos + efeitos derivados por combinação de traits. */
export function getFeatureEffectsForTraits(traitIds: string[]): FeatureEffect[] {
  const direct = traitIds
    .map((tid) => FEATURE_EFFECTS[tid])
    .filter((fx): fx is FeatureEffect => !!fx);

  return [...direct, ...getDerivedFeatureEffects(traitIds)];
}

/**
 * Retorna todas as ações ativas para uma lista de trait IDs.
 * Se o mesmo action.id aparecer mais de uma vez (ex: múltiplos rage_N),
 * prevalece o de maior maxUses (ou at_will sobrescreve tudo).
 */
export function getActiveFeatureActions(traitIds: string[]): FeatureAction[] {
  const actionMap: Record<string, FeatureAction> = {};

  for (const fx of getFeatureEffectsForTraits(traitIds)) {
    if (!fx?.actions) continue;
    for (const action of fx.actions) {
      const existing = actionMap[action.id];
      const newUses = action.maxUses ?? Infinity;
      const existingUses = existing?.maxUses ?? 0;
      if (!existing || newUses > existingUses || action.useType === 'at_will') {
        actionMap[action.id] = action;
      }
    }
  }

  return Object.values(actionMap);
}

/** Retorna IDs de magias concedidas automaticamente por traits/features. */
export function getGrantedSpellsForTraits(traitIds: string[]): string[] {
  const granted = new Set<string>();

  for (const fx of getFeatureEffectsForTraits(traitIds)) {
    if (!fx?.grantedSpells) continue;
    for (const sid of fx.grantedSpells) granted.add(sid);
  }

  return [...granted];
}
