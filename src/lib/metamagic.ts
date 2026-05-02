import type { AbilityName } from '../types/character';
import type { MetamagicOption } from '../types/combatAction';
import { getModifier } from './dice';
import { getProficiencyBonus } from '../data/skills';
import type { Character } from '../types/character';
import type { Spell } from '../data/spells';

// ─── Habilidade de conjuração por classe ─────────────────────────────────────

export const SPELLCASTING_ABILITY: Record<string, AbilityName> = {
  bard:      'charisma',
  cleric:    'wisdom',
  druid:     'wisdom',
  paladin:   'charisma',
  ranger:    'wisdom',
  sorcerer:  'charisma',
  warlock:   'charisma',
  wizard:    'intelligence',
};

// ─── Catálogo de todas as opções de metamagia ─────────────────────────────────

export const META_OPTIONS: MetamagicOption[] = [
  { id: 'quickened',  namePt: 'Magia Acelerada',     nameEn: 'Quickened Spell',  cost: 2, effect: 'quickened',  descPt: 'Conjura com ação bônus.',                  descEn: 'Cast as bonus action.' },
  { id: 'twinned',    namePt: 'Magia Geminada',       nameEn: 'Twinned Spell',    cost: 0, effect: 'twinned',    descPt: 'Aplica a 2° alvo (custo = nível).',         descEn: 'Apply to 2nd target (cost = level).' },
  { id: 'empowered',  namePt: 'Magia Potencializada', nameEn: 'Empowered Spell',  cost: 1, effect: 'empowered',  descPt: 'Relança dados de dano (até mod. CAR).',     descEn: 'Reroll damage dice (up to CHA mod).' },
  { id: 'heightened', namePt: 'Magia Intensificada',  nameEn: 'Heightened Spell', cost: 3, effect: 'heightened', descPt: 'Alvo tem desvantagem na 1ª resistência.',   descEn: 'Target has disadv. on first save.' },
  { id: 'seeking',    namePt: 'Magia Buscadora',      nameEn: 'Seeking Spell',    cost: 2, effect: 'seeking',    descPt: 'Relança ataque mágico que errou.',          descEn: 'Reroll a missed spell attack.' },
  { id: 'careful',    namePt: 'Magia Cuidadosa',      nameEn: 'Careful Spell',    cost: 1, effect: 'careful',    descPt: 'Aliados passam automaticamente na resit.',  descEn: 'Chosen creatures auto-succeed on save.' },
  { id: 'distant',    namePt: 'Magia Distante',       nameEn: 'Distant Spell',    cost: 1, effect: 'distant',    descPt: 'Dobra o alcance (mín. 9m se toque).',       descEn: 'Double range (min 30ft if touch).' },
  { id: 'extended',   namePt: 'Magia Estendida',      nameEn: 'Extended Spell',   cost: 1, effect: 'extended',   descPt: 'Dobra a duração (máx. 24h).',               descEn: 'Double duration (max 24h).' },
  { id: 'subtle',     namePt: 'Magia Sutil',          nameEn: 'Subtle Spell',     cost: 1, effect: 'subtle',     descPt: 'Conjura sem componentes V/S.',              descEn: 'Cast without V/S components.' },
  { id: 'transmuted', namePt: 'Magia Transmutada',    nameEn: 'Transmuted Spell', cost: 1, effect: 'transmuted', descPt: 'Troca o tipo de dano elemental.',            descEn: 'Change elemental damage type.' },
];

/** Detecta quais metamagias o personagem tem (sem duplicatas) */
export function detectMetamagic(traits: string[]): MetamagicOption[] {
  const found = new Set<string>();
  for (const t of traits) {
    for (const opt of META_OPTIONS) {
      if (t.endsWith(`_${opt.id}`)) found.add(opt.id);
    }
  }
  return META_OPTIONS.filter((m) => found.has(m.id));
}

/** Calcula o bônus de ataque mágico de um personagem */
export function spellAttackBonus(char: Character): number {
  const ability = SPELLCASTING_ABILITY[char.className] ?? 'intelligence';
  return getModifier(char.abilityScores[ability]) + getProficiencyBonus(char.level);
}

