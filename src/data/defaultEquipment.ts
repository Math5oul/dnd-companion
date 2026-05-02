import type { EquipmentAttack, EquipmentBonus, EquipmentType } from '../types/equipment';

export interface CatalogEntry {
  nameEn: string;
  namePt: string;
  type: EquipmentType;
  goldValue: number;
  descEn: string;
  descPt: string;
  duration?: 'forever' | 'long_rest';
  charges?: number;
  maxCharges?: number;
  useEffect?: { type: 'heal' | 'temp_hp'; dice: string };
  bonuses: EquipmentBonus[];
  /** Weight in lbs */
  weight?: number;
  traitsEn: string[];
  traitsPt: string[];
  attacks: EquipmentAttack[];
}

// Helpers
const a = (id: string, name: string, bonus: number, dmg: string, dmgType: string, range: string): EquipmentAttack =>
  ({ id, name, attackBonus: bonus, damage: dmg, damageType: dmgType, range });

export const EQUIPMENT_CATALOG: CatalogEntry[] = [

  // ──────────────────────────────────────────────────────────────────────────
  // SIMPLE WEAPONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    nameEn: 'Dagger', namePt: 'Adaga', type: 'weapon', goldValue: 2, weight: 1,
    descEn: 'Finesse, light, thrown. Edit the attack bonus to add your proficiency + STR or DEX modifier.',
    descPt: 'Finesse, leve, arremessável. Edite o bônus de ataque para incluir sua proficiência + mod de FOR ou DES.',
    bonuses: [],
    traitsEn: ['Finesse — use STR or DEX modifier', 'Light — can dual wield', 'Thrown — range 20/60 ft'],
    traitsPt: ['Finesse — use mod de FOR ou DES', 'Leve — pode usar com duas armas', 'Arremessável — alcance 20/60 ft'],
    attacks: [a('atk1', 'Stab / Estocada', 0, '1d4', 'piercing', '5 ft / 20-60 ft')],
  },
  {
    nameEn: 'Club', namePt: 'Clava', type: 'weapon', goldValue: 0, weight: 2,
    descEn: 'Light simple weapon. Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Arma simples leve. Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Light — can dual wield'],
    traitsPt: ['Leve — pode usar com duas armas'],
    attacks: [a('atk1', 'Strike / Golpe', 0, '1d4', 'bludgeoning', '5 ft')],
  },
  {
    nameEn: 'Handaxe', namePt: 'Machadinha', type: 'weapon', goldValue: 5, weight: 2,
    descEn: 'Light, thrown (20/60 ft). Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Leve, arremessável (20/60 ft). Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Light — can dual wield', 'Thrown — range 20/60 ft'],
    traitsPt: ['Leve — pode usar com duas armas', 'Arremessável — alcance 20/60 ft'],
    attacks: [a('atk1', 'Chop / Corte', 0, '1d6', 'slashing', '5 ft / 20-60 ft')],
  },
  {
    nameEn: 'Javelin', namePt: 'Dardo', type: 'weapon', goldValue: 1, weight: 2,
    descEn: 'Thrown (30/120 ft). Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Arremessável (30/120 ft). Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Thrown — range 30/120 ft'],
    traitsPt: ['Arremessável — alcance 30/120 ft'],
    attacks: [a('atk1', 'Throw / Arremessar', 0, '1d6', 'piercing', '30/120 ft')],
  },
  {
    nameEn: 'Quarterstaff', namePt: 'Bordão', type: 'weapon', goldValue: 0, weight: 4,
    descEn: 'Versatile (1d8 two-handed). Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Versátil (1d8 com duas mãos). Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Versatile — deals 1d8 when wielded two-handed'],
    traitsPt: ['Versátil — causa 1d8 com duas mãos'],
    attacks: [
      a('atk1', 'Strike 1H / Golpe 1M', 0, '1d6', 'bludgeoning', '5 ft'),
      a('atk2', 'Strike 2H / Golpe 2M', 0, '1d8', 'bludgeoning', '5 ft'),
    ],
  },
  {
    nameEn: 'Shortbow', namePt: 'Arco Curto', type: 'weapon', goldValue: 25, weight: 2,
    descEn: 'Ammunition, range 80/320 ft, two-handed. Edit attack bonus to add proficiency + DEX mod.',
    descPt: 'Munição, alcance 80/320 ft, duas mãos. Edite o bônus para incluir proficiência + mod de DES.',
    bonuses: [],
    traitsEn: ['Ammunition', 'Two-handed', 'Range — 80/320 ft'],
    traitsPt: ['Munição', 'Duas mãos', 'Alcance — 80/320 ft'],
    attacks: [a('atk1', 'Arrow / Flecha', 0, '1d6', 'piercing', '80/320 ft')],
  },
  {
    nameEn: 'Light Crossbow', namePt: 'Besta Leve', type: 'weapon', goldValue: 25, weight: 5,
    descEn: 'Ammunition, loading, range 80/320 ft, two-handed. Edit attack bonus to add proficiency + DEX mod.',
    descPt: 'Munição, carregamento, alcance 80/320 ft, duas mãos. Edite o bônus para incluir proficiência + mod de DES.',
    bonuses: [],
    traitsEn: ['Ammunition', 'Two-handed', 'Loading — one attack per action', 'Range — 80/320 ft'],
    traitsPt: ['Munição', 'Duas mãos', 'Carregamento — um ataque por ação', 'Alcance — 80/320 ft'],
    attacks: [a('atk1', 'Bolt / Virote', 0, '1d8', 'piercing', '80/320 ft')],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // MARTIAL WEAPONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    nameEn: 'Shortsword', namePt: 'Espada Curta', type: 'weapon', goldValue: 10, weight: 2,
    descEn: 'Finesse, light. Edit attack bonus to add proficiency + STR or DEX mod.',
    descPt: 'Finesse, leve. Edite o bônus para incluir proficiência + mod de FOR ou DES.',
    bonuses: [],
    traitsEn: ['Finesse — use STR or DEX modifier', 'Light — can dual wield'],
    traitsPt: ['Finesse — use mod de FOR ou DES', 'Leve — pode usar com duas armas'],
    attacks: [a('atk1', 'Thrust / Estocada', 0, '1d6', 'piercing', '5 ft')],
  },
  {
    nameEn: 'Longsword', namePt: 'Espada Longa', type: 'weapon', goldValue: 15, weight: 3,
    descEn: 'Versatile (1d10 two-handed). Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Versátil (1d10 com duas mãos). Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Versatile — deals 1d10 when wielded two-handed'],
    traitsPt: ['Versátil — causa 1d10 com duas mãos'],
    attacks: [
      a('atk1', 'Slash 1H / Corte 1M', 0, '1d8', 'slashing', '5 ft'),
      a('atk2', 'Slash 2H / Corte 2M', 0, '1d10', 'slashing', '5 ft'),
    ],
  },
  {
    nameEn: 'Rapier', namePt: 'Rapieira', type: 'weapon', goldValue: 25, weight: 2,
    descEn: 'Finesse. Edit attack bonus to add proficiency + STR or DEX mod.',
    descPt: 'Finesse. Edite o bônus para incluir proficiência + mod de FOR ou DES.',
    bonuses: [],
    traitsEn: ['Finesse — use STR or DEX modifier'],
    traitsPt: ['Finesse — use mod de FOR ou DES'],
    attacks: [a('atk1', 'Thrust / Estocada', 0, '1d8', 'piercing', '5 ft')],
  },
  {
    nameEn: 'Battleaxe', namePt: 'Machado de Batalha', type: 'weapon', goldValue: 10, weight: 4,
    descEn: 'Versatile (1d10 two-handed). Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Versátil (1d10 com duas mãos). Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Versatile — deals 1d10 when wielded two-handed'],
    traitsPt: ['Versátil — causa 1d10 com duas mãos'],
    attacks: [
      a('atk1', 'Chop 1H / Corte 1M', 0, '1d8', 'slashing', '5 ft'),
      a('atk2', 'Chop 2H / Corte 2M', 0, '1d10', 'slashing', '5 ft'),
    ],
  },
  {
    nameEn: 'Warhammer', namePt: 'Martelo de Guerra', type: 'weapon', goldValue: 15, weight: 2,
    descEn: 'Versatile (1d10 two-handed). Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Versátil (1d10 com duas mãos). Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Versatile — deals 1d10 when wielded two-handed'],
    traitsPt: ['Versátil — causa 1d10 com duas mãos'],
    attacks: [
      a('atk1', 'Strike 1H / Golpe 1M', 0, '1d8', 'bludgeoning', '5 ft'),
      a('atk2', 'Strike 2H / Golpe 2M', 0, '1d10', 'bludgeoning', '5 ft'),
    ],
  },
  {
    nameEn: 'Greatsword', namePt: 'Espada Grande', type: 'weapon', goldValue: 50, weight: 6,
    descEn: 'Heavy, two-handed. Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Pesada, duas mãos. Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Heavy', 'Two-handed'],
    traitsPt: ['Pesada', 'Duas mãos'],
    attacks: [a('atk1', 'Slash / Corte', 0, '2d6', 'slashing', '5 ft')],
  },
  {
    nameEn: 'Maul', namePt: 'Malho', type: 'weapon', goldValue: 10, weight: 10,
    descEn: 'Heavy, two-handed. Edit attack bonus to add proficiency + STR mod.',
    descPt: 'Pesada, duas mãos. Edite o bônus para incluir proficiência + mod de FOR.',
    bonuses: [],
    traitsEn: ['Heavy', 'Two-handed'],
    traitsPt: ['Pesada', 'Duas mãos'],
    attacks: [a('atk1', 'Crush / Esmagar', 0, '2d6', 'bludgeoning', '5 ft')],
  },
  {
    nameEn: 'Longbow', namePt: 'Arco Longo', type: 'weapon', goldValue: 50, weight: 2,
    descEn: 'Heavy, two-handed, range 150/600 ft. Edit attack bonus to add proficiency + DEX mod.',
    descPt: 'Pesada, duas mãos, alcance 150/600 ft. Edite o bônus para incluir proficiência + mod de DES.',
    bonuses: [],
    traitsEn: ['Heavy', 'Two-handed', 'Ammunition', 'Range — 150/600 ft'],
    traitsPt: ['Pesada', 'Duas mãos', 'Munição', 'Alcance — 150/600 ft'],
    attacks: [a('atk1', 'Arrow / Flecha', 0, '1d8', 'piercing', '150/600 ft')],
  },
  {
    nameEn: 'Hand Crossbow', namePt: 'Besta de Mão', type: 'weapon', goldValue: 75, weight: 3,
    descEn: 'Light, ammunition, loading, range 30/120 ft. Edit attack bonus to add proficiency + DEX mod.',
    descPt: 'Leve, munição, carregamento, alcance 30/120 ft. Edite o bônus para incluir proficiência + mod de DES.',
    bonuses: [],
    traitsEn: ['Light', 'Ammunition', 'Loading', 'Range — 30/120 ft'],
    traitsPt: ['Leve', 'Munição', 'Carregamento', 'Alcance — 30/120 ft'],
    attacks: [a('atk1', 'Bolt / Virote', 0, '1d6', 'piercing', '30/120 ft')],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ARMOR
  // ──────────────────────────────────────────────────────────────────────────
  {
    nameEn: 'Leather Armor', namePt: 'Armadura de Couro', type: 'armor', goldValue: 10, weight: 10,
    descEn: 'Light armor. Base AC 11 + DEX modifier.',
    descPt: 'Armadura leve. CA base 11 + mod de DES.',
    bonuses: [{ type: 'ac', value: 1 }],
    traitsEn: ['Light armor — AC 11 + DEX mod'],
    traitsPt: ['Armadura leve — CA 11 + mod DES'],
    attacks: [],
  },
  {
    nameEn: 'Studded Leather', namePt: 'Couro Cravejado', type: 'armor', goldValue: 45, weight: 13,
    descEn: 'Light armor. Base AC 12 + DEX modifier.',
    descPt: 'Armadura leve. CA base 12 + mod de DES.',
    bonuses: [{ type: 'ac', value: 2 }],
    traitsEn: ['Light armor — AC 12 + DEX mod'],
    traitsPt: ['Armadura leve — CA 12 + mod DES'],
    attacks: [],
  },
  {
    nameEn: 'Chain Shirt', namePt: 'Camisola de Cota de Malha', type: 'armor', goldValue: 50, weight: 20,
    descEn: 'Medium armor. AC 13 + DEX modifier (max +2).',
    descPt: 'Armadura média. CA 13 + mod de DES (máx +2).',
    bonuses: [{ type: 'ac', value: 3 }],
    traitsEn: ['Medium armor — AC 13 + DEX mod (max +2)'],
    traitsPt: ['Armadura média — CA 13 + mod DES (máx +2)'],
    attacks: [],
  },
  {
    nameEn: 'Scale Mail', namePt: 'Cota de Escamas', type: 'armor', goldValue: 50, weight: 45,
    descEn: 'Medium armor. AC 14 + DEX modifier (max +2). Disadvantage on Stealth.',
    descPt: 'Armadura média. CA 14 + mod de DES (máx +2). Desvantagem em Furtividade.',
    bonuses: [{ type: 'ac', value: 4 }],
    traitsEn: ['Medium armor — AC 14 + DEX mod (max +2)', 'Stealth disadvantage'],
    traitsPt: ['Armadura média — CA 14 + mod DES (máx +2)', 'Desvantagem em Furtividade'],
    attacks: [],
  },
  {
    nameEn: 'Breastplate', namePt: 'Peitoral', type: 'armor', goldValue: 400, weight: 20,
    descEn: 'Medium armor. AC 14 + DEX modifier (max +2). No Stealth disadvantage.',
    descPt: 'Armadura média. CA 14 + mod de DES (máx +2). Sem desvantagem em Furtividade.',
    bonuses: [{ type: 'ac', value: 4 }],
    traitsEn: ['Medium armor — AC 14 + DEX mod (max +2)'],
    traitsPt: ['Armadura média — CA 14 + mod DES (máx +2)'],
    attacks: [],
  },
  {
    nameEn: 'Half Plate', namePt: 'Meia Armadura', type: 'armor', goldValue: 750, weight: 40,
    descEn: 'Medium armor. AC 15 + DEX modifier (max +2). Disadvantage on Stealth.',
    descPt: 'Armadura média. CA 15 + mod de DES (máx +2). Desvantagem em Furtividade.',
    bonuses: [{ type: 'ac', value: 5 }],
    traitsEn: ['Medium armor — AC 15 + DEX mod (max +2)', 'Stealth disadvantage'],
    traitsPt: ['Armadura média — CA 15 + mod DES (máx +2)', 'Desvantagem em Furtividade'],
    attacks: [],
  },
  {
    nameEn: 'Chain Mail', namePt: 'Cota de Malha', type: 'armor', goldValue: 75, weight: 55,
    descEn: 'Heavy armor. AC 16. Requires STR 13. Disadvantage on Stealth.',
    descPt: 'Armadura pesada. CA 16. Requer FOR 13. Desvantagem em Furtividade.',
    bonuses: [{ type: 'ac', value: 6 }],
    traitsEn: ['Heavy armor — AC 16', 'Requires STR 13', 'Stealth disadvantage'],
    traitsPt: ['Armadura pesada — CA 16', 'Requer FOR 13', 'Desvantagem em Furtividade'],
    attacks: [],
  },
  {
    nameEn: 'Splint', namePt: 'Armadura de Talas', type: 'armor', goldValue: 200, weight: 60,
    descEn: 'Heavy armor. AC 17. Requires STR 15. Disadvantage on Stealth.',
    descPt: 'Armadura pesada. CA 17. Requer FOR 15. Desvantagem em Furtividade.',
    bonuses: [{ type: 'ac', value: 7 }],
    traitsEn: ['Heavy armor — AC 17', 'Requires STR 15', 'Stealth disadvantage'],
    traitsPt: ['Armadura pesada — CA 17', 'Requer FOR 15', 'Desvantagem em Furtividade'],
    attacks: [],
  },
  {
    nameEn: 'Plate Armor', namePt: 'Armadura de Placas', type: 'armor', goldValue: 1500, weight: 65,
    descEn: 'Heavy armor. AC 18. Requires STR 15. Disadvantage on Stealth.',
    descPt: 'Armadura pesada. CA 18. Requer FOR 15. Desvantagem em Furtividade.',
    bonuses: [{ type: 'ac', value: 8 }],
    traitsEn: ['Heavy armor — AC 18', 'Requires STR 15', 'Stealth disadvantage'],
    traitsPt: ['Armadura pesada — CA 18', 'Requer FOR 15', 'Desvantagem em Furtividade'],
    attacks: [],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SHIELDS
  // ──────────────────────────────────────────────────────────────────────────
  {
    nameEn: 'Shield', namePt: 'Escudo', type: 'shield', goldValue: 10, weight: 6,
    descEn: '+2 AC. Requires one free hand.',
    descPt: '+2 CA. Requer uma mão livre.',
    bonuses: [{ type: 'ac', value: 2 }],
    traitsEn: ['Requires one free hand'],
    traitsPt: ['Requer uma mão livre'],
    attacks: [],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // MAGIC ACCESSORIES
  // ──────────────────────────────────────────────────────────────────────────
  {
    nameEn: 'Ring of Protection', namePt: 'Anel de Proteção', type: 'accessory', goldValue: 3500,
    duration: 'forever',
    descEn: '+1 bonus to AC and saving throws. Requires attunement.',
    descPt: '+1 de bônus na CA e testes de resistência. Requer sintonização.',
    bonuses: [{ type: 'ac', value: 1 }],
    traitsEn: ['+1 to all saving throws', 'Requires attunement'],
    traitsPt: ['+1 em todos os testes de resistência', 'Requer sintonização'],
    attacks: [],
  },
  {
    nameEn: 'Cloak of Protection', namePt: 'Manto de Proteção', type: 'accessory', goldValue: 3500,
    duration: 'forever',
    descEn: '+1 bonus to AC and saving throws. Requires attunement.',
    descPt: '+1 de bônus na CA e testes de resistência. Requer sintonização.',
    bonuses: [{ type: 'ac', value: 1 }],
    traitsEn: ['+1 to all saving throws', 'Requires attunement'],
    traitsPt: ['+1 em todos os testes de resistência', 'Requer sintonização'],
    attacks: [],
  },
  {
    nameEn: 'Gauntlets of Ogre Power', namePt: 'Manoplas da Força do Ogro', type: 'accessory', goldValue: 8000,
    duration: 'forever',
    descEn: 'Your Strength score becomes 19. No effect if already 19+. Requires attunement.',
    descPt: 'Sua Força se torna 19. Sem efeito se já for 19+. Requer sintonização.',
    bonuses: [{ type: 'strength', value: 4 }],
    traitsEn: ['Sets Strength to 19 (bonus is approximate — adjust as needed)', 'Requires attunement'],
    traitsPt: ['Força se torna 19 (bônus aproximado — ajuste conforme necessário)', 'Requer sintonização'],
    attacks: [],
  },
  {
    nameEn: 'Belt of Giant Strength', namePt: 'Cinto da Força do Gigante', type: 'accessory', goldValue: 13000,
    duration: 'forever',
    descEn: 'Your Strength score becomes 21. Requires attunement.',
    descPt: 'Sua Força se torna 21. Requer sintonização.',
    bonuses: [{ type: 'strength', value: 6 }],
    traitsEn: ['Sets Strength to 21 (bonus is approximate)', 'Requires attunement'],
    traitsPt: ['Força se torna 21 (bônus aproximado)', 'Requer sintonização'],
    attacks: [],
  },
  {
    nameEn: 'Headband of Intellect', namePt: 'Faixa do Intelecto', type: 'accessory', goldValue: 8000,
    duration: 'forever',
    descEn: 'Your Intelligence score becomes 19. Requires attunement.',
    descPt: 'Sua Inteligência se torna 19. Requer sintonização.',
    bonuses: [{ type: 'intelligence', value: 4 }],
    traitsEn: ['Sets Intelligence to 19 (bonus is approximate)', 'Requires attunement'],
    traitsPt: ['Inteligência se torna 19 (bônus aproximado)', 'Requer sintonização'],
    attacks: [],
  },
  {
    nameEn: "Periapt of Wisdom", namePt: 'Amuleto da Sabedoria', type: 'accessory', goldValue: 8000,
    duration: 'forever',
    descEn: 'Your Wisdom score becomes 19. Requires attunement.',
    descPt: 'Sua Sabedoria se torna 19. Requer sintonização.',
    bonuses: [{ type: 'wisdom', value: 4 }],
    traitsEn: ['Sets Wisdom to 19 (bonus is approximate)', 'Requires attunement'],
    traitsPt: ['Sabedoria se torna 19 (bônus aproximado)', 'Requer sintonização'],
    attacks: [],
  },
  {
    nameEn: 'Amulet of Health', namePt: 'Amuleto da Saúde', type: 'accessory', goldValue: 8000,
    duration: 'forever',
    descEn: 'Your Constitution score becomes 19. Requires attunement.',
    descPt: 'Sua Constituição se torna 19. Requer sintonização.',
    bonuses: [{ type: 'constitution', value: 4 }],
    traitsEn: ['Sets Constitution to 19 (bonus is approximate)', 'Requires attunement'],
    traitsPt: ['Constituição se torna 19 (bônus aproximado)', 'Requer sintonização'],
    attacks: [],
  },
  {
    nameEn: 'Boots of Speed', namePt: 'Botas de Velocidade', type: 'accessory', goldValue: 4000, weight: 2,
    duration: 'long_rest',
    descEn: 'Double your movement speed as a bonus action. Lasts until your next Long Rest.',
    descPt: 'Dobra a velocidade de movimento como ação bônus. Dura até o próximo Descanso Longo.',
    bonuses: [],
    traitsEn: ['Bonus action: double movement speed until end of turn', 'Expires on Long Rest'],
    traitsPt: ['Ação bônus: dobra a velocidade até o fim do turno', 'Expira no Descanso Longo'],
    attacks: [],
  },
  {
    nameEn: 'Boots of Elvenkind', namePt: 'Botas dos Elfos', type: 'accessory', goldValue: 2500, weight: 2,
    duration: 'forever',
    descEn: 'Advantage on Stealth checks (sound-based).',
    descPt: 'Vantagem em testes de Furtividade (som).',
    bonuses: [],
    traitsEn: ['Advantage on Stealth checks that rely on sound'],
    traitsPt: ['Vantagem em testes de Furtividade baseados em som'],
    attacks: [],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CONSUMABLES
  // ──────────────────────────────────────────────────────────────────────────
  {
    nameEn: 'Healing Potion', namePt: 'Poção de Cura', type: 'consumable', goldValue: 50, weight: 0.5,
    charges: 1, maxCharges: 1,
    useEffect: { type: 'heal', dice: '2d4+2' },
    descEn: 'Drink (bonus action if self) to restore 2d4+2 HP. Automatically removed when used.',
    descPt: 'Beba (ação bônus em si mesmo) para restaurar 2d4+2 PV. Removida automaticamente ao usar.',
    bonuses: [],
    traitsEn: ['Restores 2d4+2 HP — auto-removed on use'],
    traitsPt: ['Restaura 2d4+2 PV — removida automaticamente ao usar'],
    attacks: [],
  },
  {
    nameEn: 'Greater Healing Potion', namePt: 'Poção de Cura Superior', type: 'consumable', goldValue: 150, weight: 0.5,
    charges: 1, maxCharges: 1,
    useEffect: { type: 'heal', dice: '4d4+4' },
    descEn: 'Drink to restore 4d4+4 HP. Automatically removed when used.',
    descPt: 'Beba para restaurar 4d4+4 PV. Removida automaticamente ao usar.',
    bonuses: [],
    traitsEn: ['Restores 4d4+4 HP — auto-removed on use'],
    traitsPt: ['Restaura 4d4+4 PV — removida automaticamente ao usar'],
    attacks: [],
  },
  {
    nameEn: 'Superior Healing Potion', namePt: 'Poção de Cura Suprema', type: 'consumable', goldValue: 450, weight: 0.5,
    charges: 1, maxCharges: 1,
    useEffect: { type: 'heal', dice: '8d4+8' },
    descEn: 'Restores 8d4+8 HP. Automatically removed when used.',
    descPt: 'Restaura 8d4+8 PV. Removida automaticamente ao usar.',
    bonuses: [],
    traitsEn: ['Restores 8d4+8 HP — auto-removed on use'],
    traitsPt: ['Restaura 8d4+8 PV — removida automaticamente ao usar'],
    attacks: [],
  },
  {
    nameEn: 'Potion of Fire Breath', namePt: 'Poção de Sopro de Fogo', type: 'consumable', goldValue: 150, weight: 0.5,
    charges: 3, maxCharges: 3,
    duration: 'long_rest',
    descEn: 'Drink once to activate 3 fire breath charges. Bonus action: 30-ft cone, 4d6 fire (DEX DC 13 half). Removed after 3 attacks or Long Rest.',
    descPt: 'Beba uma vez para ativar 3 cargas de sopro de fogo. Ação bônus: cone 9m, 4d6 fogo (DES TR 13 metade). Removida após 3 ataques ou Descanso Longo.',
    bonuses: [],
    traitsEn: ['Drink once — activates 3 fire breath charges', 'Bonus action: 30-ft cone, 4d6 fire, DEX DC 13 half', 'Removed after all 3 charges or Long Rest'],
    traitsPt: ['Beba uma vez — ativa 3 cargas de sopro de fogo', 'Ação bônus: cone 9m, 4d6 fogo, DES TR 13 metade', 'Removida após 3 cargas ou Descanso Longo'],
    attacks: [a('atk1', '🔥 Fire Breath / Sopro de Fogo', 0, '4d6', 'fire', '30 ft cone')],
  },
  {
    nameEn: 'Antitoxin', namePt: 'Antitoxina', type: 'consumable', goldValue: 50, weight: 0,
    charges: 1, maxCharges: 1,
    descEn: 'Advantage on saving throws against poison for 1 hour. Automatically removed when used.',
    descPt: 'Vantagem em testes de resistência contra veneno por 1 hora. Removida automaticamente ao usar.',
    bonuses: [],
    traitsEn: ['Advantage on saving throws vs. poison for 1 hour', 'Auto-removed on use'],
    traitsPt: ['Vantagem em TR contra veneno por 1 hora', 'Removida automaticamente ao usar'],
    attacks: [],
  },
  {
    nameEn: 'Potion of Agility', namePt: 'Poção de Agilidade', type: 'consumable', goldValue: 180, weight: 0.5,
    charges: 1, maxCharges: 1,
    duration: 'long_rest',
    descEn: 'Drink to gain +4 Dexterity until your next Long Rest. Removed automatically after resting.',
    descPt: 'Beba para ganhar +4 de Destreza até o próximo Descanso Longo. Removida automaticamente ao descansar.',
    bonuses: [{ type: 'dexterity', value: 4 }],
    traitsEn: ['+4 DEX while active', 'Expires on Long Rest — auto-removed'],
    traitsPt: ['+4 DES enquanto ativa', 'Expira no Descanso Longo — removida automaticamente'],
    attacks: [],
  },
  {
    nameEn: 'Potion of Giant Strength', namePt: 'Poção de Força do Gigante', type: 'consumable', goldValue: 250, weight: 0.5,
    charges: 1, maxCharges: 1,
    duration: 'long_rest',
    descEn: 'Drink to gain +6 Strength until your next Long Rest. Removed automatically after resting.',
    descPt: 'Beba para ganhar +6 de Força até o próximo Descanso Longo. Removida automaticamente ao descansar.',
    bonuses: [{ type: 'strength', value: 6 }],
    traitsEn: ['+6 STR while active', 'Expires on Long Rest — auto-removed'],
    traitsPt: ['+6 FOR enquanto ativa', 'Expira no Descanso Longo — removida automaticamente'],
    attacks: [],
  },
  {
    nameEn: 'Potion of Heroism', namePt: 'Poção de Heroísmo', type: 'consumable', goldValue: 180, weight: 0.5,
    charges: 1, maxCharges: 1,
    duration: 'long_rest',
    descEn: 'Drink to gain +2 to all ability scores until your next Long Rest.',
    descPt: 'Beba para ganhar +2 em todos os atributos até o próximo Descanso Longo.',
    bonuses: [
      { type: 'strength', value: 2 },
      { type: 'dexterity', value: 2 },
      { type: 'constitution', value: 2 },
      { type: 'intelligence', value: 2 },
      { type: 'wisdom', value: 2 },
      { type: 'charisma', value: 2 },
    ],
    traitsEn: ['+2 to all ability scores while active', 'Expires on Long Rest — auto-removed'],
    traitsPt: ['+2 em todos os atributos enquanto ativa', 'Expira no Descanso Longo — removida automaticamente'],
    attacks: [],
  },
  {
    nameEn: 'Torch', namePt: 'Tocha', type: 'other', goldValue: 0, weight: 1,
    descEn: 'Sheds bright light in a 20-ft radius and dim light for an additional 20 ft for 1 hour.',
    descPt: 'Luz brilhante em 6m e luz fraca em mais 6m por 1 hora.',
    bonuses: [],
    traitsEn: ['Bright light 20 ft, dim light 20 ft — 1 hour', 'Can deal 1 fire damage on hit'],
    traitsPt: ['Luz brilhante 6m, fraca 6m — 1 hora', 'Pode causar 1 de dano de fogo no acerto'],
    attacks: [],
  },
];

/** Returns catalog entries filtered by type (undefined = all) */
export function getCatalogByType(type?: string): CatalogEntry[] {
  if (!type || type === 'all') return EQUIPMENT_CATALOG;
  return EQUIPMENT_CATALOG.filter((e) => e.type === type);
}
