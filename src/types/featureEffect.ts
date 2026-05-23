import type { AbilityName } from './character';
import type { ActionCost } from './combatAction';

export type ActionUseType = 'at_will' | 'short_rest' | 'long_rest';

export type DamageType =
  | 'bludgeoning' | 'piercing' | 'slashing'
  | 'fire' | 'cold' | 'lightning' | 'thunder'
  | 'acid' | 'poison' | 'psychic' | 'radiant' | 'necrotic' | 'force';

/** Uma ação usável concedida por um trait/feature */
export interface FeatureAction {
  id: string;
  namePt: string;
  nameEn: string;
  descPt: string;
  descEn: string;
  useType: ActionUseType;
  /** Número fixo de usos por descanso. undefined = at_will ou derivado de fórmula */
  maxUses?: number;
  /** Dados de dano, se aplicável (ex: '2d6') */
  damageDice?: string;
  damageType?: string;
  range?: string;
  /** Tag de efeito persistente (ex: 'rage', 'ki_step') — usada para aplicar bônus automáticos */
  effectTag?: string;
  /** Se true, ativar funciona como toggle ON/OFF em vez de consumo único */
  isToggle?: boolean;
  /** Custo em pontos de ki ao ativar (gasta do pool de ki do monk) */
  kiCost?: number;
  /** Custo de ação para ativar (padrão: 'action') */
  activationCost?: ActionCost;
  /** Se ativada, concede ações extras naquele turno (ex: Action Surge = 1) */
  grantsExtraActions?: number;
}

/** Efeito declarativo de um trait/feature */
export interface FeatureEffect {
  /** Bônus estáticos de atributos concedidos por este trait */
  bonuses?: Partial<Record<AbilityName, number>>;
  /** IDs de magias concedidas (aparecem como ações especiais) */
  grantedSpells?: string[];
  /** Ações usáveis concedidas */
  actions?: FeatureAction[];
  /**
   * Bônus fixo de velocidade (pés).
   * Ex: Fast Movement = +10, Unarmored Movement = +10..+25.
   */
  speedBonus?: number;
  /**
   * Se true, o speedBonus só se aplica quando sem armadura equipada.
   * Usado por Fast Movement e Unarmored Movement.
   */
  speedRequiresUnarmored?: boolean;
  /**
   * Resistências a tipos de dano concedidas por este trait.
   * Para features com isToggle (ex: Rage), aplicadas apenas enquanto o toggle está ativo.
   */
  resistances?: DamageType[];
  /** Imunidades a condições (ex: 'frightened', 'charmed') */
  conditionImmunities?: string[];
}
