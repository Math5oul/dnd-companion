import { create } from 'zustand';
import { Character, CharacterDraft, AbilityName, AbilityScores } from '../types/character';
import { Equipment } from '../types/equipment';
import { supabase } from '../lib/supabase';
import { getClassById } from '../data/classes';
import { calculateStartingHp, rollDamage } from '../lib/dice';

const EMPTY_DRAFT: CharacterDraft = {
  name: '',
  race: '',
  className: '',
  level: 1,
  abilityScores: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
};

interface CharacterStore {
  characters: Character[];
  draft: CharacterDraft;
  rolledValues: number[];
  assignedValues: Partial<Record<AbilityName, number>>;
  loading: boolean;

  // Draft actions
  setDraftName: (name: string) => void;
  setDraftRace: (race: string) => void;
  setDraftClass: (className: string) => void;
  setDraftLevel: (level: number) => void;
  setRolledValues: (values: number[]) => void;
  assignValue: (ability: AbilityName, value: number) => void;
  unassignValue: (ability: AbilityName) => void;
  resetDraft: () => void;

  // Character sheet actions
  useSpellSlot: (characterId: string, slotLevel: number) => Promise<void>;
  recoverSpellSlots: (characterId: string) => Promise<void>;
  updateHp: (characterId: string, hp: number) => Promise<void>;
  toggleSpell: (characterId: string, spellId: string) => Promise<void>;
  levelUp: (characterId: string, newTraits: string[]) => Promise<void>;
  useSorceryPoint: (characterId: string) => Promise<void>;
  recoverSorceryPoints: (characterId: string) => Promise<void>;
  useKiPoint: (characterId: string, amount?: number) => Promise<void>;
  recoverKiPoints: (characterId: string) => Promise<void>;
  shortRest: (characterId: string, diceSpent: number, hpGained: number) => Promise<void>;
  /** Converte um spell slot em pontos de feitiçaria (slot nivel N → +N pontos) */
  convertSlotToPoints: (characterId: string, slotLevel: number) => Promise<void>;
  /** Cria um spell slot gastando pontos de feitiçaria */
  convertPointsToSlot: (characterId: string, slotLevel: number) => Promise<void>;
  /** Adiciona ou remove uma proficiência de perícia */
  toggleSkillProficiency: (characterId: string, skillId: string) => Promise<void>;
  /** Adiciona uma proficiência de perícia (só adiciona, não remove — escolha permanente) */
  addSkillProficiency: (characterId: string, skillId: string) => Promise<void>;
  /** Adiciona um equipamento */
  addEquipment: (characterId: string, item: Equipment) => Promise<void>;
  /** Atualiza um equipamento existente */
  updateEquipment: (characterId: string, item: Equipment) => Promise<void>;
  /** Remove um equipamento */
  removeEquipment: (characterId: string, itemId: string) => Promise<void>;
  /** Alterna equipado/desequipado */
  toggleEquipped: (characterId: string, itemId: string) => Promise<void>;
  /**
   * Usa uma carga de um item consumível.
   * - Decrementa charges; remove o item quando chega a 0.
   * - Se o item tem useEffect.type === 'heal', rola os dados e aplica o HP.
   * Returns { hpGained } so the UI can show the result.
   */
  useEquipmentCharge: (characterId: string, itemId: string) => Promise<{ hpGained: number; detail: string }>;
  /**
   * Ativa um consumível (ex: beber a poção de sopro de fogo).
   * Não consome cargas — apenas marca activated: true para liberar os ataques.
   */
  activateConsumable: (characterId: string, itemId: string) => Promise<void>;
  /** Atualiza as moedas de ouro do personagem (delta positivo ou negativo) */
  updateGold: (characterId: string, delta: number) => Promise<void>;
  /** Salva a escolha de ASI para uma feature (ex: { strength: 2 }) */
  updateAsiChoice: (characterId: string, featureId: string, bonuses: Partial<Record<string, number>>) => Promise<void>;
  /** Usa uma ação de feature (decrementa usos) */
  useFeatureAction: (characterId: string, actionId: string, maxUses: number) => Promise<void>;
  /** Reseta usos de ações por tipo de descanso */
  resetFeatureActions: (characterId: string, resetType: 'short_rest' | 'long_rest') => Promise<void>;
  /** Salva as skills escolhidas para uma feature com pickSkills, e aplica proficiência se pickType=proficiency */
  saveFeatureChoice: (characterId: string, featureId: string, skillIds: string[]) => Promise<void>;
  /**
   * Remove itens com duration === 'long_rest' do inventário (chamado no Long Rest).
   */
  clearLongRestItems: (characterId: string) => Promise<void>;

