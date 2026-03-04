import { create } from "zustand";
import { AnalysisResult, AnalysisSession, DataSourceId } from "@/types/domain";

type AnswerStatus = "idle" | "loading" | "error" | "done";

interface AnalysisStoreState {
  session: AnalysisSession | null;
  answerStatus: AnswerStatus;
  lastResult: AnalysisResult | null;
  lastError: string | null;
  activeSourceId: DataSourceId | null;
  visibleStepIndex: number;
  isAnimating: boolean;
  setSession: (session: AnalysisSession | null) => void;
  startStreaming: () => void;
  activateSource: (sourceId: DataSourceId) => void;
  revealStep: (stepIndex: number, sourceId: DataSourceId) => void;
  completeStreaming: (result: AnalysisResult) => void;
  failStreaming: (message: string) => void;
  resetPlayback: () => void;
}

export const useAnalysisStore = create<AnalysisStoreState>((set) => ({
  session: null,
  answerStatus: "idle",
  lastResult: null,
  lastError: null,
  activeSourceId: null,
  visibleStepIndex: -1,
  isAnimating: false,
  setSession: (session) => set({ session }),
  startStreaming: () =>
    set({
      answerStatus: "loading",
      lastError: null,
      visibleStepIndex: -1,
      activeSourceId: null,
      isAnimating: true,
      lastResult: null,
    }),
  activateSource: (sourceId) =>
    set({
      activeSourceId: sourceId,
      isAnimating: true,
    }),
  revealStep: (stepIndex, sourceId) =>
    set({
      visibleStepIndex: stepIndex,
      activeSourceId: sourceId,
      isAnimating: true,
    }),
  completeStreaming: (result) =>
    set({
      lastResult: result,
      answerStatus: "done",
      activeSourceId: null,
      isAnimating: false,
      lastError: null,
    }),
  failStreaming: (message) =>
    set({
      answerStatus: "error",
      lastError: message,
      isAnimating: false,
      activeSourceId: null,
    }),
  resetPlayback: () =>
    set({
      visibleStepIndex: -1,
      activeSourceId: null,
      isAnimating: false,
      answerStatus: "idle",
      lastError: null,
      lastResult: null,
    }),
}));
