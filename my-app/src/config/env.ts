const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"] as const;

type RequiredEnvVar = (typeof requiredEnvVars)[number];

export type ServerEnv = Record<RequiredEnvVar, string> & {
  NODE_ENV: string;
};

export function getServerEnv(): ServerEnv {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    MONGODB_URI: process.env.MONGODB_URI as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    NODE_ENV: process.env.NODE_ENV ?? "development",
  };
}
