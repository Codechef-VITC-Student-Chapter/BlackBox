import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";

export default async function EngineerCertificationLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModuleRouteAccess(6, {
    route: [
      "/engineer-certification/recovery-complete",
      "/engineer-certification/victory-capture",
    ],
    completedModule: 6,
    nextModule: 7,
  });

  return children;
}
