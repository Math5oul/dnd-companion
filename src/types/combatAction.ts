/** Custo de ação em D&D 5e */
export type ActionCost = 'action' | 'bonus' | 'reaction' | 'free';

/** Estado de vantagem/desvantagem por rolagem */
export type AdvDis = 'normal' | 'adv' | 'dis';

/** Efeito mecânico de uma opção de metamagia */
export type MetamagicEffect =
  | 'quickened'   // ação → ação bônus (2 sp)
  | 'twinned'     // aplica a 2 alvos (X sp = nível da magia)
  | 'empowered'   // relança dados de dano (1 sp, pode combinar)
  | 'heightened'  // desvantagem na resistência (3 sp)
  | 'seeking'     // relança ataque mágico perdido (2 sp)
  | 'careful'     // aliados passam automaticamente na resistência (1 sp)
  | 'distant'     // dobra alcance (1 sp)
  | 'extended'    // dobra duração (1 sp)
  | 'subtle'      // sem componentes V/S (1 sp)
  | 'transmuted'; // troca tipo de dano elemental (1 sp)

export interface MetamagicOption {
  id: string;         // identificador canónico ('empowered', 'quickened', …)
  namePt: string;
  nameEn: string;
  cost: number;       // pontos de feitiçaria
  descPt: string;
  descEn: string;
  effect: MetamagicEffect;
}

/** Modificador condicional derivado de um trait (Fúria, Duelo, etc.) */
export interface CombatModifier {
  id: string;
  labelPt: string;
  labelEn: string;
  /** Bônus adicional na jogada de ataque */
  attackBonus?: number;
  /** Bônus adicional no dano */
  damageBonus?: number;
  /** Dado extra de dano (ex: "1d6 fogo") */
  damageExtra?: string;
  /** Força vantagem na jogada */
  forceAdv?: boolean;
  /** Força desvantagem na jogada */
  forceDis?: boolean;
  /** Condição de ativação (para exibir na UI) */
  conditionPt?: string;
  conditionEn?: string;
}

/** Ação unificada de combate: arma, trait, magia ou básica */
export interface CombatAction {
  id: string;
  /** Fonte da ação */
  source: 'weapon' | 'feature' | 'spell' | 'basic';
  sourceNamePt: string;
  sourceNameEn: string;

  namePt: string;
  nameEn: string;
  descPt: string;
  descEn: string;
  icon: string;
  actionCost: ActionCost;

  /** Tags para filtros e lógica de modificadores */
  tags: Array<'melee' | 'ranged' | 'magical' | 'str' | 'dex' | 'healing' | 'finesse' | 'versatile'>;

  // ── Ataque ──────────────────────────────────────────────
  /** Bônus total na jogada de ataque (sem ADV/DIS) */
  attackBonus?: number;
  /** String de dano ex: "1d8+3" */
  damage?: string;
  damageType?: string;
  range?: string;

  /** Modificadores condicionais de traits activos */
  modifiers: CombatModifier[];

  // ── Consumível ──────────────────────────────────────────
  /** Se true, cada rolagem gasta 1 carga do item */
  consumeCharge?: boolean;
  /** Cargas restantes (para desabilitar quando 0) */
  charges?: number;

  // ── Magia ───────────────────────────────────────────────
  spellId?: string;
  spellLevel?: number;
  spellSlotsRemaining?: number;
  /** Spell needs a d20 attack roll */
  isSpellAttack?: boolean;
  /** Spell requires a saving throw */
  savingThrow?: { ability: string; abilityEn: string };
  /** Available metamagic options for this sorcerer */
  availableMetamagic?: MetamagicOption[];

  // ── Feature (uso limitado) ───────────────────────────────
  featureActionId?: string;
  maxUses?: number;
  useType?: 'at_will' | 'short_rest' | 'long_rest';
  effectTag?: string;
  isToggle?: boolean;
  kiCost?: number;

  // ── Referência a equipamento ────────────────────────────
  equipmentId?: string;
  attackId?: string;
}
