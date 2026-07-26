export const REPOSITORY_RECOVERY_CHALLENGE = {
  moduleNumber: 2,
  owner: "ishani2025",
  repository: "bLaCKbOXX_C_C",
  recoveryKey: "imanmay2",
  nextModule: 3,
  nextRoute: "/network-labyrinth",
  futureChallengeData: {},
} as const;

export function getRepositoryRecoveryUrl(): string {
  return `https://github.com/${REPOSITORY_RECOVERY_CHALLENGE.owner}/${REPOSITORY_RECOVERY_CHALLENGE.repository}`;
}
