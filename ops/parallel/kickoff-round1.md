# Round 1 Kickoff (Copy/Paste)

## Orchestrator Session

```text
이번 라운드는 병렬 3개 에이전트를 운영한다.
우선 각 에이전트에 자기 prompt 파일 내용을 붙여넣고 시작시켜라.
진행 중간마다 아래를 실행해 파일 충돌을 확인한다:
powershell -ExecutionPolicy Bypass -File .\ops\parallel\check-overlap.ps1 -BaseBranch main
라운드 종료 시 각 에이전트에게 changed files, 핵심 변경점, typecheck 결과를 받아 통합 계획을 제시하라.
```

## Agent A (UI)

```text
ops/parallel/prompts/agent-a-ui.md 규칙을 준수해서 작업 시작.
이번 라운드 목표:
1) onboarding/sources 화면의 텍스트 정보 위계와 가독성 개선
2) source 카드 active/used/pulse 상태 시각 차이를 더 명확하게 개선
3) 기존 토큰(colors/spacing/radius) 체계를 유지
작업 후 반드시 typecheck를 실행하고 결과를 보고하라.
```

## Agent B (Analysis)

```text
ops/parallel/prompts/agent-b-analysis.md 규칙을 준수해서 작업 시작.
이번 라운드 목표:
1) analysis stream의 이전 세션 이벤트 누수 방지
2) step 이벤트 순서 보장 로직 강화
3) 중단/재시작/unmount 시 cleanup 보장
4) 사용자 재시도 가능한 오류 처리 정리
작업 후 반드시 typecheck를 실행하고 결과를 보고하라.
```

## Agent C (Answer/History)

```text
ops/parallel/prompts/agent-c-answer-history.md 규칙을 준수해서 작업 시작.
이번 라운드 목표:
1) answer/history 화면의 empty/loading/error 상태 메시지와 행동 버튼 명확화
2) 최종 답변 카드와 근거 영역의 가독성 개선
3) 현재 useAnalysisStore 결과 shape 호환성 유지
작업 후 반드시 typecheck를 실행하고 결과를 보고하라.
```
