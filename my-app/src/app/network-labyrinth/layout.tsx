import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";
export default async function NetworkLabyrinthLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModuleRouteAccess(3, {
    route: "/network-labyrinth/success",
    completedModule: 3,
    nextModule: 4,
  });

  return children;
}
