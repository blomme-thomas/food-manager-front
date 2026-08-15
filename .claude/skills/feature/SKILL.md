---
name: feature
description: Orchestrate a full frontend feature end-to-end (ticket → branch → plan → implementation → tests → review → security → PR) by dispatching to this repo's specialized agents in order.
---

# Feature Pipeline (Frontend)

Orchestrate a full frontend feature end-to-end by dispatching to this repo's
specialized agents, in order. This command is run by you (the current
session), not by a sub-agent — none of the agents below can call another
agent themselves, so you are the coordinator: read each agent's output,
synthesize it, and write the next agent's prompt yourself. Never forward
"based on the previous agent's findings" — restate the concrete content.

Scope: frontend only. If the feature needs a backend endpoint that doesn't
exist yet, this is a blocking dependency — stop and say so rather than
inventing the contract; the backend half must be built first via `/feature`
in `food-manager-back`, which ends by stating the API contract this
pipeline then consumes.

## Input

The user names a feature in plain language, or gives an existing ticket
code (`US-FOOD-*`, `TS-*`).

## Pipeline

1. **Confirm the ticket exists.**
   Search `food-manager-docs/user-stories/user-stories.md` and, if
   inconclusive, `gh issue list --repo blomme-thomas/food-manager-front`
   (or `-docs`, depending on where this type of ticket usually lives) for
   the feature.
   - Found: read it directly, go to step 2.
   - Not found: call **product-owner** to turn the ask into a precise
     requirement (including the API contract it depends on) and, once
     you've shown the user the exact issue content and gotten their
     go-ahead, log it as a GitHub issue (product-owner's "CREATING GITHUB
     ISSUES" process). Do not continue until the issue exists and you have
     its ticket code.

2. **Create the branch.**
   Call **git** to cut `feature/<TICKET-CODE>-<short-name>` (or `fix/`/
   `tech/` as fits the ticket type) from up-to-date `develop`. Nothing to
   review yet, so no PR at this point.

3. **Plan.**
   Call **architect** with the clarified requirement to get a concrete plan
   (which components/services/models are touched, state-management
   approach, API calls needed, and whether it follows the existing
   feature-based structure).
   **Checkpoint — stop and show the plan to the user, get explicit
   approval before implementing.** An unnoticed bad plan cascades through
   every step below.

4. **Implement.**
   Call **developer** with the approved plan. Break it into concrete,
   file-level asks matching the plan rather than handing over the whole
   plan as one vague instruction.

5. **Tests.**
   Call **test-writer** to cover what developer just built, and run it.
   If a failure is a production-code bug (test-writer never fixes those),
   take its concrete list of issues to **developer**, then re-run
   test-writer. Cap at 3 fix/recheck rounds — past that, stop and report
   the unresolved failures to the user instead of continuing to loop.

6. **Review.**
   Call **reviewer** on the current diff — it always runs lint, format
   check, and the relevant tests itself as part of the review, and
   returns findings pre-split into a FOR DEVELOPER list (production code)
   and a FOR TEST-WRITER list (spec files). Route each list to its owner:
   CRITICAL/IMPORTANT items from FOR DEVELOPER go to **developer**;
   CRITICAL/IMPORTANT items from FOR TEST-WRITER go to **test-writer**.
   Fix, then re-review; cap at 3 rounds. Report MINOR findings to the user
   without looping on them.

7. **Security audit.**
   Call **security** on the current diff. Same loop policy as review:
   CRITICAL/IMPORTANT → developer fixes → re-audit, cap at 3 rounds; MINOR
   reported only.

8. **Ship.**
   Get the user's explicit confirmation that the feature is ready (per
   git's own rules, it will not push or open a PR without this). State the
   plan — branch, commit(s), PR title/base (`develop`) — then call **git**
   to push and open the PR.

## Rules

- Do not skip the two checkpoints (step 3 plan approval, step 8 ship
  confirmation) — they're where a human looks before the pipeline spends
  more effort or takes a visible action.
- Never let reviewer or security touch production code directly, and
  never let test-writer touch production code. Reviewer/security findings
  on production code route through developer; findings on test files
  route through test-writer.
- Cap every fix/recheck loop at 3 rounds; escalate to the user past that
  rather than continuing automatically.
- If a requirement turns out ambiguous, or the feature depends on a backend
  contract that isn't defined/implemented yet, stop instead of guessing —
  go back to product-owner, or flag the backend dependency to the user.