  // CRUD
  fetchCharacters: () => Promise<void>;
  saveCharacter: () => Promise<Character | null>;
  deleteCharacter: (id: string) => Promise<void>;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  characters: [],
  draft: EMPTY_DRAFT,
  rolledValues: [],
  assignedValues: {},
  loading: false,

  setDraftName: (name) => set((s) => ({ draft: { ...s.draft, name } })),
  setDraftRace: (race) => set((s) => ({ draft: { ...s.draft, race } })),
  setDraftClass: (className) => set((s) => ({ draft: { ...s.draft, className } })),
  setDraftLevel: (level) => set((s) => ({ draft: { ...s.draft, level } })),

  setRolledValues: (values) => set({ rolledValues: values, assignedValues: {} }),

  assignValue: (ability, value) =>
    set((s) => {
      const updated = { ...s.assignedValues };
      updated[ability] = value;

      const scores: AbilityScores = {
        strength: updated.strength ?? s.draft.abilityScores.strength,
        dexterity: updated.dexterity ?? s.draft.abilityScores.dexterity,
        constitution: updated.constitution ?? s.draft.abilityScores.constitution,
        intelligence: updated.intelligence ?? s.draft.abilityScores.intelligence,
        wisdom: updated.wisdom ?? s.draft.abilityScores.wisdom,
        charisma: updated.charisma ?? s.draft.abilityScores.charisma,
      };
      return {
        assignedValues: updated,
        draft: { ...s.draft, abilityScores: scores },
      };
    }),

  unassignValue: (ability) =>
    set((s) => {
      const updated = { ...s.assignedValues };
      delete updated[ability];
      return { assignedValues: updated };
    }),

  resetDraft: () => set({ draft: EMPTY_DRAFT, rolledValues: [], assignedValues: {} }),

