import { Platform } from 'react-native';
import { Slot, Redirect, usePathname } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';

/**
 * Guard: if the user hard-refreshes on any /create/* page on web,
 * the Zustand store is wiped and the draft is empty.
 * Redirect them to home so they can start fresh.
 */
export default function CreateLayout() {
  const pathname = usePathname();
  const { draft } = useCharacterStore();

  if (Platform.OS === 'web') {
    const stepRequirements: Record<string, boolean> = {
      '/create/step2-race':      draft.name.trim().length >= 2,
      '/create/step3-class':     draft.race !== '',
      '/create/step4-abilities': draft.className !== '',
      '/create/step5-review':    draft.className !== '',
    };

    const requirement = stepRequirements[pathname];
    if (requirement === false) {
      return <Redirect href="/" />;
    }
  }

  return <Slot />;
}
