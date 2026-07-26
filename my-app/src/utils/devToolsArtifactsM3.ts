/**
 * Utility to inject developer-tools-visible artifacts specifically for
 * Module 3 – Network Labyrinth.
 *
 * Unlike Modules 1 & 2 (which used localStorage / cookies / sessionStorage),
 * Module 3 clues live in the Network tab — inside API response headers and
 * response bodies. This utility only sets a subtle console hint for organisers
 * and does NOT store any puzzle clues client-side (they are in the API routes).
 *
 * Fragment locations:
 *   Fragment 1 → GET /api/network-labyrinth/status   → X-Node-Id header
 *   Fragment 2 → GET /api/network-labyrinth/services → JSON body _meta.sig
 *   Fragment 3 → GET /api/network-labyrinth/internal → X-Restricted-Fragment header (403)
 *   Fragment 4 → GET /api/network-labyrinth/recovery → JSON body _trace (hex-encoded)
 *
 * Activity Logs hex offsets map to the request sequence:
 *   0x274A → /status   request
 *   0x274A → /network  request
 *   0x274B → /services request
 *   0x274B → /health   request
 *   0x274C → /recovery request  ← correlates with Fragment 4
 */
export function initializeDevToolsArtifactsM3() {
  if (typeof window === "undefined") return;

  // Organiser-only dev hint (not a puzzle clue)
  console.log(
    "%c[Module 3 Dev Mode]%c Clues live in API response headers/bodies.\n" +
    "Run %cwindow.showGatewayRestored()%c in the console to manually trigger the success state.",
    "color: #00e5ff; font-weight: bold; font-family: monospace;",
    "color: #9ca3af; font-family: monospace;",
    "color: #00e5ff; font-weight: bold; font-family: monospace; background: #0c0f12; padding: 2px 4px;",
    "color: #9ca3af; font-family: monospace;"
  );
}
