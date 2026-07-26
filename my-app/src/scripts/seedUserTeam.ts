import { connectToDatabase } from "../lib/db/mongodb";
import { Team } from "../models/Team";
import { Progress } from "../models/Progress";

async function seedUserTeam() {
  console.log("Connecting to MongoDB...");
  await connectToDatabase();

  const teamData = {
    teamId: "GOWREESH-VT",
    teamName: "Gowreesh-VT",
    eventId: "GOWREESH",
    loginPin: "123456",
    eventToken: "token-gowreesh-2026",
    currentModule: 1,
    score: 0,
  };

  // Upsert team
  const team = await Team.findOneAndUpdate(
    { teamId: teamData.teamId },
    { $set: teamData },
    { upsert: true, new: true }
  );

  console.log("✅ Team seeded successfully!");
  console.log("Team Details:");
  console.log(`- Team Name: ${teamData.teamName}`);
  console.log(`- Team ID: ${teamData.teamId}`);
  console.log(`- Event ID: ${teamData.eventId}`);
  console.log(`- Login PIN: ${teamData.loginPin}`);
  console.log(`- Event Token: ${teamData.eventToken}`);
  console.log(`- Current Module: ${team.currentModule}`);

  // Ensure Progress is clean for Module 1
  await Progress.updateOne(
    { teamId: teamData.teamId, module: 1 },
    { $setOnInsert: { completed: false, attempts: 0 } },
    { upsert: true }
  );

  process.exit(0);
}

seedUserTeam().catch((err) => {
  console.error("❌ Error seeding team:", err);
  process.exit(1);
});
