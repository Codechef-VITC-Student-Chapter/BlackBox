import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";

export default async function FinalAuthorizationLayout({
  children,
}: {
  children: ReactNode;
}) {
<<<<<<< HEAD
  await requireModuleRouteAccess(6);
=======
  await requireModuleRouteAccess(7);
>>>>>>> upstream/main

  return children;
}
