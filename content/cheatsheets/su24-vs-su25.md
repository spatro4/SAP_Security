---
title: "SU24 vs SU25: What Each One Actually Does"
summary: "The one-page reference for the difference every consultant is asked to explain and half get wrong."
---

| | SU24 | SU25 |
|---|---|---|
| **Purpose** | Maintain authorization default values / check indicators per transaction | Migrate/reconcile SU24 data after an upgrade or initial activation |
| **When you touch it** | Every time a custom transaction ships, or a proposal needs tuning | Once per upgrade / support pack that changes SAP's shipped defaults |
| **Tables involved** | `USOBX_C`, `USOBT_C` (customer), `USOBX`, `USOBT` (SAP-shipped) | Same tables, but via a guided comparison/merge process |
| **Does it enforce security?** | No - it only controls what PFCG *proposes* | No - it only controls what gets merged into the proposal tables |
| **Common mistake** | Setting an object to "No Check" to silence one user's error | Skipping it after upgrade, causing new objects to go unassigned |
| **Who runs it** | Security consultant / developer, per transport | Basis + Security jointly, per upgrade project |

**Check indicator values in SU24 (memorize these cold):**

- **Check/Maintain** - AUTHORITY-CHECK enforced AND proposed in PFCG.
- **Check** - AUTHORITY-CHECK enforced but NOT proposed in PFCG (you must add manually).
- **No Check** - AUTHORITY-CHECK effectively disabled for this tcode/object pair. Dangerous, audit-flagged.
- **Unmaintained** - No entry exists; object is still checked in code but silently not proposed. A very common root cause of "new custom transaction has zero authorizations proposed."

**One-line answer for the interview**: "SU24 decides what PFCG proposes when you build a role; SU25 is how you re-sync that proposal data after SAP changes its shipped defaults during an upgrade."
