---
title: "PFCG Role Types Quick Reference"
summary: "Single, composite, and derived roles - what each one holds and when to use it."
---

| Role Type | Holds Menu? | Holds Authorizations? | Org-Level Values | Typical Use |
|---|---|---|---|---|
| **Single Role** | Yes | Yes | Fixed per role | Job-function slice with no reuse across org units |
| **Master (Derived Parent)** | Yes | Yes (non-org fields) | Blank/template | Central menu + non-org authorization maintenance |
| **Derived Role** | Inherited | Inherited (non-org) + own org values | Entered per role | Same job function across multiple company codes/plants/sales orgs |
| **Composite Role** | No (aggregates children) | No | N/A | User-assignment bundling only |

**Decision rule**: if the same menu and non-org authorizations need to exist for more than one organizational value (plant, company code, sales org), derive. If a role is genuinely unique with zero reuse potential, a single role is acceptable - but always evaluate derivation first.

**Composite roles never generate a profile of their own** - always trace an authorization issue back to the single or derived role actually assigned, never stop at the composite.

**After changing a master role**: always run PFCG mass generation with "Adjust Derived Roles" checked, or the derived children silently go stale.
