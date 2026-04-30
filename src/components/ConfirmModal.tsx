import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel}>
        <TouchableOpacity activeOpacity={1} style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, confirmDestructive && styles.confirmDestructive]}
              onPress={onConfirm}
            >
              <Text style={[styles.confirmText, confirmDestructive && styles.confirmTextDestructive]}>
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
    backgroundColor: '#2d1a00',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#c9a84c55',
  },
  title: {
    color: '#c9a84c',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    color: '#9a8070',
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
    borderColor: '#5a4020',
  },
  cancelText: { color: '#8a7060', fontWeight: '600' },
  confirmBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#c9a84c',
  },
  confirmDestructive: { backgroundColor: '#3a0000', borderWidth: 1, borderColor: '#ff4040' },
  confirmText: { color: '#1a0a00', fontWeight: '700' },
  confirmTextDestructive: { color: '#ff4040' },
});
