import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettingsStore, THEMES } from '../store/settingsStore';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  confirmDestructive,
  onConfirm,
  onCancel,
}: Props) {
  const { theme } = useSettingsStore();
  const c = THEMES[theme];

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel}>
        <TouchableOpacity activeOpacity={1} style={[styles.box, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.title, { color: c.accent }]}>{title}</Text>
          <Text style={[styles.message, { color: c.subtext }]}>{message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: c.border }]} onPress={onCancel}>
              <Text style={[styles.cancelText, { color: c.subtext }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: c.accent }, confirmDestructive && styles.confirmDestructive]}
              onPress={onConfirm}
            >
              <Text style={[styles.confirmText, { color: c.bg }, confirmDestructive && styles.confirmTextDestructive]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  box: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelText: { fontWeight: '600' },
  confirmBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmDestructive: { backgroundColor: '#3a0000', borderWidth: 1, borderColor: '#ff4040' },
  confirmText: { fontWeight: '700' },
  confirmTextDestructive: { color: '#ff4040' },
});
