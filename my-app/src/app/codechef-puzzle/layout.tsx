import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";

export default async function CodeChefPuzzleLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModuleRouteAccess(4, {
    route: "/codechef-puzzle/success",
    completedModule: 4,
    nextModule: 5,
  });

  return children;
}
