export type AuthTokenPayload = {
  teamId: string;
};

export type AuthenticatedTeam = {
  teamId: string;
  teamName: string;
  currentModule: number;
  score: number;
};
