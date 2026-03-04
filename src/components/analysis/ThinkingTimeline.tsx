import { memo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DataSource, ThinkingStep } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";
import { withAlpha } from "@/lib/color";

interface ThinkingTimelineProps {
  steps: ThinkingStep[];
  visibleStepIndex: number;
  sources: DataSource[];
}

export function ThinkingTimeline({ steps, visibleStepIndex, sources }: ThinkingTimelineProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reasoning Timeline</Text>
      <View style={styles.list}>
        {steps.map((step, index) => {
          const source = sources.find((s) => s.id === step.sourceId);
          const color = source?.color ?? "#64748B";
          return (
            <TimelineRow key={step.stepId} step={step} color={color} visible={visibleStepIndex >= index} />
          );
        })}
      </View>
    </View>
  );
}

const TimelineRow = memo(function TimelineRow({
  step,
  color,
  visible,
}: {
  step: ThinkingStep;
  color: string;
  visible: boolean;
}) {
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 320 });
  }, [progress, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.28 + progress.value * 0.72,
    transform: [{ translateX: -12 + progress.value * 12 }],
    borderColor: visible ? withAlpha(color, "55") : "rgba(255,255,255,0.08)",
    backgroundColor: visible ? withAlpha(color, "16") : "rgba(255,255,255,0.03)",
  }));

  const stickStyle = useAnimatedStyle(() => ({
    backgroundColor: visible ? color : "rgba(255,255,255,0.16)",
  }));

  return (
    <Animated.View style={[styles.row, animatedStyle]}>
      <Text style={styles.stepIcon}>{step.icon}</Text>
      <Animated.View style={[styles.colorStick, stickStyle]} />
      <Text style={styles.stepText}>{step.text}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  list: {
    gap: spacing.xs,
  },
  row: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  stepIcon: {
    fontSize: 17,
  },
  colorStick: {
    width: 3,
    height: 20,
    borderRadius: 2,
  },
  stepText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
});

