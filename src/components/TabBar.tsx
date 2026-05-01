import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTabStore } from '../store/tabStore';
import { useSettingsStore, THEMES } from '../store/settingsStore';
import { useI18n } from '../lib/i18n';
import SettingsModal from './SettingsModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { openTabs, closeTab } = useTabStore();
  const { theme } = useSettingsStore();
  const colors = THEMES[theme];
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const activeId = pathname === '/' ? 'home' : pathname.split('/character/')[1] ?? 'home';

  const handleHomeTab = () => router.replace('/');

  const handleCharTab = (id: string) => {
    router.replace(`/character/${id}` as any);
  };

  const handleClose = (id: string) => {
    const { openTabs: tabs, activeTab } = useTabStore.getState();
    const idx = tabs.findIndex((t) => t.id === id);
    closeTab(id);
    if (activeTab === id || id === activeId) {
      const remaining = tabs.filter((t) => t.id !== id);
      if (remaining.length > 0) {
        const next = remaining[Math.max(0, idx - 1)];
        router.replace(`/character/${next.id}` as any);
      } else {
        router.replace('/');
      }
    }
  };

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scroll}
        >
          {/* Home tab */}
          <TouchableOpacity
            style={[
              styles.tab,
              { borderBottomColor: 'transparent' },
              activeId === 'home' && { borderBottomColor: colors.accent },
            ]}
            onPress={handleHomeTab}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, { color: activeId === 'home' ? colors.accent : colors.subtext }]}>
              ⚔️ {t.yourChars}
            </Text>
          </TouchableOpacity>

          {/* Character tabs */}
          {openTabs.map((tab) => (
            <View
              key={tab.id}
              style={[
                styles.tab,
                { borderBottomColor: 'transparent' },
                activeId === tab.id && { borderBottomColor: colors.accent },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleCharTab(tab.id)}
                activeOpacity={0.7}
                style={styles.tabLabelHit}
              >
                <Text
                  style={[styles.tabText, { color: activeId === tab.id ? colors.accent : colors.subtext }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleClose(tab.id)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <Text style={[styles.closeBtn, { color: colors.subtext }]}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Gear button */}
        <TouchableOpacity
          style={[styles.gearBtn, { borderLeftColor: colors.border }]}
          onPress={() => setSettingsOpen(true)}
        >
          <Text style={styles.gearIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    zIndex: 100,
    elevation: 4,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 0,
    alignItems: 'flex-end',
    gap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 2.5,
    marginRight: 2,
    gap: 6,
    maxWidth: 140,
  },
  tabLabelHit: { flex: 1 },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    fontSize: 11,
    fontWeight: '700',
    paddingTop: 1,
  },
  gearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderLeftWidth: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearIcon: {
    fontSize: 20,
  },
});
