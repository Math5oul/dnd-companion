import type { AbilityName } from './character';

export type ActionUseType = 'at_will' | 'short_rest' | 'long_rest';

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
}

/** Efeito declarativo de um trait/feature */
export interface FeatureEffect {
  /** Bônus estáticos de atributos concedidos por este trait */
  bonuses?: Partial<Record<AbilityName, number>>;
  /** IDs de magias concedidas (aparecem como ações especiais) */
  grantedSpells?: string[];
  /** Ações usáveis concedidas */
  actions?: FeatureAction[];
}
