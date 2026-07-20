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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type TeamDocument = InferSchemaType<typeof teamSchema>;

export const Team: Model<TeamDocument> =
  mongoose.models.Team ?? mongoose.model("Team", teamSchema);
