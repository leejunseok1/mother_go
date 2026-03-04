import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Screen } from "@/components/common/Screen";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { DataSourceGrid } from "@/components/source/DataSourceGrid";
import { QuestionTabs } from "@/components/analysis/QuestionTabs";
import { ThinkingTimeline } from "@/components/analysis/ThinkingTimeline";
import { PulseSourceHighlight } from "@/components/analysis/PulseSourceHighlight";
import { CROSS_EXAMPLES } from "@/data/mock";
import { useSourcesQuery } from "@/services/queries";
import { createAnalysisSession, streamAnalysisSession } from "@/services/bff";
import { useAnalysisStore } from "@/store/analysisStore";
import { AnalysisStreamEvent, ThinkingStep } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";

const STREAM_WATCHDOG_MS = 20000;

export default function AnalysisScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useSourcesQuery();
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);
  const bufferedStepsRef = useRef<Map<number, ThinkingStep>>(new Map());
  const nextOrderRef = useRef(0);
  const initialPlayedRef = useRef(false);
  const runIdRef = useRef(0);
  const hasFinalAnswerRef = useRef(false);
  const streamTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    activeSourceId,
    visibleStepIndex,
    isAnimating,
    answerStatus,
    lastResult,
    lastError,
    setSession,
    startStreaming,
    activateSource,
    revealStep,
    completeStreaming,
    failStreaming,
    resetPlayback,
  } = useAnalysisStore();

  const answerReveal = useSharedValue(answerStatus === "done" ? 1 : 0);
  useEffect(() => {
    answerReveal.value = withTiming(answerStatus === "done" ? 1 : 0, { duration: 360 });
  }, [answerReveal, answerStatus]);

  const answerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: answerReveal.value,
    transform: [{ translateY: (1 - answerReveal.value) * 10 }],
  }));

  const sources = data ?? [];
  const activeExample = CROSS_EXAMPLES[activeExampleIndex] ?? null;

  const clearStreamTimeout = useCallback(() => {
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }
  }, []);

  const startStreamTimeout = useCallback(
    (runId: number) => {
      clearStreamTimeout();
      streamTimeoutRef.current = setTimeout(() => {
        if (runId !== runIdRef.current || hasFinalAnswerRef.current) {
          return;
        }
        cleanupRef.current?.();
        cleanupRef.current = null;
        failStreaming("Analysis stream timed out. Please retry.");
      }, STREAM_WATCHDOG_MS);
    },
    [clearStreamTimeout, failStreaming],
  );

  const plannedSteps: ThinkingStep[] = useMemo(
    () =>
      activeExample
        ? activeExample.thinking.map((step, index) => ({
            stepId: `${activeExample.id}-${index}`,
            sourceId: step.sourceId,
            icon: step.icon,
            text: step.text,
            order: index,
            confidence: 0.75,
            startedAt: new Date().toISOString(),
          }))
        : [],
    [activeExample],
  );

  const flushBufferedSteps = useCallback(() => {
    while (bufferedStepsRef.current.has(nextOrderRef.current)) {
      const step = bufferedStepsRef.current.get(nextOrderRef.current);
      if (!step) {
        break;
      }
      revealStep(step.order, step.sourceId);
      bufferedStepsRef.current.delete(nextOrderRef.current);
      nextOrderRef.current += 1;
    }
  }, [revealStep]);

  const flushRemainingSteps = useCallback(() => {
    const remaining = [...bufferedStepsRef.current.values()].sort((left, right) => left.order - right.order);
    remaining.forEach((step) => {
      revealStep(step.order, step.sourceId);
      nextOrderRef.current = Math.max(nextOrderRef.current, step.order + 1);
    });
    bufferedStepsRef.current.clear();
  }, [revealStep]);

  const handleStreamEvent = useCallback(
    async (event: AnalysisStreamEvent, runId: number) => {
      if (runId !== runIdRef.current) {
        return;
      }

      if (event.type === "source_activated") {
        activateSource(event.sourceId);
        return;
      }

      if (event.type === "step") {
        bufferedStepsRef.current.set(event.step.order, event.step);
        flushBufferedSteps();
        return;
      }

      if (event.type === "final_answer") {
        clearStreamTimeout();
        flushBufferedSteps();
        flushRemainingSteps();
        hasFinalAnswerRef.current = true;
        completeStreaming(event.result);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        return;
      }

      if (event.type === "error") {
        clearStreamTimeout();
        failStreaming(event.message);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
      }
    },
    [
      activateSource,
      clearStreamTimeout,
      completeStreaming,
      failStreaming,
      flushBufferedSteps,
      flushRemainingSteps,
    ],
  );

  const startAnalysis = useCallback(
    async (index: number) => {
      if (!CROSS_EXAMPLES[index]) {
        return;
      }

      const runId = runIdRef.current + 1;
      runIdRef.current = runId;
      hasFinalAnswerRef.current = false;
      clearStreamTimeout();
      cleanupRef.current?.();
      cleanupRef.current = null;
      bufferedStepsRef.current.clear();
      nextOrderRef.current = 0;
      setActiveExampleIndex(index);
      startStreaming();

      const example = CROSS_EXAMPLES[index];
      if (!example) {
        return;
      }
      try {
        const session = await createAnalysisSession({
          question: example.question,
          selectedSourceIds: example.sources,
          locale: "ko-KR",
          sessionContext: {
            userAgeBand: "55-60",
            retirementHorizon: "2년",
          },
          scenarioId: example.id,
        });

        if (runId !== runIdRef.current) {
          return;
        }

        setSession(session);

        cleanupRef.current = streamAnalysisSession(session.sessionId, {
          onEvent: (event) => {
            void handleStreamEvent(event, runId);
          },
          onError: (message) => {
            if (runId !== runIdRef.current) {
              return;
            }
            clearStreamTimeout();
            failStreaming(message);
          },
          onDone: () => {
            if (runId !== runIdRef.current) {
              return;
            }
            clearStreamTimeout();
            if (!hasFinalAnswerRef.current) {
              failStreaming("Analysis stream ended before a final answer was received.");
            }
          },
        });
        startStreamTimeout(runId);
      } catch (streamError) {
        if (runId !== runIdRef.current) {
          return;
        }
        clearStreamTimeout();
        failStreaming(streamError instanceof Error ? streamError.message : "분석 시작 실패");
      }
    },
    [clearStreamTimeout, failStreaming, handleStreamEvent, setSession, startStreamTimeout, startStreaming],
  );

  useEffect(() => {
    if (!initialPlayedRef.current && !isLoading && !isError && CROSS_EXAMPLES.length > 0) {
      initialPlayedRef.current = true;
      startAnalysis(0);
    }
  }, [isError, isLoading, startAnalysis]);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      hasFinalAnswerRef.current = false;
      clearStreamTimeout();
      cleanupRef.current?.();
      resetPlayback();
    };
  }, [clearStreamTimeout, resetPlayback]);

  useEffect(() => {
    if (lastError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  }, [lastError]);

  return (
    <Screen>
      <SectionTitle
        title="교차분석 플레이어"
        subtitle="질문별로 사고 과정(step)을 순서대로 시각화하고 마지막에 맞춤 답변을 노출합니다."
      />

      {isLoading ? <LoadingBlock label="분석에 필요한 데이터를 준비하는 중..." /> : null}

      {isError ? (
        <ErrorBlock
          message={error instanceof Error ? error.message : "데이터 조회 실패"}
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError && CROSS_EXAMPLES.length === 0 ? (
        <EmptyBlock
          title="분석 시나리오가 없습니다"
          description="CROSS_EXAMPLES 데이터를 먼저 구성해주세요."
        />
      ) : null}

      {!isLoading && !isError && CROSS_EXAMPLES.length > 0 && sources.length > 0 && activeExample ? (
        <>
          <QuestionTabs
            examples={CROSS_EXAMPLES}
            activeIndex={activeExampleIndex}
            disabled={false}
            onSelect={(index) => {
              startAnalysis(index);
            }}
          />

          <View style={styles.questionBubbleWrap}>
            <View style={styles.questionBubble}>
              <Text style={styles.questionText}>{activeExample.question}</Text>
            </View>
          </View>

          <DataSourceGrid
            sources={sources}
            activeSourceId={activeSourceId}
            usedSourceIds={activeExample.sources}
            pulseSourceId={isAnimating ? activeSourceId : null}
            onPressSource={() => undefined}
          />

          <PulseSourceHighlight />

          <ThinkingTimeline steps={plannedSteps} visibleStepIndex={visibleStepIndex} sources={sources} />

          {answerStatus === "error" && lastError ? (
            <ErrorBlock
              title="스트림 중단"
              message={lastError}
              onRetry={() => {
                startAnalysis(activeExampleIndex);
              }}
            />
          ) : null}

          {answerStatus === "done" && lastResult ? (
            <Animated.View style={[styles.answerPreview, answerAnimatedStyle]}>
              <Text style={styles.answerPreviewTitle}>최종 답변 미리보기</Text>
              <Text style={styles.answerPreviewText} numberOfLines={4}>
                {lastResult.answer}
              </Text>
              <Pressable style={styles.detailButton} onPress={() => router.push("/answer")}>
                <Text style={styles.detailButtonText}>답변 상세 보기</Text>
              </Pressable>
            </Animated.View>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  questionBubbleWrap: {
    alignItems: "flex-end",
  },
  questionBubble: {
    maxWidth: "85%",
    borderRadius: 20,
    borderBottomRightRadius: 6,
    backgroundColor: "rgba(76,175,80,0.85)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  questionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  answerPreview: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  answerPreviewTitle: {
    color: colors.success,
    fontWeight: "800",
    fontSize: 13,
  },
  answerPreviewText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  detailButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.4)",
    backgroundColor: "rgba(74,222,128,0.12)",
  },
  detailButtonText: {
    color: colors.success,
    fontWeight: "800",
    fontSize: 12,
  },
});

