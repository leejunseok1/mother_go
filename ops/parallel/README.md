# Parallel Codex Runbook

This folder sets up a practical "main orchestrator + 3 sub-agents" workflow for this repo.

## 1) Create worktrees

Run from repo root:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\parallel\setup-worktrees.ps1 -BaseBranch main -ProjectTag deundeun
```

If your default branch is not `main`, set it explicitly:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\parallel\setup-worktrees.ps1 -BaseBranch master -ProjectTag deundeun
```

This creates 3 sibling folders:

- `..\deundeun-agent-ui`
- `..\deundeun-agent-analysis`
- `..\deundeun-agent-answer-history`

## 2) Open 4 sessions

- Orchestrator session: original repo root
- Agent A session: `..\deundeun-agent-ui`
- Agent B session: `..\deundeun-agent-analysis`
- Agent C session: `..\deundeun-agent-answer-history`

## 3) Paste prompt per agent

Prompt files:

- `ops/parallel/prompts/orchestrator.md`
- `ops/parallel/prompts/agent-a-ui.md`
- `ops/parallel/prompts/agent-b-analysis.md`
- `ops/parallel/prompts/agent-c-answer-history.md`

In each session, paste the matching prompt and let it implement changes in its own scope only.

## 4) Monitor overlap early

Use:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\parallel\check-overlap.ps1 -BaseBranch main
```

If any overlap appears, resolve by assigning file ownership and asking one agent to rebase.

## 5) Merge order

Recommended order for this repo:

1. `parallel/agent-b-analysis`
2. `parallel/agent-a-ui`
3. `parallel/agent-c-answer-history`

Then run:

```powershell
npm run typecheck
```

Optional final sanity run:

```powershell
npm run start
```