  fetchCharacters: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('createdAt', { ascending: false });
    if (!error && data) {
      set({ characters: data as Character[] });
    }
    set({ loading: false });
  },

  saveCharacter: async () => {
    const { draft } = get();
    const cls = getClassById(draft.className);
    const maxHp = cls ? calculateStartingHp(cls.hitDie, draft.abilityScores.constitution) : 8;

    // Build spell slots from class data
    const spellSlots: Character['spellSlots'] = {};
    if (cls?.spellcaster && cls.spellSlotsByLevel) {
      const levelSlots = cls.spellSlotsByLevel[draft.level] ?? cls.spellSlotsByLevel[1] ?? [];
      levelSlots.forEach((total, index) => {
        if (total > 0) spellSlots[index + 1] = { total, used: 0 };
      });
    }

    const newChar = {
      name: draft.name,
      race: draft.race,
      className: draft.className,
      level: draft.level,
      abilityScores: draft.abilityScores,
      hp: maxHp,
      maxHp,
      spellSlots,
      // Pontos de Feitiçaria: sorcerer nível ≥ 2 começa com pontos = nível
      ...(draft.className === 'sorcerer' && draft.level >= 2
        ? { sorceryPoints: { total: draft.level, used: 0 } }
        : {}),
      // Pontos de Ki: monk nível ≥ 2 começa com pontos = nível
      ...(draft.className === 'monk' && draft.level >= 2
        ? { kiPoints: { total: draft.level, used: 0 } }
        : {}),
    };

    const { data, error } = await supabase
      .from('characters')
      .insert([newChar])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar personagem:', error.message, error.details);
      return null;
    }
    if (!data) return null;

    set((s) => ({ characters: [data as Character, ...s.characters] }));
    get().resetDraft();
    return data as Character;
  },

  useSpellSlot: async (characterId, slotLevel) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const slot = char.spellSlots[slotLevel];
    if (!slot || slot.used >= slot.total) return;

    const updated = {
      ...char.spellSlots,
      [slotLevel]: { ...slot, used: slot.used + 1 },
    };
    await supabase.from('characters').update({ spellSlots: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, spellSlots: updated } : c
      ),
    }));
  },

  recoverSpellSlots: async (characterId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const recovered: Character['spellSlots'] = {};
    Object.entries(char.spellSlots).forEach(([lvl, slot]) => {
      recovered[Number(lvl)] = { ...slot, used: 0 };
    });
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, spellSlots: recovered, hitDiceUsed: 0 } : c
      ),
    }));
    const { error } = await supabase.from('characters').update({ spellSlots: recovered, hitDiceUsed: 0 }).eq('id', characterId);
    if (error) console.warn('[recoverSpellSlots] Supabase error:', error.message);
  },

  updateHp: async (characterId, hp) => {
    await supabase.from('characters').update({ hp }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, hp } : c
      ),
    }));
  },

  deleteCharacter: async (id) => {
    const { error } = await supabase.from('characters').delete().eq('id', id);
    if (error) {
      console.error('Erro ao deletar:', error.message);
      return;
    }
    set((s) => ({ characters: s.characters.filter((c) => c.id !== id) }));
  },

  toggleSpell: async (characterId, spellId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const current = char.spells ?? [];
    const updated = current.includes(spellId)
      ? current.filter((s) => s !== spellId)
      : [...current, spellId];
    await supabase.from('characters').update({ spells: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, spells: updated } : c
      ),
    }));
  },

  levelUp: async (characterId, newTraits) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const newLevel = char.level + 1;
    const cls = getClassById(char.className);

    // Atualiza spell slots para o novo nível
    let spellSlots = char.spellSlots;
    if (cls?.spellcaster && cls.spellSlotsByLevel) {
      const levelSlots = cls.spellSlotsByLevel[newLevel];
      if (levelSlots) {
        const updated: Character['spellSlots'] = {};
        levelSlots.forEach((total, index) => {
          if (total > 0) {
            const prev = spellSlots[index + 1];
            updated[index + 1] = { total, used: prev?.used ?? 0 };
          }
        });
        spellSlots = updated;
      }
    }

    // HP sobe: adiciona o dado de vida + mod CON
    const { rollDie, getModifier } = await import('../lib/dice');
    const hpGain = Math.max(1, rollDie(cls?.hitDie ?? 8) + getModifier(char.abilityScores.constitution));
    const newMaxHp = char.maxHp + hpGain;
    const newHp = char.hp + hpGain;

    // Acumula traits existentes com os novos
    const existingTraits = char.traits ?? [];
    const mergedTraits = Array.from(new Set([...existingTraits, ...newTraits]));

    // Pontos de Feitiçaria: atualiza total no level up (sorcerer nível ≥ 2 = total igual ao nível)
    let sorceryPoints = char.sorceryPoints;
    if (char.className === 'sorcerer') {
      const newTotal = newLevel >= 2 ? newLevel : 0;
      const usedSoFar = sorceryPoints?.used ?? 0;
      sorceryPoints = newTotal > 0
        ? { total: newTotal, used: Math.min(usedSoFar, newTotal) }
        : undefined;
    }

    // Pontos de Ki: monk nível ≥ 2 = total igual ao nível
    let kiPoints = char.kiPoints;
    if (char.className === 'monk') {
      const newTotal = newLevel >= 2 ? newLevel : 0;
      const usedSoFar = kiPoints?.used ?? 0;
      kiPoints = newTotal > 0
        ? { total: newTotal, used: Math.min(usedSoFar, newTotal) }
        : undefined;
    }

    const patch = { level: newLevel, maxHp: newMaxHp, hp: newHp, spellSlots, traits: mergedTraits,
      ...(sorceryPoints !== undefined ? { sorceryPoints } : {}),
      ...(kiPoints !== undefined ? { kiPoints } : {}) };
    const { error } = await supabase.from('characters').update(patch).eq('id', characterId);
    if (error) { console.error('Erro ao level up:', error.message); return; }
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, ...patch } : c
      ),
    }));
  },

  useSorceryPoint: async (characterId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char?.sorceryPoints) return;
    const { total, used } = char.sorceryPoints;
    if (used >= total) return;
    const updated = { total, used: used + 1 };
    await supabase.from('characters').update({ sorceryPoints: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, sorceryPoints: updated } : c
      ),
    }));
  },

  recoverSorceryPoints: async (characterId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char?.sorceryPoints) return;
    const recovered = { total: char.sorceryPoints.total, used: 0 };
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, sorceryPoints: recovered } : c
      ),
    }));
    const { error } = await supabase.from('characters').update({ sorceryPoints: recovered }).eq('id', characterId);
    if (error) console.warn('[recoverSorceryPoints] Supabase error (run migration):', error.message);
  },

  useKiPoint: async (characterId, amount = 1) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char?.kiPoints) return;
    const { total, used } = char.kiPoints;
    if (used + amount > total) return;
    const updated = { total, used: used + amount };
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, kiPoints: updated } : c
      ),
    }));
    const { error } = await supabase.from('characters').update({ kiPoints: updated }).eq('id', characterId);
    if (error) console.warn('[useKiPoint] Supabase error (run migration):', error.message);
  },

  recoverKiPoints: async (characterId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    // Initialize if not set (existing monk)
    const total = char.kiPoints?.total ?? char.level;
    const recovered = { total, used: 0 };
    // Always update local state first
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, kiPoints: recovered } : c
      ),
    }));
    const { error } = await supabase.from('characters').update({ kiPoints: recovered }).eq('id', characterId);
    if (error) console.warn('[recoverKiPoints] Supabase error (run migration):', error.message);
  },

  shortRest: async (characterId, diceSpent, hpGained) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const newHp = Math.min(char.maxHp, char.hp + hpGained);
    const newHitDiceUsed = (char.hitDiceUsed ?? 0) + diceSpent;

    // Warlock: recover pact magic slots on short rest
    let spellSlots = char.spellSlots;
    if (char.className === 'warlock') {
      const recovered: Character['spellSlots'] = {};
      Object.entries(char.spellSlots).forEach(([lvl, slot]) => {
        recovered[Number(lvl)] = { ...slot, used: 0 };
      });
      spellSlots = recovered;
    }

    // Monk: recover all ki points on short rest
    let kiPoints = char.kiPoints;
    if (char.className === 'monk' && kiPoints) {
      kiPoints = { total: kiPoints.total, used: 0 };
    } else if (char.className === 'monk' && !kiPoints) {
      // Initialize if not yet set
      kiPoints = { total: char.level, used: 0 };
    }

    const patch: Record<string, unknown> = { hp: newHp, hitDiceUsed: newHitDiceUsed, spellSlots };
    if (kiPoints !== char.kiPoints) patch.kiPoints = kiPoints;

    // Update local state first
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, ...patch, kiPoints: kiPoints ?? c.kiPoints } : c
      ),
    }));
    const { error } = await supabase.from('characters').update(patch).eq('id', characterId);
    if (error) console.warn('[shortRest] Supabase error:', error.message);
  },

  // Slot → Pontos: converte 1 slot usado/disponível em pontos (N pontos = nível do slot)
  convertSlotToPoints: async (characterId, slotLevel) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char?.sorceryPoints) return;
    const slot = char.spellSlots[slotLevel];
    if (!slot) return;
    const available = slot.total - slot.used;
    if (available <= 0) return; // sem slots disponíveis desse nível

    const { total, used: spUsed } = char.sorceryPoints;
    const gain = slotLevel; // N pontos = nível do slot
    const newSpUsed = Math.max(0, spUsed - gain); // "recupera" pontos reduzindo used

    // Consome o slot
    const newSlots = {
      ...char.spellSlots,
      [slotLevel]: { ...slot, used: slot.used + 1 },
    };
    const newSorcery = { total, used: newSpUsed };

    await supabase.from('characters').update({ spellSlots: newSlots, sorceryPoints: newSorcery }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, spellSlots: newSlots, sorceryPoints: newSorcery } : c
      ),
    }));
  },

  // Pontos → Slot: cria 1 slot gastando pontos de feitiçaria
  // Custo: 1°=2pts, 2°=3pts, 3°=5pts, 4°=6pts, 5°=7pts
  convertPointsToSlot: async (characterId, slotLevel) => {
    const COST: Record<number, number> = { 1: 2, 2: 3, 3: 5, 4: 6, 5: 7 };
    const cost = COST[slotLevel];
    if (!cost) return;

    const char = get().characters.find((c) => c.id === characterId);
    if (!char?.sorceryPoints) return;

    const { total, used: spUsed } = char.sorceryPoints;
    const available = total - spUsed;
    if (available < cost) return; // pontos insuficientes

    // Gasta os pontos
    const newSorcery = { total, used: spUsed + cost };

    // Recupera (ou cria) 1 slot desse nível
    const existingSlot = char.spellSlots[slotLevel];
    const newSlots = {
      ...char.spellSlots,
      [slotLevel]: existingSlot
        ? { ...existingSlot, used: Math.max(0, existingSlot.used - 1) }
        : { total: 1, used: 0 },
    };

    await supabase.from('characters').update({ spellSlots: newSlots, sorceryPoints: newSorcery }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, spellSlots: newSlots, sorceryPoints: newSorcery } : c
      ),
    }));
  },

  toggleSkillProficiency: async (characterId, skillId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const current = char.skillProficiencies ?? [];
    const updated = current.includes(skillId)
      ? current.filter((s) => s !== skillId)
      : [...current, skillId];
    await supabase.from('characters').update({ skillProficiencies: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, skillProficiencies: updated } : c
      ),
    }));
  },

  addSkillProficiency: async (characterId, skillId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const current = char.skillProficiencies ?? [];
    if (current.includes(skillId)) return; // já tem, não faz nada
    const updated = [...current, skillId];
    await supabase.from('characters').update({ skillProficiencies: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, skillProficiencies: updated } : c
      ),
    }));
  },

  addEquipment: async (characterId, item) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const updated = [...(char.equipment ?? []), item];
    await supabase.from('characters').update({ equipment: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, equipment: updated } : c
      ),
    }));
  },

  updateEquipment: async (characterId, item) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const updated = (char.equipment ?? []).map((e) => e.id === item.id ? item : e);
    await supabase.from('characters').update({ equipment: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, equipment: updated } : c
      ),
    }));
  },

  removeEquipment: async (characterId, itemId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const updated = (char.equipment ?? []).filter((e) => e.id !== itemId);
    await supabase.from('characters').update({ equipment: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, equipment: updated } : c
      ),
    }));
  },

  toggleEquipped: async (characterId, itemId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const updated = (char.equipment ?? []).map((e) =>
      e.id === itemId ? { ...e, equipped: !e.equipped } : e
    );
    await supabase.from('characters').update({ equipment: updated }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, equipment: updated } : c
      ),
    }));
  },

  useEquipmentCharge: async (characterId, itemId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return { hpGained: 0, detail: '' };

    const item = (char.equipment ?? []).find((e) => e.id === itemId);
    if (!item) return { hpGained: 0, detail: '' };

    // Roll healing BEFORE mutating state
    let hpGained = 0;
    let detail = '';
    if (item.useEffect?.type === 'heal') {
      const result = rollDamage(item.useEffect.dice);
      hpGained = result.total;
      detail = result.detail;
    }

    // Decrement charges
    const newCharges = (item.charges ?? 1) - 1;

    let updatedEquipment: Equipment[];
    if (newCharges <= 0) {
      // Remove item when all charges are used
      updatedEquipment = (char.equipment ?? []).filter((e) => e.id !== itemId);
    } else {
      updatedEquipment = (char.equipment ?? []).map((e) =>
        e.id === itemId ? { ...e, charges: newCharges } : e
      );
    }

    // Apply HP if heal effect
    let newHp = char.hp;
    if (hpGained > 0) {
      newHp = Math.min(char.maxHp, char.hp + hpGained);
    }

    await supabase
      .from('characters')
      .update({ equipment: updatedEquipment, hp: newHp })
      .eq('id', characterId);

    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, equipment: updatedEquipment, hp: newHp } : c
      ),
    }));

    return { hpGained, detail };
  },

  clearLongRestItems: async (characterId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    // Remove activated long_rest equipment (e.g. fire breath potion after charges)
    const updatedEquipment = (char.equipment ?? []).filter(
      (e) => !(e.duration === 'long_rest' && e.activated === true)
    );
    // Remove active effects that expire on long rest
    const updatedEffects = (char.activeEffects ?? []).filter(
      (e) => e.expiresOn !== 'long_rest'
    );
    // Update local state first
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId
          ? { ...c, equipment: updatedEquipment, activeEffects: updatedEffects }
          : c
      ),
    }));
    // Try patching activeEffects separately so a missing column doesn't block equipment update
    const { error: e1 } = await supabase
      .from('characters')
      .update({ equipment: updatedEquipment })
      .eq('id', characterId);
    if (e1) console.warn('[clearLongRestItems] equipment error:', e1.message);
    const { error: e2 } = await supabase
      .from('characters')
      .update({ activeEffects: updatedEffects })
      .eq('id', characterId);
    if (e2) console.warn('[clearLongRestItems] activeEffects error (run migration):', e2.message);
  },

  activateConsumable: async (characterId, itemId) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;

    const item = (char.equipment ?? []).find((e) => e.id === itemId);
    if (!item) return;

    const isStatBoost = item.bonuses.length > 0 && item.attacks.length === 0;

    if (isStatBoost && item.duration === 'long_rest') {
      // Stat-boost potion (e.g. Poção de Agilidade):
      // Remove item from inventory immediately + add a persistent ActiveEffect
      const updatedEquipment = (char.equipment ?? []).filter((e) => e.id !== itemId);
      const newEffect = {
        id: `effect_${itemId}_${Date.now()}`,
        name: item.name,
        bonuses: item.bonuses,
        expiresOn: 'long_rest' as const,
      };
      const updatedEffects = [...(char.activeEffects ?? []), newEffect];
      await supabase
        .from('characters')
        .update({ equipment: updatedEquipment, activeEffects: updatedEffects })
        .eq('id', characterId);
      set((s) => ({
        characters: s.characters.map((c) =>
          c.id === characterId
            ? { ...c, equipment: updatedEquipment, activeEffects: updatedEffects }
            : c
        ),
      }));
    } else {
      // Multi-charge consumable (e.g. Poção de Sopro de Fogo):
      // Keep item in inventory, set activated: true to show attacks
      const updatedEquipment = (char.equipment ?? []).map((e) =>
        e.id === itemId ? { ...e, activated: true, equipped: true } : e
      );
      await supabase.from('characters').update({ equipment: updatedEquipment }).eq('id', characterId);
      set((s) => ({
        characters: s.characters.map((c) =>
          c.id === characterId ? { ...c, equipment: updatedEquipment } : c
        ),
      }));
    }
  },

  updateGold: async (characterId, delta) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const newGold = Math.max(0, (char.gold ?? 40) + delta);
    await supabase.from('characters').update({ gold: newGold }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, gold: newGold } : c
      ),
    }));
  },

  updateAsiChoice: async (characterId, featureId, bonuses) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const newChoices = { ...(char.asiChoices ?? {}), [featureId]: bonuses };
    await supabase.from('characters').update({ asiChoices: newChoices }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, asiChoices: newChoices } : c
      ),
    }));
  },

  useFeatureAction: async (characterId, actionId, maxUses) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const current = char.actionUses?.[actionId] ?? maxUses;
    if (current <= 0) return;
    const newUses = { ...(char.actionUses ?? {}), [actionId]: current - 1 };
    await supabase.from('characters').update({ actionUses: newUses }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, actionUses: newUses } : c
      ),
    }));
  },

  resetFeatureActions: async (characterId, resetType) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    // On long rest, reset ALL. On short rest, reset short_rest actions.
    // We store the full actionUses map and clear the relevant keys.
    // For simplicity: long_rest resets everything; short_rest resets short_rest-typed actions.
    // The caller (shortRest/longRest) knows which to call.
    const newUses: Record<string, number> = {};
    // We just clear the map on long rest; on short rest we keep long_rest action uses.
    // Since we don't track types here, we pass the whole map to clear.
    if (resetType === 'long_rest') {
      // Clear all action uses — local state first
      set((s) => ({
        characters: s.characters.map((c) =>
          c.id === characterId ? { ...c, actionUses: {} } : c
        ),
      }));
      const { error } = await supabase.from('characters').update({ actionUses: {} }).eq('id', characterId);
      if (error) console.warn('[resetFeatureActions] Supabase error (run migration):', error.message);
    } else {
      // short_rest: only reset short_rest-typed keys
      const { FEATURE_EFFECTS } = await import('../data/featureEffects');
      const traits = char.traits ?? [];
      const shortRestActionIds = new Set<string>();
      for (const tid of traits) {
        const fx = FEATURE_EFFECTS[tid];
        if (!fx?.actions) continue;
        for (const a of fx.actions) {
          if (a.useType === 'short_rest') shortRestActionIds.add(a.id);
        }
      }
      const updated = { ...(char.actionUses ?? {}) };
      for (const id of shortRestActionIds) delete updated[id];
      set((s) => ({
        characters: s.characters.map((c) =>
          c.id === characterId ? { ...c, actionUses: updated } : c
        ),
      }));
      const { error } = await supabase.from('characters').update({ actionUses: updated }).eq('id', characterId);
      if (error) console.warn('[resetFeatureActions] Supabase error (run migration):', error.message);
    }
  },

  saveFeatureChoice: async (characterId, featureId, skillIds) => {
    const char = get().characters.find((c) => c.id === characterId);
    if (!char) return;
    const updatedChoices = { ...(char.featureChoices ?? {}), [featureId]: skillIds };
    // Also apply proficiency for proficiency-type picks
    const { CLASS_FEATURES } = await import('../data/classFeatures');
    const allFeatures = Object.values(CLASS_FEATURES).flat().flatMap((lf) => lf.features);
    const feature = allFeatures.find((f) => f.id === featureId);
    let updatedProfs = [...(char.skillProficiencies ?? [])];
    if (feature?.pickType === 'proficiency') {
      // Remove old choices for this feature, then add new ones
      const old = char.featureChoices?.[featureId] ?? [];
      updatedProfs = updatedProfs.filter((s) => !old.includes(s));
      for (const sid of skillIds) {
        if (!updatedProfs.includes(sid)) updatedProfs.push(sid);
      }
    }
    // Update local state immediately
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId
          ? { ...c, featureChoices: updatedChoices, skillProficiencies: updatedProfs }
          : c
      ),
    }));
    // Persist to Supabase — featureChoices and skillProficiencies separately for resilience
    const { error: e1 } = await supabase.from('characters').update({
      skillProficiencies: updatedProfs,
    }).eq('id', characterId);
    if (e1) console.warn('[saveFeatureChoice] skillProficiencies error:', e1.message);
    const { error: e2 } = await supabase.from('characters').update({
      featureChoices: updatedChoices,
    }).eq('id', characterId);
    if (e2) console.warn('[saveFeatureChoice] featureChoices error (run supabase/schema.sql migration):', e2.message);
  },
}));
