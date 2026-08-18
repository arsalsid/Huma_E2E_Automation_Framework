# Tic-Tac-Toe Test Plan

**App:** local `index.html` at `http://127.0.0.1:3000`  
**Goal:** Cover all critical user journeys in a 3-day take-home.  
**Tooling:** Playwright + TypeScript (one framework, one language).

## In scope (critical)

| Flow | What must be proven |
|---|---|
| Register | Valid sign-up; empty / short / duplicate name; logout back to Welcome |
| Login | Existing user; unknown user; empty / short name; Register ↔ Login switch |
| Gameplay | X then O; occupied cell ignored; New Game / Reset; hint; difficulty change (including mid-game confirm); game ends with win/loss/draw and winning cells marked |
| Profile | Stats for a new user; rename; duplicate rename rejected; delete account |
| History | Empty for a new user; row after a finished game; clear history |
| Settings | Theme toggle; English ↔ Persian (`lang` / `dir`); both survive reload |
| Session / nav | Login survives reload; Play / Profile / History views switch |

## Out of scope

Native mobile, API/backend (none exists), performance, security, and every possible board combination vs the computer AI.

## Approach

- Short plan → concrete cases (`docs/TEST-CASES.md`) → automate the critical rows.
- Page Object Model: locators/actions in `pages/`, scenarios in `tests/tic-tac-toe/`.
- Each test starts with empty `localStorage` so accounts do not leak between cases.
- Default run is Chromium (`npm run test:ttt`).

## Exit criteria

All P1 cases in `docs/TEST-CASES.md` pass in automation. P2 cases are automated where they are still critical-path (validation, persist, clear history).
