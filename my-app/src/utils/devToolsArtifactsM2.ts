/**
 * Utility to inject developer tools artifacts (clues/placeholders)
 * specifically for Module 2 (Repository Recovery).
 * These should only be visible via Browser Developer Tools.
 *
 * Designed to use different storage mechanics than Module 1 to
 * prevent overlap (uses Cookies, Session Storage instead of Local Storage, HTML comments).
 */
export function initializeDevToolsArtifactsM2() {
  if (typeof window === "undefined") return;

  // 1. Cookies clue (Platform)
  document.cookie = "bb_platform=github_platform_placeholder; path=/; max-age=3600; SameSite=Lax";

  // 2. Session Storage clue (Owner)
  sessionStorage.setItem("bb_owner", "github_owner_placeholder");

  // 3. Helper console message for manual state testing (not a puzzle clue)
  console.log(
    "%c[Module 2 Dev Mode]%c Run %cwindow.showRepositoryVerified()%c in the console to manually trigger the success state.",
    "color: #ffaa00; font-weight: bold; font-family: monospace;",
    "color: #bbbbbb; font-family: monospace;",
    "color: #00e5ff; font-weight: bold; font-family: monospace; background: #0c0f12; padding: 2px 4px;",
    "color: #bbbbbb; font-family: monospace;"
  );
}
