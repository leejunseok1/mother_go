# Round 3 Smoke Checklist

Run after all round 3 merges on `main`.

## Commands

```powershell
npm run typecheck
```

## Manual checks

1. Open Sources tab and verify source-status filters change visible cards correctly.
2. Open a source card and verify accessibility label reads status + expanded/collapsed state.
3. Open Analysis tab and switch questions quickly while stream is running.
4. Verify no stale timeout/error appears after a successful final answer.
5. Complete one analysis and open Answer tab; check follow-up CTA buttons.
6. Open History tab; verify sorting controls reorder items correctly.
7. Apply a filter that returns no rows; verify reset action restores list.

## Release gate

- Typecheck passes.
- No overlap conflicts unresolved.
- `android/gradle.properties` local-only edits remain untouched unless intentionally included.