/** Calcula a CD de magia de um personagem */
export function spellSaveDC(char: Character): number {
  return 8 + spellAttackBonus(char);
}

/**
 * Aplica metamagia ao dano de uma magia.
 * - empowered: re-rola alguns dados (simulado como +X dano, X = mod.CHA)
 * - transmuted: mostra nota, sem efeito numérico aqui
 */
export function applyMetamagicToDamage(
  baseDmg: string,
  chosen: Set<string>,
  char: Character,
): { dmg: string; notes: string[] } {
  let dmg = baseDmg;
  const notes: string[] = [];

  if (chosen.has('empowered')) {
    const chaMod = getModifier(char.abilityScores.charisma);
    if (chaMod > 0) {
      dmg += `+${chaMod}`;
      notes.push(`⚗️ Potencializada (+${chaMod})`);
    }
  }
  if (chosen.has('quickened'))  notes.push('⚡ Ação Bônus');
  if (chosen.has('twinned'))    notes.push('× 2 alvos');
  if (chosen.has('heightened')) notes.push('⬇️ Desvant. na resistência');
  if (chosen.has('careful'))    notes.push('🛡️ Aliados passam na resist.');
  if (chosen.has('subtle'))     notes.push('🤫 Sem V/S');
  if (chosen.has('extended'))   notes.push('⏳ Duração dobrada');
  if (chosen.has('distant'))    notes.push('📏 Alcance dobrado');
  if (chosen.has('transmuted')) notes.push('🔄 Tipo de dano alterado');

  return { dmg, notes };
}

/** Calcula o custo total em SP das metamagias selecionadas */
export function metamagicCost(chosen: Set<string>, spellLevel: number): number {
  let total = 0;
  for (const id of chosen) {
    const opt = META_OPTIONS.find((m) => m.id === id);
    if (!opt) continue;
    total += id === 'twinned' ? Math.max(spellLevel, 1) : opt.cost;
  }
  return total;
}

/** Trait spell bonuses: Evocação Potencializada, Explosão Agonizante */
export interface SpellTraitBonus {
  id: string;
  labelPt: string;
  labelEn: string;
  damageBonus: number;
  /** se definido, só aplica a esta magia */
  onlySpellId?: string;
  /** se definido, só aplica a esta escola */
  onlySchool?: string;
}

export function getSpellTraitBonuses(char: Character): SpellTraitBonus[] {
  const bonuses: SpellTraitBonus[] = [];
  const traits = char.traits ?? [];

  // Empowered Evocation: Mago Escola da Evocação → +INT ao dano de magias de Evocação
  if (traits.includes('wiz_school_evocation')) {
    const mod = getModifier(char.abilityScores.intelligence);
    if (mod !== 0) {
      bonuses.push({
        id: 'empowered_evocation',
        labelPt: `Evocação Potencializada (+${mod} dano)`,
        labelEn: `Empowered Evocation (+${mod} dmg)`,
        damageBonus: mod,
        onlySchool: 'Evocação',
      });
    }
  }

  // Agonizing Blast: +CHA ao dano de Eldritch Blast
  if (traits.some((t) => t.startsWith('wlock_inv') && t.endsWith('_agonizing'))) {
    const mod = getModifier(char.abilityScores.charisma);
    if (mod !== 0) {
      bonuses.push({
        id: 'agonizing_blast',
        labelPt: `Explosão Agonizante (+${mod} dano)`,
        labelEn: `Agonizing Blast (+${mod} dmg)`,
        damageBonus: mod,
        onlySpellId: 'eldritch-blast',
      });
    }
  }

  return bonuses;
}

/** Filtra os bônus que se aplicam a uma magia específica */
export function traitBonusesForSpell(
  bonuses: SpellTraitBonus[],
  spell: Spell,
): SpellTraitBonus[] {
  return bonuses.filter((b) => {
    if (b.onlySpellId && b.onlySpellId !== spell.id) return false;
    if (b.onlySchool && b.onlySchool !== spell.school) return false;
    return true;
  });
}
