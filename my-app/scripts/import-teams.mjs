import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";

const TEAM_ID_PREFIX = "BBXTEAM";
const TEAM_ID_WIDTH = 4;
const EVENT_ID_PREFIX = "EVT-2026";
const OUTPUT_FILE_NAME = "generated_team_credentials.csv";
const PIN_LENGTH = 16;
const SPECIAL_CHARS = "!@$*_-+=";

const teamSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true, unique: true, trim: true, uppercase: true, index: true },
    teamName: { type: String, required: true, trim: true },
    eventId: { type: String, required: true, trim: true, uppercase: true, index: true },
    loginPin: { type: String, required: true, select: false },
    eventToken: { type: String, required: true, unique: true, trim: true, select: false },
    currentModule: { type: Number, required: true, min: 1, max: 7, default: 1 },
    score: { type: Number, required: true, min: 0, default: 0 },
    module2Data: { recoveryKey: { type: String, trim: true, default: null } },
    module3Data: { recoveryKey: { type: String, trim: true, default: null } },
    module4Data: {
      plaintextKey: { type: String, trim: true, default: null },
      encryptedKey: { type: String, trim: true, default: null },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

const FIELD_ALIASES = {
  timestamp: ["timestamp"],
  name: ["name"],
  email: ["email id", "email", "email address"],
  phone: ["phone number", "phone", "mobile number", "contact number"],
  collegeName: ["college name", "college"],
  teamName: ["team name"],
  leaderName: ["team lead name", "leader name", "team leader name"],
  leaderRegistrationNumber: [
    "team lead registration number",
    "leader registration number",
    "team leader registration number",
  ],
  member2Name: ["team member 2 name", "member 2 name"],
  member2RegistrationNumber: ["team member 2 registration number", "member 2 registration number"],
  member3Name: ["team member 3 name", "member 3 name"],
  member3RegistrationNumber: ["team member 3 registration number", "member 3 registration number"],
};

const REQUIRED_FIELDS = ["teamName"];
const OUTPUT_COLUMNS = [
  "Timestamp",
  "Name",
  "Team Name",
  "College Name",
  "Leader Name",
  "Leader Registration Number",
  "Email",
  "Phone",
  "Member 2",
  "Member 2 Registration Number",
  "Member 3",
  "Member 3 Registration Number",
  "team_id",
  "event_id",
  "team_pin",
  "event_token",
  "MongoDB ObjectId",
  "Status",
  "Message",
];

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--csv") {
      args.csvPath = argv[index + 1];
      index += 1;
    } else if (arg === "--out-dir") {
      args.outputDir = argv[index + 1];
      index += 1;
    }
  }

  return args;
}

function normalizeHeader(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseCsv(content) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);

  return rows;
}

function toCsvValue(value) {
  const stringValue = String(value ?? "");

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function toCsv(rows) {
  return rows.map((row) => OUTPUT_COLUMNS.map((column) => toCsvValue(row[column])).join(",")).join("\n");
}

function buildHeaderMap(headers) {
  const normalizedHeaders = new Map(headers.map((header, index) => [normalizeHeader(header), index]));
  const headerMap = {};

  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const matchedAlias = aliases.find((alias) => normalizedHeaders.has(alias));

    if (matchedAlias) {
      headerMap[field] = normalizedHeaders.get(matchedAlias);
    }
  }

  return headerMap;
}

function getField(row, headerMap, field) {
  const index = headerMap[field];
  return typeof index === "number" ? (row[index] ?? "").trim() : "";
}

function registrationFromRow(row, headerMap) {
  return {
    timestamp: getField(row, headerMap, "timestamp"),
    name: getField(row, headerMap, "name"),
    email: getField(row, headerMap, "email"),
    phone: getField(row, headerMap, "phone"),
    collegeName: getField(row, headerMap, "collegeName"),
    teamName: getField(row, headerMap, "teamName"),
    leaderName: getField(row, headerMap, "leaderName"),
    leaderRegistrationNumber: getField(row, headerMap, "leaderRegistrationNumber"),
    member2Name: getField(row, headerMap, "member2Name"),
    member2RegistrationNumber: getField(row, headerMap, "member2RegistrationNumber"),
    member3Name: getField(row, headerMap, "member3Name"),
    member3RegistrationNumber: getField(row, headerMap, "member3RegistrationNumber"),
  };
}

function randomFromAlphabet(alphabet) {
  return alphabet[crypto.randomInt(0, alphabet.length)];
}

function shuffle(value) {
  const chars = value.split("");

  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.randomInt(0, index + 1);
    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
  }

  return chars.join("");
}

function generatePin() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const all = `${uppercase}${lowercase}${numbers}${SPECIAL_CHARS}`;
  let pin = [
    randomFromAlphabet(uppercase),
    randomFromAlphabet(lowercase),
    randomFromAlphabet(numbers),
    randomFromAlphabet(SPECIAL_CHARS),
  ].join("");

  while (pin.length < PIN_LENGTH) {
    pin += randomFromAlphabet(all);
  }

  return shuffle(pin);
}

