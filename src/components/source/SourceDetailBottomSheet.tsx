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

  const statusMeta = source
    ? {
        connected: { label: "CONNECTED", bg: "rgba(74,222,128,0.14)", border: "rgba(74,222,128,0.42)", text: "#86EFAC" },
        stale: { label: "STALE", bg: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.42)", text: "#FCD34D" },
        error: { label: "ERROR", bg: "rgba(239,68,68,0.14)", border: "rgba(239,68,68,0.42)", text: "#FCA5A5" },
        simulated: {
          label: "SIMULATED",
          bg: "rgba(148,163,184,0.15)",
          border: "rgba(148,163,184,0.42)",
          text: "#CBD5E1",
        },
      }[source.status]
    : null;

  const modeMeta = source
    ? source.mode === "real"
      ? { label: "LIVE LINK", bg: "rgba(59,130,246,0.14)", border: "rgba(59,130,246,0.42)", text: "#93C5FD" }
      : { label: "SIMULATION", bg: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.42)", text: "#CBD5E1" }
    : null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.sheet, containerStyle]}>
          {source ? (
            <>
              <View style={styles.dragHandle} />

              <View style={styles.titleRow}>
                <Text style={styles.icon}>{source.icon}</Text>
                <View style={styles.titleColumn}>
                  <Text style={styles.title}>{source.label}</Text>
                  <Text style={[styles.subtitle, { color: source.color }]}>{source.sub}</Text>
                </View>
              </View>

              {modeMeta && statusMeta ? (
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: modeMeta.bg, borderColor: modeMeta.border }]}>
                    <Text style={[styles.badgeText, { color: modeMeta.text }]}>{modeMeta.label}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: statusMeta.bg, borderColor: statusMeta.border }]}>
                    <Text style={[styles.badgeText, { color: statusMeta.text }]}>{statusMeta.label}</Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Available fields</Text>
                <View style={styles.list}>
                  {source.items.map((item) => (
                    <View style={styles.itemRow} key={`${source.id}-${item}`}>
                      <View style={[styles.dot, { backgroundColor: source.color }]} />
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View
                style={[
                  styles.example,
                  { backgroundColor: withAlpha(source.color, "18"), borderColor: withAlpha(source.color, "44") },
                ]}
              >
                <Text style={styles.exampleLabel}>Sample record</Text>
                <Text style={[styles.exampleText, { color: source.color }]}>{source.example}</Text>
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
    minHeight: 320,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 99,
    backgroundColor: "rgba(148,163,184,0.5)",
    alignSelf: "center",
    marginTop: -2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
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
    gap: 6,
  },
  exampleLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  exampleText: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
});

