import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const testCaseSchema = new Schema(
  {
    problem_id: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },
    input: {
      type: String,
      required: true,
    },
    expected_output: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      default: 1,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: false,
  }
);

testCaseSchema.index({ problem_id: 1, order: 1 });

export type TestCaseDocument = InferSchemaType<typeof testCaseSchema> & { _id: mongoose.Types.ObjectId | string };

export const TestCase: Model<TestCaseDocument> =
  mongoose.models.TestCase ?? mongoose.model("TestCase", testCaseSchema);
