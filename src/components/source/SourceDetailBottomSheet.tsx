import { useEffect } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DataSource } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";
import { withAlpha } from "@/lib/color";

interface SourceDetailBottomSheetProps {
  source: DataSource | null;
  visible: boolean;
  onClose: () => void;
}

export function SourceDetailBottomSheet({ source, visible, onClose }: SourceDetailBottomSheetProps) {
  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : 300, { duration: 220 });
    opacity.value = withTiming(visible ? 1 : 0, { duration: 220 });
  }, [opacity, translateY, visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.sheet, containerStyle]}>
          {source ? (
            <>
              <View style={styles.titleRow}>
                <Text style={styles.icon}>{source.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{source.label}</Text>
                  <Text style={[styles.subtitle, { color: source.color }]}>{source.sub}</Text>
                </View>
              </View>

              <View style={styles.list}>
                {source.items.map((item) => (
                  <View style={styles.itemRow} key={`${source.id}-${item}`}>
                    <View style={[styles.dot, { backgroundColor: source.color }]} />
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View
                style={[
                  styles.example,
                  { backgroundColor: withAlpha(source.color, "18"), borderColor: withAlpha(source.color, "44") },
                ]}
              >
                <Text style={[styles.exampleText, { color: source.color }]}>예) {source.example}</Text>
              </View>
            </>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    minHeight: 260,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: {
    fontSize: 26,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  list: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  itemText: {
    color: colors.textSecondary,
    fontSize: 13,
    flexShrink: 1,
  },
  example: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  exampleText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
