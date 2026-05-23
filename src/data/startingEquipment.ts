import type { Equipment } from '../types/equipment';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Poção de Cura padrão (sempre incluída × 2) */
function healingPotion(): Equipment {
  return {
    id: genId(),
    name: 'Poção de Cura',
    type: 'consumable',
    description: 'Recupera 2d4+2 PV quando bebida.',
    equipped: false,
    goldValue: 50,
    weight: 0.5,
    charges: 1,
    maxCharges: 1,
    useEffect: { type: 'heal', dice: '2d4+2' },
    bonuses: [],
    traits: [],
    attacks: [],
  };
}

// ─── Builders ─────────────────────────────────────────────────────────────────

function weapon(
  name: string,
  desc: string,
  dmg: string,
  dmgType: string,
  range: string,
  opts?: Partial<Equipment>,
): Equipment {
  return {
    id: genId(),
    name,
    type: 'weapon',
    description: desc,
    equipped: true,
    goldValue: 0,
    bonuses: [],
    traits: [],
    attacks: [
      {
        id: genId(),
        name: 'Ataque',
        attackBonus: 0,
        damage: dmg,
        damageType: dmgType,
        range,
      },
    ],
    ...opts,
  };
}

function armor(
  name: string,
  desc: string,
  armorCategory: 'light' | 'medium' | 'heavy',
  baseAC: number,
  opts?: Partial<Equipment>,
): Equipment {
  return {
    id: genId(),
    name,
    type: 'armor',
    description: desc,
    equipped: true,
    goldValue: 0,
    armorCategory,
    baseAC,
    bonuses: [],
    traits: [],
    attacks: [],
    ...opts,
  };
}

function shield(): Equipment {
  return {
    id: genId(),
    name: 'Escudo',
    type: 'shield',
    description: '+2 CA.',
    equipped: true,
    goldValue: 10,
    weight: 6,
    bonuses: [{ type: 'ac', value: 2 }],
    traits: ['Bônus de +2 na CA'],
    attacks: [],
  };
}

// ─── Itens por classe ──────────────────────────────────────────────────────────

