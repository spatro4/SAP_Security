export interface CategoryDef {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string; // lucide icon name, resolved in components
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "ecc-security",
    title: "ECC Security & Authorization Concept",
    shortTitle: "ECC Security",
    description: "Classic ABAP authorization concept, authorization checks, and ECC-specific security architecture.",
    icon: "ShieldCheck",
  },
  {
    slug: "s4hana-security",
    title: "S/4HANA Security Architecture",
    shortTitle: "S/4HANA Security",
    description: "Embedded analytics, Fiori-first authorizations, business roles, and S/4HANA-specific authorization objects.",
    icon: "Layers",
  },
  {
    slug: "fiori-security",
    title: "Fiori Authorization Architecture",
    shortTitle: "Fiori Security",
    description: "Launchpad, catalogs, groups, spaces/pages, OData services and front-end/back-end role design.",
    icon: "LayoutGrid",
  },
  {
    slug: "gateway-security",
    title: "SAP Gateway Security Deep Dive",
    shortTitle: "Gateway Security",
    description: "SICF services, OData authorization, CSRF tokens, batch processing, and Gateway hub security.",
    icon: "Network",
  },
  {
    slug: "abap-authorization",
    title: "ABAP Authorization Engine: PFCG, SU24, SU25",
    shortTitle: "ABAP Authorization",
    description: "Role design, derived/composite roles, SU24 proposals, SU25 upgrade migration, AGR_* and USR* tables.",
    icon: "KeyRound",
  },
  {
    slug: "authorization-troubleshooting",
    title: "Authorization Trace & Troubleshooting",
    shortTitle: "Auth Troubleshooting",
    description: "SU53, ST01, STAUTHTRACE, SUIM, debugging missing authorizations end-to-end.",
    icon: "Search",
  },
  {
    slug: "btp-security",
    title: "SAP BTP Security Architecture",
    shortTitle: "BTP Security",
    description: "XSUAA, scopes, role collections, subaccounts, trust configuration, and multi-tenant security.",
    icon: "Cloud",
  },
  {
    slug: "identity-authentication",
    title: "SAP Cloud Identity Services: Identity Authentication (IAS)",
    shortTitle: "IAS",
    description: "Corporate identity providers, authentication flows, conditional authentication, and risk-based auth.",
    icon: "Fingerprint",
  },
  {
    slug: "identity-provisioning",
    title: "SAP Cloud Identity Services: Identity Provisioning (IPS)",
    shortTitle: "IPS",
    description: "Source/target systems, provisioning jobs, SCIM, attribute mapping, and synchronization troubleshooting.",
    icon: "RefreshCcw",
  },
  {
    slug: "sso-saml-federation",
    title: "SSO, SAML2, Kerberos, X.509 & Certificate Management",
    shortTitle: "SSO & SAML",
    description: "Federation protocols, trust relationships, certificate lifecycle, and single sign-on architecture.",
    icon: "Link2",
  },
  {
    slug: "oauth-principal-propagation",
    title: "OAuth 2.0, Principal Propagation & Cloud Connector",
    shortTitle: "OAuth & Cloud Connector",
    description: "OAuth grant types, principal propagation to on-premise, Cloud Connector access control.",
    icon: "ShieldEllipsis",
  },
  {
    slug: "hana-security",
    title: "SAP HANA Security & Database Security",
    shortTitle: "HANA Security",
    description: "Privileges, roles, analytic privileges, data masking/anonymization, and HANA audit policies.",
    icon: "Database",
  },
  {
    slug: "network-transport-security",
    title: "RFC, Transport, SAProuter & Web Dispatcher Security",
    shortTitle: "Network & Transport",
    description: "Gateway ACLs, RFC destinations, transport security, SAProuter routing, and Web Dispatcher hardening.",
    icon: "Router",
  },
  {
    slug: "grc-sod-audit",
    title: "SAP GRC, Segregation of Duties & Audit Readiness",
    shortTitle: "GRC & Audit",
    description: "Access Control, risk analysis, mitigation controls, firefighter/emergency access, and audit evidence.",
    icon: "Scale",
  },
  {
    slug: "production-support-migration",
    title: "Production Support, Performance, Migration & Upgrade Security",
    shortTitle: "Production Support",
    description: "War-room troubleshooting, RCA methodology, S/4HANA migration, upgrades, and cloud security operations.",
    icon: "LifeBuoy",
  },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const DIFFICULTIES = ["Easy", "Medium", "Hard", "Architect", "Manager", "Principal Architect"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
