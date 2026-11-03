export type AuthTokenPayload = {
  teamId: string;
  eventId: string;
  pin: string;
  hiddenRoute: string;
};

export type AuthenticatedTeam = {
  teamId: string;
  teamName: string;
  currentModule: number;
  score: number;
  role?: "team" | "admin";
  module2Data?: {
    recoveryKey?: string | null;
  };
  module3Data?: {
    recoveryKey?: string | null;
  };
};
