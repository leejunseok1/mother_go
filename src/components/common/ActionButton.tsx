import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, spacing } from "@/theme/tokens";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  accessibilityHint?: string;
}

export function ActionButton({
  label,
  onPress,
  style,
  disabled = false,
  accessibilityHint,
}: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      hitSlop={4}
      onPress={async () => {
        await Haptics.selectionAsync();
        onPress();
      }}
      style={style}
    >
      <LinearGradient
        colors={disabled ? [colors.textMuted, colors.textMuted] : ["#1E7D4A", "#2EB569"]}
        style={styles.button}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
