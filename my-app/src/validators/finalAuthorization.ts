// Someone typed the date portion with separators instead of raw digits,
// e.g. "BLACKBOX2026-07-29" or "BLACKBOX2026/07/29".
const BLACKBOX_WITH_SEPARATED_DATE = /^BLACKBOX\d{4}[-/]\d{2}[-/]\d{2}$/;

// Someone typed a bare date (no BLACKBOX prefix) with separators, in
// either DD/MM/YYYY or YYYY-MM-DD style — both appear as examples in the
// spec, e.g. "29/07/2026" or "2026-07-29".
const BARE_SEPARATED_DATE_DMY = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
const BARE_SEPARATED_DATE_YMD = /^\d{4}[-/]\d{2}[-/]\d{2}$/;

// "BLACKBOX20260729-ENG12345" — key and engineer ID, dash-separated.
const COMBINED_SHAPE = /^(BLACKBOX\d{8})-(\S+)$/;

export type SubmissionClassification =
  | { kind: "date-format-error" }
  | { kind: "key-only-correct" }
  | { kind: "combined"; recoveryKey: string; engineerId: string }
  | { kind: "invalid" };

/**
 * Classifies a raw Module 6 submission into the staged Recovery Flow
 * outcomes:
 *  1. Wrong date format anywhere in the input -> "System reads dates
 *     differently."
 *  2. The correct recovery key typed alone, no engineer ID -> "You can't
 *     recover it without your Engineer ID." + format hint.
 *  3. "<recoveryKey>-<engineerId>" shape -> hand off for a real
 *     correctness check against both expected values.
 *  4. Anything else -> generic rejection.
 *
 * Order matters: date-format checks run first so a malformed date isn't
 * mistaken for a wrong key, and the "key-only-correct" check only fires
 * for the actual correct key (not any BLACKBOX-shaped guess), so guessed
 * keys don't leak the "you're missing the engineer ID" hint.
 */
export function classifySubmission(rawSubmission: string, correctRecoveryKey: string): SubmissionClassification {
  const normalized = rawSubmission.trim().toUpperCase();

  if (
    BLACKBOX_WITH_SEPARATED_DATE.test(normalized) ||
    BARE_SEPARATED_DATE_DMY.test(normalized) ||
    BARE_SEPARATED_DATE_YMD.test(normalized)
  ) {
    return { kind: "date-format-error" };
  }

  const combinedMatch = normalized.match(COMBINED_SHAPE);

  if (combinedMatch) {
    return { kind: "combined", recoveryKey: combinedMatch[1], engineerId: combinedMatch[2] };
  }

  if (normalized === correctRecoveryKey) {
    return { kind: "key-only-correct" };
  }

  return { kind: "invalid" };
}

export function parseSubmissionInput(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const body = value as Record<string, unknown>;
  const submission = typeof body.submission === "string" ? body.submission : "";

  if (!submission.trim()) {
    return null;
  }

  return submission;
}
