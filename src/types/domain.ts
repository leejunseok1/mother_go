export type DataSourceId =
  | "mydata"
  | "transaction"
  | "tax"
  | "market"
  | "history"
  | "retire";

export type SourceStatus = "connected" | "stale" | "error" | "simulated";

export interface DataSource {
  id: DataSourceId;
  icon: string;
  label: string;
  sub: string;
  color: string;
  glow: string;
  items: string[];
  example: string;
  status: SourceStatus;
  mode: "real" | "simulated";
}

export interface ThinkingStep {
  stepId: string;
  sourceId: DataSourceId;
  icon: string;
  text: string;
  order: number;
  confidence: number;
  startedAt: string;
}

export interface CrossExample {
  id: string;
  question: string;
  emoji: string;
  sources: DataSourceId[];
  thinking: {
    sourceId: DataSourceId;
    icon: string;
    text: string;
  }[];
  answer: string;
  riskNotice: string;
  nextActions: string[];
}

export interface AnalysisRequest {
  question: string;
  selectedSourceIds: DataSourceId[];
  locale: "ko-KR";
  sessionContext: {
    userAgeBand?: string;
    retirementHorizon?: string;
  };
  scenarioId?: string;
}

export interface AnalysisResult {
  answer: string;
  usedSources: DataSourceId[];
  steps: ThinkingStep[];
  riskNotice: string;
  nextActions: string[];
}

export interface AnalysisSession {
  sessionId: string;
  state: "streaming" | "done" | "error";
  createdAt: string;
  scenarioId?: string;
}

export interface HistoryItem {
  id: string;
  askedAt: string;
  question: string;
  answerPreview: string;
  confidence: number;
  recommendedAction: string;
  usedSources: DataSourceId[];
}

export type AnalysisStreamEvent =
  | {
      type: "source_activated";
      sourceId: DataSourceId;
      order: number;
    }
  | {
      type: "step";
      step: ThinkingStep;
    }
  | {
      type: "final_answer";
      result: AnalysisResult;
    }
  | {
      type: "error";
      message: string;
    };
