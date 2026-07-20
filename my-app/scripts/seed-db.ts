import mongoose from "mongoose";
import { Team } from "../src/models/Team";
import { GAME_CONFIG } from "../src/config/game";

const mockTeams = [
  {
    teamId: "TEAM001",
    teamName: "Cyber Warriors",
    eventId: "BLACKBOX2026",
    loginPin: "483921",
    eventToken: "evt-token-001",
    currentModule: GAME_CONFIG.firstModule,
    score: 0,
  },
  {
    teamId: "TEAM002",
    teamName: "Digital Shadows",
    eventId: "BLACKBOX2026",
    loginPin: "123456",
    eventToken: "evt-token-002",
    currentModule: GAME_CONFIG.firstModule,
    score: 0,
  },
  {
    teamId: "TEAM003",
    teamName: "Binary Ghosts",
    eventId: "BLACKBOX2026",
    loginPin: "789012",
    eventToken: "evt-token-003",
    currentModule: GAME_CONFIG.firstModule,
    score: 0,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blackbox";
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing teams
    console.log("Clearing existing teams...");
    await Team.deleteMany({});
    console.log("Cleared existing teams");

    // Insert mock teams
    console.log("Inserting mock teams...");
    await Team.insertMany(mockTeams);
    console.log(`Inserted ${mockTeams.length} mock teams`);

    console.log("\nMock teams created:");
    mockTeams.forEach(team => {
      console.log(`- ${team.teamName} (${team.teamId})`);
      console.log(`  Event ID: ${team.eventId}`);
      console.log(`  PIN: ${team.loginPin}`);
    });

    await mongoose.disconnect();
    console.log("\nDatabase seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
