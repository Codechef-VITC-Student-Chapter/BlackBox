import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { completeModule, unlockNextModule } from "@/engine/gameEngine";
import { verifyAuthToken } from "@/lib/auth/jwt";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Team } from "@/models/Team";
import { GAME_CONFIG } from "@/config/game";

interface PageProps {
  params: Promise<{
    hiddenRoute: string;
  }>;
}

const MODULE_ROUTES: Record<number, string> = {
  1: "/authentication",
  2: "/repository-recovery",
  3: "/network-labyrinth",
  4: "/memory-reconstruction",
  5: "/core-vault",
  6: "/engineer-certification",
  7: "/final-authorization",
};

function forbidden(title: string, message: string) {
  return (
    <section className="glass-panel max-w-xl space-y-4 p-8 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-danger">
        Access Denied
      </p>
      <h1 className="font-heading text-4xl font-bold text-text">{title}</h1>
      <p className="font-mono text-sm text-secondary-text">{message}</p>
    </section>
  );
}

export default async function HiddenAccessPage({ params }: PageProps) {
  const { hiddenRoute } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(GAME_CONFIG.authCookieName)?.value;

  if (!token) {
    redirect("/authentication");
  }

  const payload = await verifyAuthToken(token);

  if (!payload) {
    redirect("/authentication");
  }

  if (hiddenRoute !== payload.hiddenRoute) {
    return forbidden("Invalid Route", "The hidden route does not match your token.");
  }

  await connectToDatabase();
  const team = await Team.findOne({ teamId: payload.teamId })
    .select("+loginPin teamId teamName eventId loginPin currentModule")
    .lean<{
      teamId: string;
      teamName: string;
      eventId: string;
      loginPin: string;
      currentModule: number;
    } | null>();

  if (!team) {
    return forbidden("Team Not Found", "Your team could not be found in the database.");
  }

  if (payload.eventId !== team.eventId || payload.pin !== team.loginPin) {
    return forbidden("Invalid Session", "Your authentication token does not match this team.");
  }

  const accessedModule = Number.parseInt(hiddenRoute.split("-")[1] ?? "", 10);
  const completedModule = accessedModule - 1;

  if (accessedModule !== 2 || completedModule !== 1) {
    return forbidden("Invalid Module", "This access route is not valid for the authentication module.");
  }

  const expectedHiddenRoute = `module-${accessedModule}-${team.eventId}-${team.loginPin}-${team.teamId}`;

  if (hiddenRoute !== expectedHiddenRoute) {
    return forbidden("Invalid Route", "The hidden route does not belong to this team.");
  }

  if (team.currentModule !== completedModule && team.currentModule !== accessedModule) {
    redirect(MODULE_ROUTES[team.currentModule] ?? "/authentication");
  }

  if (team.currentModule === completedModule) {
    try {
      await completeModule(team.teamId, completedModule);
      await unlockNextModule(team.teamId);
    } catch (error) {
      console.error("[HiddenAccessPage] Error completing module:", error);
    }
  }

  const progressedTeam = await Team.findOne({ teamId: team.teamId })
    .select("currentModule")
    .lean<{ currentModule: number } | null>();

  if (!progressedTeam) {
    return forbidden("Team Not Found", "Your team could not be found in the database.");
  }

  if (progressedTeam.currentModule === accessedModule) {
    redirect("/repository-recovery");
  }

  redirect(MODULE_ROUTES[progressedTeam.currentModule] ?? "/authentication");
}
