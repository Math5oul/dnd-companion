import { create } from 'zustand';
import type { TurnState, GameSession } from '../types/turnState';
import type { Character } from '../types/character';
import { computeCharacterStats } from '../lib/characterStats';
import { getFeatureEffectsForTraits } from '../data/featureEffects';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Gera um ID de sessão simples (sem dependência externa) */
function genId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Calcula o total de ações disponíveis para o personagem.
 * Action Surge ativa → +1 ação.
 */
function calcActionsTotal(char: Character): number {
  const actionUses = char.actionUses ?? {};
  let extra = 0;
  for (const fx of getFeatureEffectsForTraits(char.traits ?? [])) {
    if (!fx?.actions) continue;
    for (const a of fx.actions) {
      if (a.grantsExtraActions && (actionUses[a.id] ?? a.maxUses ?? 0) > 0) {
        extra += a.grantsExtraActions;
      }
    }
  }
  return 1 + extra;
}

/** Cria o TurnState inicial para um personagem a partir das suas stats efetivas */
function buildInitialTurn(
  char: Character,
  sessionId: string,
  roundNumber: number,
): TurnState {
  const stats = computeCharacterStats(char);

  // Equipment-granted extra actions / bonus actions
  let extraEquipActions = 0;
  let extraEquipBonus = 0;
  for (const item of char.equipment ?? []) {
    if (!item.equipped) continue;
    for (const bonus of item.bonuses) {
      if (bonus.type === 'extra_action') extraEquipActions += bonus.value;
      if (bonus.type === 'extra_bonus_action') extraEquipBonus += bonus.value;
    }
  }

  // ── Initiative roll ────────────────────────────────────────────────────────
  const dexMod = Math.floor(((char.dex ?? 10) - 10) / 2);
  // Alert feat: +5 to initiative
  const hasAlert = (char.traits ?? []).some((t) => t.includes('alert'));
  const initiativeBonus = dexMod + (hasAlert ? 5 : 0);
  const initiativeRoll = Math.floor(Math.random() * 20) + 1;
  const initiative = initiativeRoll + initiativeBonus;

  return {
    characterId: char.id,
    sessionId,
    roundNumber,
    actionsTotal: calcActionsTotal(char) + extraEquipActions,
    actionsUsed: 0,
    bonusActionsTotal: 1 + extraEquipBonus,
    bonusActionsUsed: 0,
    reactionsTotal: 1,
    reactionsUsed: 0,
    movementTotal: stats.speed,
    movementUsed: 0,
    isActive: false,
    initiative,
    initiativeRoll,
    initiativeBonus,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface TurnStore {
  session: GameSession | null;
  turns: Record<string, TurnState>;

  // ── Sessão ──
  /** Inicia uma nova sessão de combate com os personagens fornecidos */
  startSession: (name: string, characters: Character[]) => void;
  /** Encerra a sessão e limpa todo o estado de turno */
  endSession: () => void;

  // ── Fluxo de turno ──
  /** Marca o turno deste personagem como ativo e reseta seus recursos */
  startTurn: (characterId: string) => void;
  /** Finaliza o turno e ativa automaticamente o próximo na ordem */
  endTurn: (characterId: string) => void;

  // ── Consumo de recursos ──
  useAction: (characterId: string) => void;
  useBonusAction: (characterId: string) => void;
  useReaction: (characterId: string) => void;
  /** Incrementa movimento usado em `feet` pés (limitado ao total) */
  useMovement: (characterId: string, feet: number) => void;

  // ── Desfazer ──
  undoAction: (characterId: string) => void;
  undoBonusAction: (characterId: string) => void;
  undoReaction: (characterId: string) => void;
  /** Decrementa movimento usado em `feet` pés (mínimo 0) */
  undoMovement: (characterId: string, feet: number) => void;

  // ── Atualizar turn state de um personagem (ex: após Action Surge ser usado) ──
  refreshTurn: (char: Character) => void;
}

export const useTurnStore = create<TurnStore>((set, get) => ({
  session: null,
  turns: {},

  // ── Sessão ────────────────────────────────────────────────────────────────

  startSession: (name, characters) => {
    const sessionId = genId();
    const turns: Record<string, TurnState> = {};
    for (const char of characters) {
      turns[char.id] = buildInitialTurn(char, sessionId, 1);
    }
    // O primeiro personagem começa como ativo
    const firstId = characters[0]?.id;
    if (firstId) turns[firstId] = { ...turns[firstId], isActive: true };

    set({
      session: {
        id: sessionId,
        name,
        characterIds: characters.map((c) => c.id),
        activeCharacterId: firstId ?? null,
        roundNumber: 1,
      },
      turns,
    });
  },

  endSession: () => set({ session: null, turns: {} }),

  // ── Fluxo de turno ────────────────────────────────────────────────────────

  startTurn: (characterId) => {
    set((s) => {
      if (!s.session) return s;
      const turns = { ...s.turns };
      // Desativar todos
      for (const id of Object.keys(turns)) {
        turns[id] = { ...turns[id], isActive: false };
      }
      // Ativar este
      if (turns[characterId]) {
        turns[characterId] = {
          ...turns[characterId],
          isActive: true,
          actionsUsed: 0,
          bonusActionsUsed: 0,
          reactionsUsed: 0,
          movementUsed: 0,
        };
      }
      return {
        turns,
        session: { ...s.session, activeCharacterId: characterId },
      };
    });
  },

  endTurn: (characterId) => {
    set((s) => {
      if (!s.session) return s;
      const turns = { ...s.turns };
      if (turns[characterId]) {
        turns[characterId] = { ...turns[characterId], isActive: false };
      }

      const ids = s.session.characterIds;
      const idx = ids.indexOf(characterId);
      const nextIdx = (idx + 1) % ids.length;
      const nextId = ids[nextIdx];
      const isNewRound = nextIdx === 0;
      const nextRound = isNewRound
        ? s.session.roundNumber + 1
        : s.session.roundNumber;

      if (turns[nextId]) {
        turns[nextId] = {
          ...turns[nextId],
          actionsUsed: 0,
          bonusActionsUsed: 0,
          reactionsUsed: 0,
          movementUsed: 0,
          roundNumber: nextRound,
          isActive: true,
        };
      }

      return {
        turns,
        session: {
          ...s.session,
          activeCharacterId: nextId,
          roundNumber: nextRound,
        },
      };
    });
  },

  // ── Consumo ───────────────────────────────────────────────────────────────

  useAction: (characterId) =>
    set((s) => {
      const t = s.turns[characterId];
      if (!t || t.actionsUsed >= t.actionsTotal) return s;
      return {
        turns: {
          ...s.turns,
          [characterId]: { ...t, actionsUsed: t.actionsUsed + 1 },
        },
      };
    }),

  useBonusAction: (characterId) =>
    set((s) => {
      const t = s.turns[characterId];
      if (!t || t.bonusActionsUsed >= t.bonusActionsTotal) return s;
      return {
        turns: {
          ...s.turns,
          [characterId]: { ...t, bonusActionsUsed: t.bonusActionsUsed + 1 },
        },
      };
    }),

  useReaction: (characterId) =>
    set((s) => {
      const t = s.turns[characterId];
      if (!t || t.reactionsUsed >= t.reactionsTotal) return s;
      return {
        turns: {
          ...s.turns,
          [characterId]: { ...t, reactionsUsed: t.reactionsUsed + 1 },
        },
      };
    }),

  useMovement: (characterId, feet) =>
    set((s) => {
      const t = s.turns[characterId];
      if (!t) return s;
      const newUsed = Math.min(t.movementTotal, t.movementUsed + feet);
      return {
        turns: {
          ...s.turns,
          [characterId]: { ...t, movementUsed: newUsed },
        },
      };
    }),

  // ── Desfazer ──────────────────────────────────────────────────────────────

  undoAction: (characterId) =>
    set((s) => {
      const t = s.turns[characterId];
      if (!t || t.actionsUsed <= 0) return s;
      return {
        turns: {
          ...s.turns,
          [characterId]: { ...t, actionsUsed: t.actionsUsed - 1 },
        },
      };
    }),

  undoBonusAction: (characterId) =>
    set((s) => {
      const t = s.turns[characterId];
      if (!t || t.bonusActionsUsed <= 0) return s;
      return {
        turns: {
          ...s.turns,
          [characterId]: { ...t, bonusActionsUsed: t.bonusActionsUsed - 1 },
        },
      };
    }),

  undoReaction: (characterId) =>
    set((s) => {
      const t = s.turns[characterId];
      if (!t || t.reactionsUsed <= 0) return s;
      return {
        turns: {
          ...s.turns,
          [characterId]: { ...t, reactionsUsed: t.reactionsUsed - 1 },
        },
      };
    }),

  undoMovement: (characterId, feet) =>
    set((s) => {
      const t = s.turns[characterId];
      if (!t) return s;
      const newUsed = Math.max(0, t.movementUsed - feet);
      return {
        turns: {
          ...s.turns,
          [characterId]: { ...t, movementUsed: newUsed },
        },
      };
    }),

  refreshTurn: (char) => {
    set((s) => {
      const existing = s.turns[char.id];
      if (!existing) return s;
      return {
        turns: {
          ...s.turns,
          [char.id]: {
            ...existing,
            actionsTotal: calcActionsTotal(char),
            movementTotal: computeCharacterStats(char).speed,
          },
        },
      };
    });
  },
}));
