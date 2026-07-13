---
title: "SAML vs OAuth 2.0 vs Kerberos: Side by Side"
summary: "Three protocols that get confused constantly - what each actually authenticates and authorizes."
---

| | SAML 2.0 | OAuth 2.0 | Kerberos |
|---|---|---|---|
| **Primary purpose** | Authentication (and attribute exchange) for web SSO | Authorization - delegated access to an API/resource | Authentication in a trusted network domain |
| **Token format** | XML assertion, signed (and often encrypted) | Access token (often JWT), bearer-based | Ticket (TGT + service tickets), symmetric-key based |
| **Typical SAP use** | Browser SSO into Fiori Launchpad / NetWeaver via IAS or a corporate IdP | Service-to-service or app-to-API calls (e.g., OData with OAuth SAML Bearer flow), Principal Propagation | Legacy intranet SSO, desktop-based, less common in modern cloud-first landscapes |
| **Where trust lives** | Certificate-based trust between IdP and SP (metadata exchange) | Client ID/secret or certificate + token issuer trust (often IAS as OAuth server) | Domain-joined Key Distribution Center (KDC) trust |
| **Common failure mode** | Certificate expiry, clock skew, assertion audience mismatch | Token expiry, scope mismatch, redirect URI mismatch | Ticket expiry, SPN misconfiguration, clock skew |
| **Interview trap** | "SAML does authorization" - it doesn't natively; it carries attributes an app may use for authorization decisions | "OAuth is for login" - OAuth alone doesn't authenticate a user identity (that's OpenID Connect layered on top) | "Kerberos is dead" - still common in on-prem AD-integrated SAP GUI/RFC SSO scenarios |

**One-line answers:**
- SAML2 = "Here's who you are, signed by someone you trust" (authentication + attributes).
- OAuth 2.0 = "Here's a token that proves you're allowed to call this API, with these scopes" (authorization).
- Kerberos = "Here's a ticket proving I already authenticated to the domain" (authentication, network-trust-based).
