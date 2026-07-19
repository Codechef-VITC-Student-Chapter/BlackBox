import { generateExpectedValue } from "@/engine/challengeGenerator";

// Decoded from the physical event poster (morse code) — same for every
// team, not per-team. Update this if the poster clue changes.
export const FIXED_RECOVERY_KEY = "BLACKBOX20260729";

/**
 * Engineer ID — the same value as Module 1's hidden route for this team.
 * Reuses generateExpectedValue({eventToken, module: 1}) rather than a
 * standalone derivation: today that resolves to challengeGenerator's
 * default hash fallback, but the moment Module 1's owner calls
 * registerModuleGenerator(1, ...) with the real hidden-route logic, this
 * picks it up automatically — no coordination needed on our side.
 */
export function generateModule6EngineerId(eventToken: string): string {
  return generateExpectedValue({ eventToken, module: 1 });
}
