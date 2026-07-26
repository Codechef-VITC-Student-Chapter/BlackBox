"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Maps currentModule number → the route for that module.
 * Keep this in sync with the actual game module routes.
 */
const MODULE_ROUTES: Record<number, string> = {
  1: "/authentication",
  2: "/repository-recovery",
  3: "/network-labyrinth",
  4: "/codechef-puzzle",
  5: "/core-vault",
  6: "/engineer-certification",
  7: "/final-authorization",
};

/**
 * useModuleGuard(requiredModule)
 *
 * Call this at the top of any module page.
 * - If the team is not authenticated → redirects to /authentication
 * - If team.currentModule !== requiredModule → redirects to their actual
 *   current module's route (prevents skipping ahead or going back)
 */
export function useModuleGuard(requiredModule: number): void {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });

        if (!res.ok) {
          // Not authenticated — send to start
          if (!cancelled) router.replace("/authentication");
          return;
        }

        const { team } = await res.json();

        if (cancelled) return;

        if (team.currentModule !== requiredModule) {
          const route =
            MODULE_ROUTES[team.currentModule as number] ?? "/authentication";
          router.replace(route);
        }
      } catch {
        if (!cancelled) router.replace("/authentication");
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [requiredModule, router]);
}
