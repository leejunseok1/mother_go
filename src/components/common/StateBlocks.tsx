import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, typography } from "@/theme/tokens";

interface LoadingBlockProps {
  label?: string;
}

export function LoadingBlock({ label = "불러오는 중..." }: LoadingBlockProps) {
  return (
    <View style={styles.block}>
      <ActivityIndicator color={colors.success} />
      <Text style={styles.body}>{label}</Text>
    </View>
  );
}

interface EmptyBlockProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyBlock({ title, description, action }: EmptyBlockProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{description}</Text>
      {action}
    </View>
  );
}

interface ErrorBlockProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorBlock({ title = "문제가 발생했습니다", message, onRetry }: ErrorBlockProps) {
  return (
    <View style={[styles.block, styles.errorBlock]}>
      <Text style={styles.errorTitle}>{title}</Text>
      <Text style={styles.body}>{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            onRetry();
          }}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  errorBlock: {
    borderColor: "rgba(239,68,68,0.45)",
    backgroundColor: "rgba(239,68,68,0.12)",
    alignItems: "flex-start",
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: "700",
  },
  errorTitle: {
    color: "#FCA5A5",
    fontSize: typography.subtitle,
    fontWeight: "700",
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.sm,
    backgroundColor: "rgba(239,68,68,0.22)",
    borderWidth: 1,
    borderColor: "rgba(252,165,165,0.4)",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  retryText: {
    color: "#FECACA",
    fontWeight: "700",
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: typography.title,
    color: colors.textPrimary,
    fontWeight: "800",
  },
  sectionSubtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
