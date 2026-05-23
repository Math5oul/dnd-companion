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

  // ──────────────────────────────────────────────────────────────────────────
  // LADINO
  // ──────────────────────────────────────────────────────────────────────────
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
 * Retorna todas as ações ativas para uma lista de trait IDs.
 * Se o mesmo action.id aparecer mais de uma vez (ex: múltiplos rage_N),
 * prevalece o de maior maxUses (ou at_will sobrescreve tudo).
 */
export function getActiveFeatureActions(traitIds: string[]): FeatureAction[] {
  const actionMap: Record<string, FeatureAction> = {};

  for (const tid of traitIds) {
    const fx = FEATURE_EFFECTS[tid];
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
