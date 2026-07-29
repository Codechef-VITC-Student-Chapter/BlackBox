import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true, unique: true, trim: true, uppercase: true, index: true },
    teamName: { type: String, required: true, trim: true },
    eventId: { type: String, required: true, trim: true, uppercase: true, index: true },
    loginPin: { type: String, required: true, select: false },
    eventToken: { type: String, required: true, unique: true, trim: true, select: false },
    currentModule: { type: Number, required: true, min: 1, max: 7, default: 1 },
    score: { type: Number, required: true, min: 0, default: 0 },
    role: { type: String, enum: ["team", "admin"], default: "team" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const progressSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true, trim: true, uppercase: true, index: true },
    module: { type: Number, required: true, min: 1, max: 7 },
    completed: { type: Boolean, required: true, default: false },
    attempts: { type: Number, required: true, min: 0, default: 0 },
    completedAt: { type: Date, default: null },
    moduleState: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const submissionSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true, trim: true, uppercase: true, index: true },
    module: { type: Number, required: true, min: 1, max: 7, index: true },
    submittedAnswer: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, required: true },
    submittedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

const codeSubmissionSchema = new mongoose.Schema(
  {
    user_id: { type: String, default: "anonymous", index: true },
    problem_id: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true, index: true },
    language_id: { type: Number, required: true },
    source_code: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true, strict: false },
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
const Progress = mongoose.models.Progress || mongoose.model("Progress", progressSchema);
const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
const CodeSubmission =
  mongoose.models.CodeSubmission || mongoose.model("CodeSubmission", codeSubmissionSchema);

function parseArgs(argv) {
  const args = {
    all: false,
    dryRun: true,
    includeAdmins: false,
    teamName: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--all") {
      args.all = true;
    } else if (arg === "--team-name") {
      args.teamName = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--yes") {
      args.dryRun = false;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--include-admins") {
      args.includeAdmins = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Delete BLACKBOX teams and related team-owned data.

Usage:
  npm run delete:teams -- --team-name "Team Alpha" --dry-run
  npm run delete:teams -- --team-name "Team Alpha" --yes
  npm run delete:teams -- --all --dry-run
  npm run delete:teams -- --all --yes

Required environment:
  MONGODB_URI

Deletes related records from:
  teams
  progresses
  submissions
  codesubmissions

Safety:
  --dry-run is the default.
  --yes is required to actually delete records.
  --all excludes role: "admin" teams unless --include-admins is passed.
`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTeamQuery(args) {
  if (args.all) {
    return args.includeAdmins ? {} : { role: { $ne: "admin" } };
  }

  if (!args.teamName.trim()) {
    throw new Error('Provide --team-name "Team Name" or --all.');
  }

  return {
    teamName: {
      $regex: new RegExp(`^${escapeRegExp(args.teamName.trim())}$`, "i"),
    },
    ...(args.includeAdmins ? {} : { role: { $ne: "admin" } }),
  };
}

async function countRelated(teamIds) {
  const [progress, submissions, codeSubmissions] = await Promise.all([
    Progress.countDocuments({ teamId: { $in: teamIds } }),
    Submission.countDocuments({ teamId: { $in: teamIds } }),
    CodeSubmission.countDocuments({ user_id: { $in: teamIds } }),
  ]);

  return { progress, submissions, codeSubmissions };
}

async function deleteRelated(teamIds) {
  const [progress, submissions, codeSubmissions, teams] = await Promise.all([
    Progress.deleteMany({ teamId: { $in: teamIds } }),
    Submission.deleteMany({ teamId: { $in: teamIds } }),
    CodeSubmission.deleteMany({ user_id: { $in: teamIds } }),
    Team.deleteMany({ teamId: { $in: teamIds } }),
  ]);

  return {
    teams: teams.deletedCount,
    progress: progress.deletedCount,
    submissions: submissions.deletedCount,
    codeSubmissions: codeSubmissions.deletedCount,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (args.all && args.teamName) {
    throw new Error("Use either --all or --team-name, not both.");
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("Missing MONGODB_URI environment variable.");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri, { bufferCommands: false });

  const teamQuery = buildTeamQuery(args);
  const teams = await Team.find(teamQuery)
    .select("teamId teamName role")
    .lean();

  if (teams.length === 0) {
    console.log("No matching teams found. Nothing to delete.");
    await mongoose.disconnect();
    return;
  }

  const teamIds = teams.map((team) => team.teamId);
  const relatedCounts = await countRelated(teamIds);

  console.log(args.dryRun ? "DRY RUN: no records will be deleted." : "DELETE MODE: records will be deleted.");
  console.log(`Matched teams: ${teams.length}`);
  teams.forEach((team) => {
    console.log(`- ${team.teamName} (${team.teamId}) role=${team.role ?? "team"}`);
  });
  console.log("Related records:");
  console.log(`- progresses: ${relatedCounts.progress}`);
  console.log(`- submissions: ${relatedCounts.submissions}`);
  console.log(`- codesubmissions: ${relatedCounts.codeSubmissions}`);

  if (args.dryRun) {
    console.log("Run again with --yes to delete these records.");
    await mongoose.disconnect();
    return;
  }

  const deleted = await deleteRelated(teamIds);

  console.log("Delete complete.");
  console.log(`Deleted teams: ${deleted.teams}`);
  console.log(`Deleted progresses: ${deleted.progress}`);
  console.log(`Deleted submissions: ${deleted.submissions}`);
  console.log(`Deleted codesubmissions: ${deleted.codeSubmissions}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Delete failed:", error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
