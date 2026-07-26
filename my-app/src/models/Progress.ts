import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { GAME_CONFIG } from "@/config/game";

const progressSchema = new Schema(
  {
    teamId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    module: {
      type: Number,
      required: true,
      min: GAME_CONFIG.firstModule,
      max: GAME_CONFIG.totalModules,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    attempts: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    mod3Key: {
      type: String,
      default: "DUMMY-NET-KEY-999",
    },
    mod4Key: {
      type: String,
      default: "DUMMY-PUZ-KEY-777",
    },
    moduleState: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

progressSchema.index({ teamId: 1, module: 1 }, { unique: true });

export type ProgressDocument = InferSchemaType<typeof progressSchema>;

export const Progress: Model<ProgressDocument> =
  mongoose.models.Progress ?? mongoose.model("Progress", progressSchema);