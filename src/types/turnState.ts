/**
 * Estado de turno de um personagem durante um combate.
 * Cada turno rastreia quantas ações, bônus, reações e movimento foram usados.
 */
export interface TurnState {
  characterId: string;
  sessionId: string;
  roundNumber: number;
  /** Ações disponíveis — normalmente 1 (pode ser 2 com Action Surge) */
  actionsTotal: number;
  actionsUsed: number;
  /** Ações bônus disponíveis — normalmente 1 */
  bonusActionsTotal: number;
  bonusActionsUsed: number;
  /** Reações disponíveis — normalmente 1 por rodada */
  reactionsTotal: number;
  reactionsUsed: number;
  /** Movimento em pés disponível no turno */
  movementTotal: number;
  movementUsed: number;
  /** Se é o turno ativo deste personagem agora */
  isActive: boolean;
  /** Resultado da rolagem de iniciativa (d20 + bônus) ao iniciar combate */
  initiative: number;
  /** O valor do d20 rolado para iniciativa (para exibição) */
  initiativeRoll: number;
  /** Bônus total aplicado à iniciativa (mod DEX + extras) */
  initiativeBonus: number;
}

/**
 * Sessão de jogo — agrupa personagens em combate.
 * Futuramente sincronizado via Supabase Realtime.
 */
export interface GameSession {
  id: string;
  name: string;
  /** IDs dos personagens participantes (ordem de iniciativa) */
  characterIds: string[];
  /** Personagem cujo turno está ativo agora */
  activeCharacterId: string | null;
  roundNumber: number;
}
