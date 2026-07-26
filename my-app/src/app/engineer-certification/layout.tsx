import { requireModuleRouteAccess } from "@/lib/modules/routeAccess";
import type { ReactNode } from "react";

export default async function EngineerCertificationLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModuleRouteAccess(7);

  return children;
}