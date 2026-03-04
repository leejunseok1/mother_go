import { CrossExample, DataSource, HistoryItem } from "@/types/domain";

export const DATA_SOURCES: DataSource[] = [
  {
    id: "mydata",
    icon: "🏦",
    label: "마이데이터",
    sub: "실시간 연동",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.3)",
    items: ["은행 잔액", "주식 종목/수량/매입가", "보험 계약", "연금 적립금", "부동산 시세"],
    example: "삼성전자 50주, 매입가 58,000원",
    status: "simulated",
    mode: "simulated",
  },
  {
    id: "transaction",
    icon: "💳",
    label: "거래 내역",
    sub: "카드/계좌",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.3)",
    items: ["월별 지출 내역", "카테고리별 분류", "고정비 vs 변동비", "수입/이체 내역"],
    example: "이번달 병원비 35만, 식비 62만",
    status: "connected",
    mode: "real",
  },
  {
    id: "tax",
    icon: "📊",
    label: "세금/건보료",
    sub: "계산 엔진",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.3)",
    items: ["금융소득 누적액", "종합과세 기준선", "건보료 등급 변동", "양도세 시뮬레이션"],
    example: "금융소득 1,650만 / 2,000만 기준",
    status: "simulated",
    mode: "simulated",
  },
  {
    id: "market",
    icon: "📈",
    label: "시장 데이터",
    sub: "실시간",
    color: "#10B981",
    glow: "rgba(16,185,129,0.3)",
    items: ["현재 주가/지수", "배당금 일정", "과거 회복 통계", "업종 동향"],
    example: "삼성전자 현재 62,400원 (+7.6%)",
    status: "connected",
    mode: "real",
  },
  {
    id: "history",
    icon: "📋",
    label: "판단 기록",
    sub: "학습 데이터",
    color: "#EF4444",
    glow: "rgba(239,68,68,0.3)",
    items: ["과거 조언 이력", "적중/빗나감 결과", "사용자 선택 패턴", "신뢰도 점수"],
    example: "보유 추천 9회 중 7회 적중 (78%)",
    status: "simulated",
    mode: "simulated",
  },
  {
    id: "retire",
    icon: "🏛️",
    label: "은퇴 설계",
    sub: "모델링",
    color: "#EC4899",
    glow: "rgba(236,72,153,0.3)",
    items: ["연금 수령 예정액", "퇴직금 운용 상태", "은퇴 후 예상 지출", "시나리오별 시뮬레이션"],
    example: "보수적 운용 시 월 212만원 수입",
    status: "simulated",
    mode: "simulated",
  },
];

export const CROSS_EXAMPLES: CrossExample[] = [
  {
    id: "sell-samsung",
    question: "삼성전자 팔아야 해?",
    emoji: "🤔",
    sources: ["mydata", "tax", "market", "history"],
    thinking: [
      {
        sourceId: "mydata",
        icon: "🏦",
        text: "매입가 58,000원 → 현재 62,400원 (+7.6%)",
      },
      {
        sourceId: "tax",
        icon: "📊",
        text: "팔면 금융소득 1,870만 → 건보료 인상 위험",
      },
      {
        sourceId: "market",
        icon: "📈",
        text: "반도체 업황 회복세, AI 수요 지속",
      },
      {
        sourceId: "history",
        icon: "📋",
        text: "비슷한 상황에서 보유 추천 → 78% 적중",
      },
    ],
    answer:
      "지금은 안 파시는 게 좋겠어요.\n+7.6%로 잘 가고 있고, 팔면 건보료가 올라가요.\n파실 거면 내년 1월에 파세요.",
    riskNotice:
      "본 답변은 투자 권유가 아닌 정보 제공이며, 최종 의사결정 책임은 사용자에게 있습니다.",
    nextActions: ["내년 1월 재평가 알림 설정", "목표 수익률 도달 시 자동 리밸런싱 조건 검토"],
  },
  {
    id: "monthly-spend",
    question: "이번 달 많이 썼어?",
    emoji: "💸",
    sources: ["transaction", "retire"],
    thinking: [
      {
        sourceId: "transaction",
        icon: "💳",
        text: "이번달 총 248만원 지출, 병원비 초과",
      },
      {
        sourceId: "retire",
        icon: "🏛️",
        text: "은퇴 후 예상 수입 212만 → 36만 부족",
      },
    ],
    answer:
      "248만원 썼어요. 예산 안이지만,\n병원비가 예산보다 5만원 많았어요.\n참고로 은퇴 후에는 36만원 부족해요.",
    riskNotice:
      "의료비는 변동성이 높습니다. 다음 달 예산에는 완충 예산을 최소 10% 반영하세요.",
    nextActions: ["의료비 카테고리 상한 40만원으로 재설정", "고정비 자동이체일 분산 검토"],
  },
  {
    id: "retirement-fund",
    question: "퇴직금 어떻게 하지?",
    emoji: "🧓",
    sources: ["mydata", "market", "retire", "tax"],
    thinking: [
      {
        sourceId: "mydata",
        icon: "🏦",
        text: "IRP에 8,400만원 예금형 방치 중",
      },
      {
        sourceId: "market",
        icon: "📈",
        text: "TDF 2028 펀드 연 5.2% 수익률",
      },
      {
        sourceId: "retire",
        icon: "🏛️",
        text: "전환 시 월 수입 37만원 증가 가능",
      },
      {
        sourceId: "tax",
        icon: "📊",
        text: "IRP 세액공제 연 115만원 추가 혜택",
      },
    ],
    answer:
      "지금 금리(1.8%)로는 매달 35만원 손해예요.\nTDF 2028로 바꾸면 월 수입이 37만원 늘어나요.\n원하시면 전문가 상담 연결해드릴게요.",
    riskNotice:
      "TDF는 원금 손실 가능성이 있습니다. 투자 성향 및 은퇴 시점을 함께 고려해야 합니다.",
    nextActions: ["IRP 상품 리밸런싱 시나리오 비교", "전문가 상담 20분 예약"],
  },
];

export const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: "h-2026-03-01",
    askedAt: "2026-03-01T09:30:00+09:00",
    question: "삼성전자 팔아야 해?",
    answerPreview: "지금은 보유가 유리하며, 매도는 내년 1월 재평가 권장",
    confidence: 0.78,
    recommendedAction: "보유",
    usedSources: ["mydata", "tax", "market", "history"],
  },
  {
    id: "h-2026-02-24",
    askedAt: "2026-02-24T20:10:00+09:00",
    question: "이번 달 많이 썼어?",
    answerPreview: "총 248만원 지출, 의료비 초과 5만원",
    confidence: 0.81,
    recommendedAction: "예산 조정",
    usedSources: ["transaction", "retire"],
  },
];
