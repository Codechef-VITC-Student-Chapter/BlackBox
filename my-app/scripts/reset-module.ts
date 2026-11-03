import mongoose from "mongoose";
import { Team } from "../src/models/Team";

async function resetModule() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blackbox";
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    console.log("Resetting currentModule to 1 for all teams...");
    const result = await Team.updateMany({}, { $set: { currentModule: 1 } });
    console.log(`Updated ${result.modifiedCount} teams`);

    await mongoose.disconnect();
    console.log("\nDatabase reset successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

resetModule();
