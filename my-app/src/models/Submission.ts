import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { GAME_CONFIG } from "@/config/game";

const submissionSchema = new Schema(
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
      index: true,
    },
    submittedAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

submissionSchema.index({ teamId: 1, module: 1, submittedAt: -1 });

export type SubmissionDocument = InferSchemaType<typeof submissionSchema>;

export const Submission: Model<SubmissionDocument> =
  mongoose.models.Submission ?? mongoose.model("Submission", submissionSchema);
