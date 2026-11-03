import { createHash } from "crypto";

/**
 * Module 3 – Network Labyrinth: Fragment Generator
 *
 * All 4 fragments + the recovery key are derived deterministically from
 * the team's unique eventToken using SHA-256. No DB storage needed —
 * re-generating with the same token always gives the same result.
 *
 * Fragment hiding locations:
 *   fragment1 → X-Node-Id response header          (/status)
 *   fragment2 → JSON body _meta.sig field           (/services)
 *   fragment3 → X-Restricted-Fragment header (403)  (/internal)
 *   fragment4 → JSON body _trace field (hex-encoded)(/recovery)
 *   recoveryKey → validated on POST /validate
 */

export type M3Fragments = {
  fragment1: string;
  fragment2: string;
  fragment3: string;
  fragment4: string;
  fragment4Hex: string;
  recoveryKey: string;
};

function sha256Slice(eventToken: string, suffix: string, length: number): string {
  return createHash("sha256")
    .update(`${eventToken}:module:3:${suffix}`)
    .digest("hex")
    .slice(0, length)
    .toUpperCase();
}

export function generateM3Fragments(eventToken: string): M3Fragments {
  const fragment4 = sha256Slice(eventToken, "trace", 8);

  return {
    fragment1:   sha256Slice(eventToken, "node-id",    8),
    fragment2:   sha256Slice(eventToken, "service-sig", 8),
    fragment3:   sha256Slice(eventToken, "restricted",  8),
    fragment4,
    fragment4Hex: Buffer.from(fragment4, "utf8").toString("hex"),
    recoveryKey:  sha256Slice(eventToken, "gateway-recovery", 16),
  };
}
