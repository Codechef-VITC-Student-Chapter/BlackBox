export type LoginInput = {
  teamId: string;
  pin: string;
};

export function parseLoginInput(value: unknown): LoginInput | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const body = value as Record<string, unknown>;
  const teamId = typeof body.teamId === "string" ? body.teamId.trim().toUpperCase() : "";
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";

  if (!teamId || !pin) {
    return null;
  }

  return { teamId, pin };
}
