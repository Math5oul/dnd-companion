import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import TabBar from '../src/components/TabBar';
import { useSettingsStore, THEMES } from '../src/store/settingsStore';

export default function RootLayout() {
  const { loadSettings, theme } = useSettingsStore();
  const colors = THEMES[theme];

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" />
        <View style={[styles.root, { backgroundColor: colors.bg }]}>
          <TabBar />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'fade',
            }}
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
