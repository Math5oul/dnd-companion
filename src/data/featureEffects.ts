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
    actions: [{
      id: 'rage',
      namePt: 'Fúria', nameEn: 'Rage',
      descPt: 'Bônus de dano em ataques de FOR, resistência a dano físico, vantagem em FOR. Dura 1 minuto.',
      descEn: 'Bonus damage on STR attacks, resistance to physical damage, advantage on STR checks. Lasts 1 minute.',
      useType: 'long_rest', maxUses: 2,
    }],
  },
  barbarian_rage_3:  { actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Usos aumentados para 3.', descEn: 'Uses increased to 3.', useType: 'long_rest', maxUses: 3 }] },
  barbarian_rage_4:  { actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Usos aumentados para 4.', descEn: 'Uses increased to 4.', useType: 'long_rest', maxUses: 4 }] },
  barbarian_rage_5:  { actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Usos aumentados para 5.', descEn: 'Uses increased to 5.', useType: 'long_rest', maxUses: 5 }] },
  barbarian_rage_6:  { actions: [{ id: 'rage', namePt: 'Fúria', nameEn: 'Rage', descPt: 'Usos ilimitados.', descEn: 'Unlimited uses.', useType: 'at_will' }] },

  // ──────────────────────────────────────────────────────────────────────────
  // BARDO
  // ──────────────────────────────────────────────────────────────────────────
  bard_bardic_inspiration_d6: {
    actions: [{
      id: 'bardic_inspiration',
      namePt: 'Inspiração Bárdica (d6)', nameEn: 'Bardic Inspiration (d6)',
      descPt: 'Conceda 1d6 de bônus à rolagem de um aliado como ação bônus. Usos = mod. de CAR por descanso curto.',
      descEn: 'Grant an ally 1d6 bonus to a roll as a bonus action. Uses = CHA mod per short rest.',
      useType: 'short_rest', maxUses: 3, damageDice: '1d6',
    }],
  },
  bard_bardic_inspiration_d8: {
    actions: [{
      id: 'bardic_inspiration',
      namePt: 'Inspiração Bárdica (d8)', nameEn: 'Bardic Inspiration (d8)',
      descPt: 'Dado de inspiração aumentado para d8.',
      descEn: 'Inspiration die increased to d8.',
      useType: 'short_rest', maxUses: 3, damageDice: '1d8',
    }],
  },
  bard_bardic_inspiration_d10: {
    actions: [{
      id: 'bardic_inspiration',
      namePt: 'Inspiração Bárdica (d10)', nameEn: 'Bardic Inspiration (d10)',
      descPt: 'Dado de inspiração aumentado para d10.',
      descEn: 'Inspiration die increased to d10.',
      useType: 'short_rest', maxUses: 3, damageDice: '1d10',
    }],
  },
  bard_bardic_inspiration_d12: {
    actions: [{
      id: 'bardic_inspiration',
      namePt: 'Inspiração Bárdica (d12)', nameEn: 'Bardic Inspiration (d12)',
      descPt: 'Dado de inspiração aumentado para d12.',
      descEn: 'Inspiration die increased to d12.',
      useType: 'short_rest', maxUses: 4, damageDice: '1d12',
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
      useType: 'short_rest', maxUses: 1, damageDice: '1d10',
    }],
  },
  fighter_action_surge_1: {
    actions: [{
      id: 'action_surge',
      namePt: 'Surto de Ação', nameEn: 'Action Surge',
      descPt: 'Ganhe uma ação extra neste turno. 1 uso por descanso curto.',
      descEn: 'Gain one extra action this turn. 1 use per short rest.',
      useType: 'short_rest', maxUses: 1,
    }],
  },
  fighter_action_surge_2: {
    actions: [{
      id: 'action_surge',
      namePt: 'Surto de Ação (2x)', nameEn: 'Action Surge (2x)',
      descPt: '2 usos por descanso curto.',
      descEn: '2 uses per short rest.',
      useType: 'short_rest', maxUses: 2,
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
        useType: 'short_rest', maxUses: 2,
      },
      {
        id: 'ki_step',
        namePt: 'Passo do Vento', nameEn: 'Step of the Wind',
        descPt: 'Gaste 1 ponto de ki: Desviar ou Correr como ação bônus; salto dobrado.',
        descEn: 'Spend 1 ki point: Disengage or Dash as a bonus action; jump distance doubled.',
        useType: 'short_rest', maxUses: 2,
      },
      {
        id: 'ki_defense',
        namePt: 'Defesa Sem Armadura', nameEn: 'Patient Defense',
        descPt: 'Gaste 1 ponto de ki: Esquivar como ação bônus.',
        descEn: 'Spend 1 ki point: Dodge as a bonus action.',
        useType: 'short_rest', maxUses: 2,
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

  // ──────────────────────────────────────────────────────────────────────────
  // RAÇAS — bônus de atributos
  // ──────────────────────────────────────────────────────────────────────────
  // (Bônus raciais já estão em races.ts → abilityBonuses e são aplicados na criação)
  // Aqui cobrimos ações raciais
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
