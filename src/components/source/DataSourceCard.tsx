import { memo, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { DataSource } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";
import { withAlpha } from "@/lib/color";

interface DataSourceCardProps {
  source: DataSource;
  isActive: boolean;
  isUsed: boolean;
  pulseEnabled: boolean;
  onPress: () => void;
}

function DataSourceCardBase({
  source,
  isActive,
  isUsed,
  pulseEnabled,
  onPress,
}: DataSourceCardProps) {
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const pressProgress = useSharedValue(0);
  const pulseProgress = useSharedValue(0);

  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 260 });
  }, [activeProgress, isActive]);

  useEffect(() => {
    if (pulseEnabled) {
      pulseProgress.value = withRepeat(
        withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })),
        -1,
        false,
      );
      return;
    }
    cancelAnimation(pulseProgress);
    pulseProgress.value = 0;
  }, [pulseEnabled, pulseProgress]);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const baseBorder = isUsed ? withAlpha(source.color, "66") : "#2B3445";
    return {
      transform: [{ scale: 1 + activeProgress.value * 0.03 - pressProgress.value * 0.015 }],
      borderColor: interpolateColor(activeProgress.value, [0, 1], [baseBorder, source.color]),
      backgroundColor: interpolateColor(activeProgress.value, [0, 1], ["rgba(255,255,255,0.03)", withAlpha(source.color, "22")]),
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(activeProgress.value * 0.85, { duration: 260 }),
    transform: [{ scale: 0.92 + activeProgress.value * 0.1 }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 1 - pulseProgress.value * 0.55,
    transform: [{ scale: 1 + pulseProgress.value * 0.75 }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        pressProgress.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        pressProgress.value = withTiming(0, { duration: 180 });
      }}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={styles.pressable}
    >
      <Animated.View style={[styles.glowLayer, { backgroundColor: source.glow }, glowAnimatedStyle]} />
      <Animated.View style={[styles.card, cardAnimatedStyle]}>
        {pulseEnabled ? (
          <Animated.View style={[styles.pulseDot, pulseStyle, { backgroundColor: source.color }]} />
        ) : null}
        <View style={styles.headerRow}>
          <Text style={styles.icon}>{source.icon}</Text>
          <View style={styles.headerText}>
            <Text style={[styles.label, isActive ? styles.activeLabel : undefined]}>{source.label}</Text>
            <Text style={[styles.subLabel, { color: source.color }]}>{source.sub}</Text>
          </View>
        </View>

        {isActive ? (
          <View style={styles.details}>
            {source.items.map((item) => (
              <View style={styles.itemRow} key={`${source.id}-${item}`}>
                <View style={[styles.dot, { backgroundColor: source.color }]} />
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
            <View style={[styles.exampleBox, { borderColor: withAlpha(source.color, "44"), backgroundColor: withAlpha(source.color, "1A") }]}>
              <Text style={[styles.exampleText, { color: source.color }]}>예) {source.example}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.modeText}>{source.mode === "real" ? "실제 연동" : "시뮬레이션"}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const DataSourceCard = memo(DataSourceCardBase);

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minWidth: "48%",
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
    margin: 2,
  },
  card: {
    minHeight: 130,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    overflow: "hidden",
  },
  pulseDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 99,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  label: {
    color: "#CBD5E1",
    fontWeight: "700",
    fontSize: 14,
  },
  activeLabel: {
    color: "white",
  },
  subLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  modeText: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 12,
  },
  details: {
    marginTop: spacing.sm,
    gap: 5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    flexShrink: 0,
  },
  itemText: {
    color: colors.textSecondary,
    fontSize: 11.5,
    flexShrink: 1,
  },
  exampleBox: {
    marginTop: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  exampleText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
