import { create } from 'zustand';

export type TabId = 'home' | string; // 'home' or character ID

interface OpenTab {
  id: string;       // character ID
  name: string;     // character name (for label)
}

interface TabStore {
  openTabs: OpenTab[];
  activeTab: TabId;
  openTab: (id: string, name: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: TabId) => void;
  updateTabName: (id: string, name: string) => void;
}

export const useTabStore = create<TabStore>((set, get) => ({
  openTabs: [],
  activeTab: 'home',

  openTab: (id, name) => {
    const exists = get().openTabs.find((t) => t.id === id);
    if (!exists) {
      set((s) => ({ openTabs: [...s.openTabs, { id, name }] }));
    }
    set({ activeTab: id });
  },

  closeTab: (id) => {
    const { openTabs, activeTab } = get();
    const idx = openTabs.findIndex((t) => t.id === id);
    const newTabs = openTabs.filter((t) => t.id !== id);
    let newActive: TabId = activeTab;
    if (activeTab === id) {
      // Go to the tab to the left, or home
      newActive = idx > 0 ? newTabs[idx - 1]?.id ?? 'home' : 'home';
    }
    set({ openTabs: newTabs, activeTab: newActive });
  },

  setActiveTab: (id) => set({ activeTab: id }),

  updateTabName: (id, name) =>
    set((s) => ({
      openTabs: s.openTabs.map((t) => (t.id === id ? { ...t, name } : t)),
    })),
}));
