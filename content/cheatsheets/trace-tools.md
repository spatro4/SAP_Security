---
title: "Authorization Trace Tools: SU53 vs ST01 vs STAUTHTRACE vs SUIM"
summary: "Which tool to reach for, in what order, when a user reports 'no authorization.'"
---

| Tool | Scope | Best For | Limitation |
|---|---|---|---|
| **SU53** | Last failed authorization check for a user | Quick single-check triage right after the error occurs | Only shows the *last* check - misses earlier passes/failures in the same transaction |
| **ST01 (System Trace)** | All checks (auth, DB, RFC, etc.) during a trace window | Deep diagnosis when SU53 isn't enough or check order matters | Must be started before the error occurs; performance overhead if left running |
| **STAUTHTRACE** | Authorization checks only, more scalable than ST01 | Modern replacement for ST01 for auth-specific tracing, better filtering | Still a trace tool - don't leave running long-term in production |
| **SUIM** | Reporting across users/roles/profiles/authorizations system-wide | "Who has access to X" and role audit/cleanup reporting | Not a real-time trace - reflects current assignment state, not runtime checks |

**Recommended triage order**: SU53 first (fastest, zero setup) → if inconclusive or multiple objects suspected, STAUTHTRACE for the specific user and transaction → SUIM to confirm role assignment and cross-check for derived-role staleness.

**Interview one-liner**: "SU53 tells you what just failed; STAUTHTRACE/ST01 tells you everything that was checked during a window; SUIM tells you who has what, right now, system-wide."
