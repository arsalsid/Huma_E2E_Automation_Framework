# Tic-Tac-Toe Test Cases

Source: [TEST-PLAN.md](./TEST-PLAN.md).  
Case IDs match Playwright titles (`TC-TTT-00n`).

| ID | Module | Title | P | Automated spec |
|---|---|---|---|---|
| TC-TTT-001 | Register | Register with valid name and land on Play | P1 | `TC-001-register.spec.ts` |
| TC-TTT-002 | Register | Empty, too short, duplicate name | P1 | `TC-001-register.spec.ts` |
| TC-TTT-003 | Register | Logout returns to Welcome | P1 | `TC-001-register.spec.ts` |
| TC-TTT-004 | Login | Login with existing account | P1 | `TC-002-login.spec.ts` |
| TC-TTT-005 | Login | Unknown name is rejected | P1 | `TC-002-login.spec.ts` |
| TC-TTT-006 | Login | Switch Register ↔ Login | P2 | `TC-002-login.spec.ts` |
| TC-TTT-007 | Gameplay | Human X, computer O | P1 | `TC-003-gameplay.spec.ts` |
| TC-TTT-008 | Gameplay | New Game and Reset clear the board | P1 | `TC-003-gameplay.spec.ts` |
| TC-TTT-009 | Gameplay | Hint marks one empty cell | P2 | `TC-003-gameplay.spec.ts` |
| TC-TTT-010 | Gameplay | Difficulty change still allows a real move | P1 | `TC-003-gameplay.spec.ts` |
| TC-TTT-011 | Gameplay | Finished game: status + winning cells / draw | P1 | `TC-003-gameplay.spec.ts` |
| TC-TTT-012 | Profile | Stats and rename | P1 | `TC-004-profile.spec.ts` |
| TC-TTT-013 | Profile | Delete account blocks login | P1 | `TC-004-profile.spec.ts` |
| TC-TTT-014 | History | Empty for a new user | P1 | `TC-005-history.spec.ts` |
| TC-TTT-015 | History | Finished game appears in History | P1 | `TC-005-history.spec.ts` |
| TC-TTT-016 | Settings | Theme and language update the UI | P1 | `TC-006-settings.spec.ts` |
| TC-TTT-017 | Login | Empty and too short name | P2 | `TC-002-login.spec.ts` |
| TC-TTT-018 | Gameplay | Occupied cell cannot be overwritten | P1 | `TC-003-gameplay.spec.ts` |
| TC-TTT-019 | Gameplay | Mid-game difficulty confirm / cancel | P2 | `TC-003-gameplay.spec.ts` |
| TC-TTT-020 | Profile | Rename to an existing name is rejected | P2 | `TC-004-profile.spec.ts` |
| TC-TTT-021 | History | Clear history removes records | P2 | `TC-005-history.spec.ts` |
| TC-TTT-022 | Settings | Language and theme persist after reload | P2 | `TC-006-settings.spec.ts` |
| TC-TTT-023 | Session | Session persists after reload | P1 | `TC-007-session-nav.spec.ts` |
| TC-TTT-024 | Navigation | Play / Profile / History | P1 | `TC-007-session-nav.spec.ts` |

## Expected results (critical)

- **001** Play view, status `your-turn`, hello shows the name.
- **002 / 017** Errors: `Please enter a name.` / `Name must be at least 2 characters.` / name already taken.
- **004** Login lands on Play as that user.
- **007** Clicked cell is `X`; an `O` appears or the game ends.
- **018** Occupied cell is disabled; `data-state` stays `X` or `O`.
- **011** Status is `human`, `computer`, or `draw`. Win/loss highlights exactly 3 `.cell.is-win`. Draw highlights none. Profile stat for that result is `1`.
- **016** Theme flips `html[data-theme]`. Persian sets `lang=fa` and `dir=rtl`; English Play label is gone until switched back.
- **023** After reload, same user is still logged in on Play.
