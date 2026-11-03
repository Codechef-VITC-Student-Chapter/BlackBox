import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";

export default async function CoreVaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModuleRouteAccess(5, {
    route: "/core-vault/success",
    completedModule: 5,
    nextModule: 6,
  });

  return children;
}
