# Approach (optional)

Playwright + TypeScript was one of the allowed pairs. It fits a 3-day UI assignment: auto-wait, traces, and one runner for the local `index.html` app.

Page objects keep locators out of the specs. `test-base.ts` is a Playwright fixture, not global setup. Each test starts with empty storage because auth lives in `localStorage`.

Gameplay asserts outcomes the user can see (marks, status, winning cells), not a fixed nine-move script against a non-deterministic Easy AI.

How to run the suite is in the README. The required plan and cases are `docs/TEST-PLAN.md` and `docs/TEST-CASES.md`.
