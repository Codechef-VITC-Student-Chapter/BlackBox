import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";
export default async function RepositoryRecoveryLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModuleRouteAccess(2, {
    route: "/repository-recovery/success",
    completedModule: 2,
    nextModule: 3,
  });

  return <div className="w-full h-full">{children}</div>;
}
