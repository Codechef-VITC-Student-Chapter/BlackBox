import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";

export default async function FinalAuthorizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModuleRouteAccess(7, {
    route: "/final-authorization/success",
    completedModule: 7,
    nextModule: 7,
  });

  return children;
}