const CLASS_EQUIPMENT: Record<string, () => Equipment[]> = {
  fighter: () => [
    armor('Cota de Malha', 'Armadura pesada com CA base 16. Não requer proficiência com DES.', 'heavy', 16, { goldValue: 75, weight: 55 }),
    shield(),
    weapon('Espada Longa', 'Arma marcial de uma mão. Versátil (1d10 com duas mãos).', '1d8', 'slashing', '5 ft', { weaponCategory: 'martial', weaponHands: 'one', goldValue: 15, weight: 3 }),
  ],

  paladin: () => [
    armor('Cota de Malha', 'Armadura pesada com CA base 16.', 'heavy', 16, { goldValue: 75, weight: 55 }),
    shield(),
    weapon('Espada Longa', 'Arma marcial de uma mão. Versátil (1d10 com duas mãos).', '1d8', 'slashing', '5 ft', { weaponCategory: 'martial', weaponHands: 'one', goldValue: 15, weight: 3 }),
  ],

  cleric: () => [
    armor('Cota de Malha', 'Armadura pesada com CA base 16.', 'heavy', 16, { goldValue: 75, weight: 55 }),
    shield(),
    weapon('Maça', 'Arma simples de uma mão.', '1d6', 'bludgeoning', '5 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 5, weight: 4 }),
  ],

  ranger: () => [
    armor('Armadura de Couro', 'Armadura leve com CA base 11 + mod DEX.', 'light', 11, { goldValue: 10, weight: 10 }),
    weapon('Espada Curta', 'Arma marcial de uma mão. Finesse.', '1d6', 'piercing', '5 ft', { weaponCategory: 'martial', weaponHands: 'one', goldValue: 10, weight: 2 }),
    weapon('Arco Curto', 'Alcance 80/320 ft. Munição.', '1d6', 'piercing', '80/320 ft', { weaponCategory: 'simple', weaponHands: 'two', goldValue: 25, weight: 2 }),
  ],

  rogue: () => [
    armor('Armadura de Couro', 'Armadura leve com CA base 11 + mod DEX.', 'light', 11, { goldValue: 10, weight: 10 }),
    weapon('Espada Curta', 'Finesse, leve. Use mod de DES.', '1d6', 'piercing', '5 ft', { weaponCategory: 'martial', weaponHands: 'one', goldValue: 10, weight: 2 }),
    weapon('Adaga', 'Finesse, leve, arremessável. Alcance 20/60 ft.', '1d4', 'piercing', '5 ft / 20-60 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 2, weight: 1 }),
  ],

  wizard: () => [
    weapon('Bordão', 'Arma simples versátil (1d8 com duas mãos).', '1d6', 'bludgeoning', '5 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 0, weight: 4 }),
  ],

  sorcerer: () => [
    weapon('Adaga', 'Finesse, leve, arremessável.', '1d4', 'piercing', '5 ft / 20-60 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 2, weight: 1 }),
  ],

  warlock: () => [
    armor('Armadura de Couro', 'Armadura leve com CA base 11 + mod DEX.', 'light', 11, { goldValue: 10, weight: 10 }),
    weapon('Adaga', 'Finesse, leve, arremessável.', '1d4', 'piercing', '5 ft / 20-60 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 2, weight: 1 }),
  ],

  bard: () => [
    armor('Armadura de Couro', 'Armadura leve com CA base 11 + mod DEX.', 'light', 11, { goldValue: 10, weight: 10 }),
    weapon('Rapieira', 'Arma marcial. Finesse. Use mod de DES.', '1d8', 'piercing', '5 ft', { weaponCategory: 'martial', weaponHands: 'one', goldValue: 25, weight: 2 }),
  ],

  druid: () => [
    armor('Armadura de Couro', 'Armadura leve com CA base 11 + mod DEX.', 'light', 11, { goldValue: 10, weight: 10 }),
    weapon('Bordão', 'Arma simples versátil (1d8 com duas mãos).', '1d6', 'bludgeoning', '5 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 0, weight: 4 }),
  ],

  barbarian: () => [
    weapon('Machado Grande', 'Arma marcial de duas mãos. 2d6 de dano por corte.', '2d6', 'slashing', '5 ft', { weaponCategory: 'martial', weaponHands: 'two', goldValue: 30, weight: 7 }),
    weapon('Dardo', 'Arma simples arremessável. Alcance 30/120 ft.', '1d6', 'piercing', '30/120 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 1, weight: 2 }),
    weapon('Dardo', 'Arma simples arremessável. Alcance 30/120 ft.', '1d6', 'piercing', '30/120 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 1, weight: 2 }),
  ],

  monk: () => [
    weapon('Espada Curta', 'Arma marcial de uma mão. Finesse.', '1d6', 'piercing', '5 ft', { weaponCategory: 'martial', weaponHands: 'one', goldValue: 10, weight: 2 }),
    weapon('Dardo', 'Arma simples. Alcance 20/60 ft.', '1d4', 'piercing', '20/60 ft', { weaponCategory: 'simple', weaponHands: 'one', goldValue: 2, weight: 1 }),
  ],
};

/**
 * Retorna o equipamento inicial para uma combinação de classe e raça.
 * Sempre inclui 2 Poções de Cura.
 */
export function getStartingEquipment(classId: string, _raceId: string): Equipment[] {
  const classItems = CLASS_EQUIPMENT[classId]?.() ?? [
    weapon('Adaga', 'Arma simples básica.', '1d4', 'piercing', '5 ft / 20-60 ft', {
      weaponCategory: 'simple', weaponHands: 'one', goldValue: 2, weight: 1,
    }),
  ];

  return [...classItems, healingPotion(), healingPotion()];
}
