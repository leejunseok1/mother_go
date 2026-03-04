import {
  AnalysisRequest,
  AnalysisResult,
  AnalysisSession,
  AnalysisStreamEvent,
  CrossExample,
  DataSource,
  HistoryItem,
  ThinkingStep,
} from "@/types/domain";
import { CROSS_EXAMPLES, DATA_SOURCES, HISTORY_ITEMS } from "@/data/mock";

const BFF_BASE_URL = process.env.EXPO_PUBLIC_BFF_URL?.replace(/\/$/, "");
const mockSessionScenario = new Map<string, string>();

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchSources(): Promise<DataSource[]> {
  if (!BFF_BASE_URL) {
    await wait(280);
    return DATA_SOURCES;
  }

  const res = await fetch(`${BFF_BASE_URL}/v1/sources`);
  if (!res.ok) {
    throw new Error("데이터 소스 조회에 실패했습니다.");
  }
  const data = (await res.json()) as DataSource[];
  return data;
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  if (!BFF_BASE_URL) {
    await wait(360);
    return HISTORY_ITEMS;
  }

  const res = await fetch(`${BFF_BASE_URL}/v1/history`);
  if (!res.ok) {
    throw new Error("기록 조회에 실패했습니다.");
  }
  const data = (await res.json()) as HistoryItem[];
  return data;
}

export async function createAnalysisSession(request: AnalysisRequest): Promise<AnalysisSession> {
  if (!BFF_BASE_URL) {
    await wait(220);
    const session: AnalysisSession = {
      sessionId: `mock-${Date.now()}`,
      state: "streaming",
      createdAt: new Date().toISOString(),
      scenarioId: request.scenarioId,
    };
    mockSessionScenario.set(session.sessionId, request.scenarioId ?? CROSS_EXAMPLES[0].id);
    return session;
  }

  const res = await fetch(`${BFF_BASE_URL}/v1/analysis/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("분석 세션 생성에 실패했습니다.");
  }

  return (await res.json()) as AnalysisSession;
}

interface StreamCallbacks {
  onEvent: (event: AnalysisStreamEvent) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

function buildMockSteps(example: CrossExample): ThinkingStep[] {
  return example.thinking.map((item, index) => ({
    stepId: `${example.id}-${index}`,
    sourceId: item.sourceId,
    icon: item.icon,
    text: item.text,
    order: index,
    confidence: Number((0.74 + index * 0.05).toFixed(2)),
    startedAt: new Date(Date.now() + index * 700).toISOString(),
  }));
}

function buildMockResult(example: CrossExample): AnalysisResult {
  const steps = buildMockSteps(example);
  return {
    answer: example.answer,
    usedSources: example.sources,
    steps,
    riskNotice: example.riskNotice,
    nextActions: example.nextActions,
  };
}

function streamMockAnalysis(sessionId: string, callbacks: StreamCallbacks): () => void {
  const scenarioId = mockSessionScenario.get(sessionId) ?? CROSS_EXAMPLES[0].id;
  const example = CROSS_EXAMPLES.find((item) => item.id === scenarioId) ?? CROSS_EXAMPLES[0];
  const result = buildMockResult(example);
  const timers: ReturnType<typeof setTimeout>[] = [];

  result.steps.forEach((step, index) => {
    timers.push(
      setTimeout(() => {
        callbacks.onEvent({
          type: "source_activated",
          sourceId: step.sourceId,
          order: step.order,
        });
      }, 600 + index * 700),
    );

    timers.push(
      setTimeout(() => {
        callbacks.onEvent({
          type: "step",
          step,
        });
      }, 700 + index * 700),
    );
  });

  timers.push(
    setTimeout(() => {
      callbacks.onEvent({
        type: "final_answer",
        result,
      });
      callbacks.onDone();
    }, 900 + result.steps.length * 700),
  );

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
  };
}

function dispatchSsePayload(raw: string, callbacks: StreamCallbacks) {
  try {
    const payload = JSON.parse(raw) as AnalysisStreamEvent;
    callbacks.onEvent(payload);
  } catch (error) {
    callbacks.onError(
      error instanceof Error ? error.message : "스트림 이벤트 파싱에 실패했습니다.",
    );
  }
}

export function streamAnalysisSession(sessionId: string, callbacks: StreamCallbacks): () => void {
  if (!BFF_BASE_URL) {
    return streamMockAnalysis(sessionId, callbacks);
  }

  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${BFF_BASE_URL}/v1/analysis/sessions/${sessionId}/stream`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        callbacks.onError("스트림 연결에 실패했습니다.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          callbacks.onDone();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";

        blocks.forEach((block) => {
          const dataLine = block
            .split("\n")
            .find((line) => line.startsWith("data:"));

          if (!dataLine) {
            return;
          }

          dispatchSsePayload(dataLine.replace("data:", "").trim(), callbacks);
        });
      }
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }
      callbacks.onError(error instanceof Error ? error.message : "스트림 오류가 발생했습니다.");
    }
  })();

  return () => {
    controller.abort();
  };
}
