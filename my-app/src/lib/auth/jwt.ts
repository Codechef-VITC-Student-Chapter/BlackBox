import { getServerEnv } from "@/config/env";
import type { AuthTokenPayload } from "@/types/auth";

type JwtPayload = AuthTokenPayload & {
  iat: number;
  exp: number;
};

function base64UrlEncode(value: string | Uint8Array): string {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

async function getSigningKey(): Promise<CryptoKey> {
  const { JWT_SECRET } = getServerEnv();

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signAuthToken(payload: AuthTokenPayload, expiresInSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(
    JSON.stringify({
      teamId: payload.teamId,
      iat: now,
      exp: now + expiresInSeconds,
    } satisfies JwtPayload),
  );
  const data = `${header}.${body}`;
  const signature = await crypto.subtle.sign("HMAC", await getSigningKey(), new TextEncoder().encode(data));

  return `${data}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [header, body, signature] = parts;
  const data = `${header}.${body}`;
  const isValid = await crypto.subtle.verify(
    "HMAC",
    await getSigningKey(),
    base64UrlDecode(signature),
    new TextEncoder().encode(data),
  );

  if (!isValid) {
    return null;
  }

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload.teamId || payload.exp <= now) {
      return null;
    }

    return { teamId: payload.teamId };
  } catch {
    return null;
  }
}
