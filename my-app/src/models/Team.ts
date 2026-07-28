import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { GAME_CONFIG } from "@/config/game";

const teamSchema = new Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    loginPin: {
      type: String,
      required: true,
      select: false,
    },
    eventToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      select: false,
    },
    currentModule: {
      type: Number,
      required: true,
      min: GAME_CONFIG.firstModule,
      max: GAME_CONFIG.totalModules,
      default: GAME_CONFIG.firstModule,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    role: {
      type: String,
      enum: ["team", "admin"],
      default: "team",
    },
    module2Data: {
      recoveryKey: {
        type: String,
        trim: true,
        default: null,
      },
    },
    module3Data: {
      recoveryKey: {
        type: String,
        trim: true,
        default: null,
      },
    },
    module4Data: {
      plaintextKey: {
        type: String,
        trim: true,
        default: null,
      },
      encryptedKey: {
        type: String,
        trim: true,
        default: null,
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type TeamDocument = InferSchemaType<typeof teamSchema>;

export const Team: Model<TeamDocument> =
  mongoose.models.Team ?? mongoose.model("Team", teamSchema);
