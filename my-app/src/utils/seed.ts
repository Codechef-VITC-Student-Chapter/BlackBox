import { Problem } from "@/models/Problem";
import { TestCase } from "@/models/TestCase";

export interface ProblemSeedData {
  title: string;
  slug: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  limits: {
    cpu: number;
    wall: number;
    memory: number;
  };
  languages: Array<{
    language_id: number;
    starter_code: string;
  }>;
  testcases: Array<{
    input: string;
    output: string;
    hidden: boolean;
    weight?: number;
  }>;
}

export async function seedProblem(data: ProblemSeedData) {
  // Upsert problem
  let problem = await Problem.findOne({ slug: data.slug });

  if (problem) {
    problem.title = data.title;
    problem.description = data.description;
    problem.difficulty = data.difficulty;
    problem.cpu_time_limit = data.limits.cpu;
    problem.wall_time_limit = data.limits.wall;
    problem.memory_limit = data.limits.memory;
    problem.supported_languages = data.languages;
    problem.published = true;
    await problem.save();
  } else {
    problem = await Problem.create({
      title: data.title,
      slug: data.slug,
      description: data.description,
      difficulty: data.difficulty,
      cpu_time_limit: data.limits.cpu,
      wall_time_limit: data.limits.wall,
      memory_limit: data.limits.memory,
      supported_languages: data.languages,
      published: true,
    });
  }

  // Clear existing testcases
  await TestCase.deleteMany({ problem_id: problem._id });

  // Insert new testcases
  const testcasesToInsert = data.testcases.map((tc, index) => ({
    problem_id: problem._id,
    input: tc.input,
    expected_output: tc.output,
    hidden: tc.hidden,
    weight: tc.weight || 1,
    order: index,
  }));

  if (testcasesToInsert.length > 0) {
    await TestCase.insertMany(testcasesToInsert);
  }

  return problem;
}
