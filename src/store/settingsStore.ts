import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppTheme = 'dark' | 'sepia' | 'abyss' | 'necro' | 'onyx';
export type AppLanguage = 'pt' | 'en';
export type UnitSystem = 'metric' | 'imperial';

export interface Settings {
  theme: AppTheme;
  language: AppLanguage;
  units: UnitSystem;
}

interface SettingsStore extends Settings {
  setTheme: (t: AppTheme) => void;
  setLanguage: (l: AppLanguage) => void;
  setUnits: (u: UnitSystem) => void;
  loadSettings: () => Promise<void>;
}

const STORAGE_KEY = 'dnd_settings';

export const THEMES: Record<AppTheme, { bg: string; surface: string; accent: string; text: string; subtext: string; border: string }> = {
  dark: {
    bg: '#1a0a00',
    surface: '#2d1a00',
    accent: '#c9a84c',
    text: '#f0e0c0',
    subtext: '#8a7060',
    border: '#c9a84c33',
  },
  sepia: {
    bg: '#2e1f0e',
    surface: '#3d2c18',
    accent: '#e8c97a',
    text: '#f5ead0',
    subtext: '#a08060',
    border: '#e8c97a33',
  },
  abyss: {
    bg: '#0a0a1a',
    surface: '#141428',
    accent: '#7c6af0',
    text: '#d0ccff',
    subtext: '#5a5880',
    border: '#7c6af033',
  },
  necro: {
    bg: '#071a14',
    surface: '#0e2b20',
    accent: '#3dd6a3',
    text: '#c8f0e0',
    subtext: '#4a8a72',
    border: '#3dd6a333',
  },
  onyx: {
    bg: '#0a0a0a',
    surface: '#161616',
    accent: '#d4a017',
    text: '#f0e8cc',
    subtext: '#6a6050',
    border: '#d4a01733',
  },
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  theme: 'dark',
  language: 'pt',
  units: 'metric',

  setTheme: async (theme) => {
    set({ theme });
    const s = get();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, language: s.language, units: s.units }));
  },

  setLanguage: async (language) => {
    set({ language });
    const s = get();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: s.theme, language, units: s.units }));
  },

  setUnits: async (units) => {
    set({ units });
    const s = get();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: s.theme, language: s.language, units }));
  },

  loadSettings: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Settings>;
        set({
          theme: saved.theme ?? 'dark',
          language: saved.language ?? 'pt',
          units: saved.units ?? 'metric',
        });
      }
    } catch (_) {}
  },
}));
