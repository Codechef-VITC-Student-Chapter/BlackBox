import { createHash } from "crypto";
import { isValidModule } from "@/validators/modules";

export type ChallengeContext = {
  eventToken: string;
  module: number;
};

export type ChallengeGenerator = (context: ChallengeContext) => string;

const moduleGenerators = new Map<number, ChallengeGenerator>();

export function registerModuleGenerator(module: number, generator: ChallengeGenerator): void {
  if (!isValidModule(module)) {
    throw new Error(`Invalid module number: ${module}`);
  }

  moduleGenerators.set(module, generator);
}

export function generateExpectedValue(context: ChallengeContext): string {
  if (!isValidModule(context.module)) {
    throw new Error(`Invalid module number: ${context.module}`);
  }

  const customGenerator = moduleGenerators.get(context.module);

  if (customGenerator) {
    return customGenerator(context);
  }

  return createHash("sha256")
    .update(`${context.eventToken}:module:${context.module}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
}
