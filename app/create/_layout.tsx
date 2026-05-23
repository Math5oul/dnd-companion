import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';

/**
 * Guard: if the user hard-refreshes on any /create/* page on web,
 * the Zustand store is wiped and the draft is empty.
 * Redirect them to home so they can start fresh.
 */
export default function CreateLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { draft } = useCharacterStore();

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Allow step1 only if reached naturally; on refresh draft.name is always ''
    // For steps 2-5, require the previous step's data to exist
    const stepRequirements: Record<string, boolean> = {
      '/create/step2-race':    draft.name.trim().length >= 2,
      '/create/step3-class':   draft.race !== '',
      '/create/step4-abilities': draft.className !== '',
      '/create/step5-review':  draft.className !== '',
    };

    const requirement = stepRequirements[pathname];
    if (requirement === false) {
      router.replace('/');
    }
  }, [pathname]);

  return <Slot />;
}
