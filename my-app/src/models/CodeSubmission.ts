import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const codeSubmissionSchema = new Schema(
  {
    user_id: {
      type: String, // Can be mapped to Clerk/Auth user later, optional for MVP
      default: "anonymous",
      index: true,
    },
    problem_id: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },
    language_id: {
      type: Number,
      required: true,
    },
    source_code: {
      type: String,
      required: true,
    },
    status: {
      type: String, // Accepted, Wrong Answer, TLE, RE, CE
      required: true,
    },
    passed: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    time: {
      type: Number, // execution time in ms/s or as reported
      default: 0,
    },
    memory: {
      type: Number, // memory used
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export type CodeSubmissionDocument = InferSchemaType<typeof codeSubmissionSchema> & { _id: mongoose.Types.ObjectId | string };

export const CodeSubmission: Model<CodeSubmissionDocument> =
  mongoose.models.CodeSubmission ?? mongoose.model("CodeSubmission", codeSubmissionSchema);
