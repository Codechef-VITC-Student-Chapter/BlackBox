export type LoginInput = {
  eventId: string;
  pin: string;
};

export function parseLoginInput(value: unknown): LoginInput | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const body = value as Record<string, unknown>;
  const eventId = typeof body.eventId === "string" ? body.eventId.trim().toUpperCase() : "";
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";

  if (!eventId || !pin) {
    return null;
  }

  return { eventId, pin };
}
