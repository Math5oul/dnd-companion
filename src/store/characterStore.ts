import { create } from 'zustand';
import { Character, CharacterDraft, AbilityName, AbilityScores } from '../types/character';
import { supabase } from '../lib/supabase';
import { getClassById } from '../data/classes';
import { calculateStartingHp } from '../lib/dice';

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
  levelUp: (characterId: string) => Promise<void>;

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
    await supabase.from('characters').update({ spellSlots: recovered }).eq('id', characterId);
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, spellSlots: recovered } : c
      ),
    }));
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

  levelUp: async (characterId) => {
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

    const patch = { level: newLevel, maxHp: newMaxHp, hp: newHp, spellSlots };
    const { error } = await supabase.from('characters').update(patch).eq('id', characterId);
    if (error) { console.error('Erro ao level up:', error.message); return; }
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === characterId ? { ...c, ...patch } : c
      ),
    }));
  },
}));
