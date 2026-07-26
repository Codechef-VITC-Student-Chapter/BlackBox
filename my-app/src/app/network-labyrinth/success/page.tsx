import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { hasCompletedModule } from "@/lib/modules/progress";
import GatewayRestoredClient from "./GatewayRestoredClient";
import UnauthorizedSuccessAccess from "./UnauthorizedSuccessAccess";

const MODULE_NUMBER = 3;

export default async function GatewayRestoredPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    redirect("/authentication");
  }

  const completedModule3 = await hasCompletedModule(team.teamId, MODULE_NUMBER);

  if (!completedModule3) {
    return <UnauthorizedSuccessAccess />;
  }

  return <GatewayRestoredClient />;
}
