import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";

export default async function CoreVaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModuleRouteAccess(5);

  return children;
}