function generateEventId() {
  return `${EVENT_ID_PREFIX}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function generateEventToken() {
  return crypto.randomBytes(32).toString("hex");
}

function formatTeamId(number) {
  return `${TEAM_ID_PREFIX}${String(number).padStart(TEAM_ID_WIDTH, "0")}`;
}

async function valueExists(field, value) {
  return Boolean(await Team.exists({ [field]: value }));
}

async function generateUniqueValue(field, generator, seen) {
  let value = generator();

  while (seen.has(value) || (await valueExists(field, value))) {
    value = generator();
  }

  seen.add(value);
  return value;
}

async function generateUniqueTeamId(counter, seen) {
  let next = counter;
  let teamId = formatTeamId(next);

  while (seen.has(teamId) || (await valueExists("teamId", teamId))) {
    next += 1;
    teamId = formatTeamId(next);
  }

  seen.add(teamId);
  return { teamId, nextCounter: next + 1 };
}

function outputRow(registration, generated, status, message, objectId = "") {
  return {
    Timestamp: registration.timestamp,
    Name: registration.name,
    "Team Name": registration.teamName,
    "College Name": registration.collegeName,
    "Leader Name": registration.leaderName,
    "Leader Registration Number": registration.leaderRegistrationNumber,
    Email: registration.email,
    Phone: registration.phone,
    "Member 2": registration.member2Name,
    "Member 2 Registration Number": registration.member2RegistrationNumber,
    "Member 3": registration.member3Name,
    "Member 3 Registration Number": registration.member3RegistrationNumber,
    team_id: generated.teamId,
    event_id: generated.eventId,
    team_pin: generated.loginPin,
    event_token: generated.eventToken,
    "MongoDB ObjectId": objectId,
    Status: status,
    Message: message,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const csvPath = args.csvPath || process.env.REGISTRATION_CSV_PATH;
  const outputDir = args.outputDir || process.env.OUTPUT_DIR || process.cwd();
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) throw new Error("Missing MONGODB_URI environment variable.");
  if (!csvPath) throw new Error("Missing CSV path. Use --csv <path> or REGISTRATION_CSV_PATH.");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri, { bufferCommands: false });

  console.log("Reading CSV...");
  const csvContent = await fs.readFile(path.resolve(csvPath), "utf8");
  const parsedRows = parseCsv(csvContent);

  if (parsedRows.length < 2) {
    throw new Error("Invalid CSV: expected a header row and at least one data row.");
  }

  const [headers, ...dataRows] = parsedRows;
  const headerMap = buildHeaderMap(headers);
  const missingColumns = REQUIRED_FIELDS.filter((field) => typeof headerMap[field] !== "number");

  if (missingColumns.length > 0) {
    throw new Error(`Missing required CSV columns: ${missingColumns.join(", ")}`);
  }

  console.log("Generating credentials...");
  const seenTeamIds = new Set();
  const seenEventIds = new Set();
  const seenPins = new Set();
  const seenTokens = new Set();
  const seenTeamNames = new Set();
  const seenEmails = new Set();
  const outputRows = [];
  const summary = { inserted: 0, skipped: 0, failed: 0 };
  let teamCounter = 1;

  for (let index = 0; index < dataRows.length; index += 1) {
    const registration = registrationFromRow(dataRows[index], headerMap);
    const rowNumber = index + 2;
    const generated = { teamId: "", eventId: "", loginPin: "", eventToken: "" };

    try {
      if (!registration.teamName) {
        summary.failed += 1;
        outputRows.push(outputRow(registration, generated, "FAILED", `Row ${rowNumber}: missing Team Name.`));
        continue;
      }

      const normalizedTeamName = registration.teamName.trim().toLowerCase();
      const normalizedEmail = registration.email.trim().toLowerCase();

      if (seenTeamNames.has(normalizedTeamName)) {
        summary.skipped += 1;
        outputRows.push(outputRow(registration, generated, "SKIPPED", `Row ${rowNumber}: duplicate Team Name in CSV.`));
        continue;
      }

      if (normalizedEmail && seenEmails.has(normalizedEmail)) {
        summary.skipped += 1;
        outputRows.push(outputRow(registration, generated, "SKIPPED", `Row ${rowNumber}: duplicate Email in CSV.`));
        continue;
      }

      const duplicateTeam = await Team.exists({ teamName: registration.teamName });

      if (duplicateTeam) {
        summary.skipped += 1;
        outputRows.push(outputRow(registration, generated, "SKIPPED", `Row ${rowNumber}: Team Name already exists.`));
        continue;
      }

      seenTeamNames.add(normalizedTeamName);
      if (normalizedEmail) seenEmails.add(normalizedEmail);

      const teamIdResult = await generateUniqueTeamId(teamCounter, seenTeamIds);
      teamCounter = teamIdResult.nextCounter;
      generated.teamId = teamIdResult.teamId;
      generated.eventId = await generateUniqueValue("eventId", generateEventId, seenEventIds);
      generated.loginPin = await generateUniqueValue("loginPin", generatePin, seenPins);
      generated.eventToken = await generateUniqueValue("eventToken", generateEventToken, seenTokens);

      console.log(`Inserting Team ${summary.inserted + 1}: ${registration.teamName} (${generated.teamId})`);
      const team = await Team.create({
        teamId: generated.teamId,
        teamName: registration.teamName,
        eventId: generated.eventId,
        loginPin: generated.loginPin,
        eventToken: generated.eventToken,
        currentModule: 1,
        score: 0,
      });

      summary.inserted += 1;
      outputRows.push(outputRow(registration, generated, "INSERTED", "Inserted successfully.", String(team._id)));
    } catch (error) {
      summary.failed += 1;
      const message = error instanceof Error ? error.message : "Unknown error.";
      outputRows.push(outputRow(registration, generated, "FAILED", `Row ${rowNumber}: ${message}`));
    }
  }

  await fs.mkdir(path.resolve(outputDir), { recursive: true });
  const outputPath = path.resolve(outputDir, OUTPUT_FILE_NAME);
  await fs.writeFile(outputPath, `${toCsv(outputRows)}\n`, "utf8");

  console.log("Import Complete.");
  console.log(`Inserted: ${summary.inserted}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Failed: ${summary.failed}`);
  console.log(`Generated CSV saved to: ${outputPath}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Import failed:", error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
