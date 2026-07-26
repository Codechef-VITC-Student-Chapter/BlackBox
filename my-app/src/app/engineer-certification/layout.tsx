import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";

export default async function EngineerCertificationLayout({
  children,
}: {
  children: ReactNode;
}) {
<<<<<<< HEAD
  await requireModuleRouteAccess(7);
=======
  await requireModuleRouteAccess(6);
>>>>>>> upstream/main

  return children;
}
