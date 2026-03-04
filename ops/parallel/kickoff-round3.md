# Round 3 Kickoff (Copy/Paste)

## Orchestrator Session

```text
Run round 3 with 3 parallel agents.
Before starting, paste each round3 prompt into its matching agent session.
Check file overlap regularly:
powershell -ExecutionPolicy Bypass -File .\ops\parallel\check-overlap.ps1 -BaseBranch main

Collect from each agent:
1) changed files
2) behavior changes
3) typecheck result

Merge in this order:
1. parallel/agent-b-analysis
2. parallel/agent-a-ui
3. parallel/agent-c-answer-history
```

## Agent A (UI)

```text
Follow: ops/parallel/prompts/agent-a-ui-round3.md
Rules:
- Touch only allowed files.
- Do not edit analysis/answer/history tabs.
- Run npm run typecheck and report.
```

## Agent B (Analysis)

```text
Follow: ops/parallel/prompts/agent-b-analysis-round3.md
Rules:
- Touch only allowed files.
- Do not edit onboarding/sources/answer/history tabs.
- Run npm run typecheck and report.
```

## Agent C (Answer/History)

```text
Follow: ops/parallel/prompts/agent-c-answer-history-round3.md
Rules:
- Touch only allowed files.
- Do not edit analysis/onboarding/sources tabs.
- Run npm run typecheck and report.
```

