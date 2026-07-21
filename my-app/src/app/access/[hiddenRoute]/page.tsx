import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth/jwt";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Team } from "@/models/Team";
import { unlockNextModule } from "@/engine/gameEngine";

interface PageProps {
  params: Promise<{
    hiddenRoute: string;
  }>;
}

export default async function HiddenAccessPage({ params }: PageProps) {
  const { hiddenRoute } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("blackbox_session")?.value;

  if (!token) {
    return (
      <section className="glass-panel max-w-xl space-y-4 p-8 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-danger">
          Access Denied
        </p>
        <h1 className="font-heading text-4xl font-bold text-text">
          No Authentication Token
        </h1>
        <p className="font-mono text-sm text-secondary-text">
          Please authenticate first to access this module.
        </p>
      </section>
    );
  }

  const payload = await verifyAuthToken(token);

  if (!payload) {
    return (
      <section className="glass-panel max-w-xl space-y-4 p-8 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-danger">
          Access Denied
        </p>
        <h1 className="font-heading text-4xl font-bold text-text">
          Invalid Token
        </h1>
        <p className="font-mono text-sm text-secondary-text">
          Your authentication token is invalid or expired.
        </p>
      </section>
    );
  }

  // Verify that the hidden route matches
  if (hiddenRoute !== payload.hiddenRoute) {
    return (
      <section className="glass-panel max-w-xl space-y-4 p-8 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-danger">
          Access Denied
        </p>
        <h1 className="font-heading text-4xl font-bold text-text">
          Invalid Route
        </h1>
        <p className="font-mono text-sm text-secondary-text">
          The hidden route does not match your token.
        </p>
      </section>
    );
  }

  // Verify team exists in database
  await connectToDatabase();
  const team = await Team.findOne({ teamId: payload.teamId }).lean();

  if (!team) {
    return (
      <section className="glass-panel max-w-xl space-y-4 p-8 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-danger">
          Access Denied
        </p>
        <h1 className="font-heading text-4xl font-bold text-text">
          Team Not Found
        </h1>
        <p className="font-mono text-sm text-secondary-text">
          Your team could not be found in the database.
        </p>
      </section>
    );
  }

  // Unlock next module using game engine
  await unlockNextModule(payload.teamId);

  // If all validations pass, show success message
  // This page can be replaced with actual module content
  return (
    <section className="glass-panel max-w-xl space-y-4 p-8 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">
        Access Granted
      </p>
      <h1 className="font-heading text-4xl font-bold text-text">
        Authentication Successful
      </h1>
      <div className="space-y-2 font-mono text-sm text-secondary-text">
        <p>Team: {team.teamName}</p>
        <p>Event ID: {payload.eventId}</p>
        <p>Current Module: {team.currentModule}</p>
      </div>
      <p className="font-mono text-sm text-primary">
        Proceeding to next module...
      </p>
    </section>
  );
}
