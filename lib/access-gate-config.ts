// This is a *cosmetic* visitor gate only - NOT a security control.
// The site is a fully static export with no backend, so this passcode and
// hint answer are shipped in plain text inside the public JS bundle and the
// public GitHub repo's source. Anyone who opens browser dev tools or reads
// the source can see and bypass this instantly. Do not put anything here
// you use as a real credential elsewhere, and do not rely on this to
// protect anything actually sensitive.
export const ACCESS_GATE_CONFIG = {
  passcode: "sapsecurity2026",
  hintQuestion: "What is this site about?",
  hintAnswer: "SAP Security interview prep",
  githubIssueUrl:
    "https://github.com/spatro4/SAP_Security/issues/new?" +
    new URLSearchParams({
      title: "Access request",
      body: "Please grant me the current site passcode.\n\nName:\nReason for access:",
    }).toString(),
  localStorageKey: "sap-security-academy-access-granted",
};
