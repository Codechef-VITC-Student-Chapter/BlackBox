import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const supportedLanguageSchema = new Schema({
  language_id: { type: Number, required: true },
  starter_code: { type: String, default: "" },
}, { _id: false });

const problemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    
    cpu_time_limit: { type: Number, required: true, default: 2 },
    wall_time_limit: { type: Number, required: true, default: 5 },
    memory_limit: { type: Number, required: true, default: 262144 },
    
    supported_languages: [supportedLanguageSchema],
    
    published: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export type ProblemDocument = InferSchemaType<typeof problemSchema> & { _id: mongoose.Types.ObjectId | string };

export const Problem: Model<ProblemDocument> =
  mongoose.models.Problem ?? mongoose.model("Problem", problemSchema);
