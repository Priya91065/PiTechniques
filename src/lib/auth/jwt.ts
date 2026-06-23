import { SignJWT, jwtVerify } from "jose";

/**
 * JWT access-token helpers built on `jose` so they run in BOTH the Node API
 * routes and the Edge middleware. Reads the secret directly from
 * `process.env.JWT_ACCESS_SECRET` (statically referenced so Next inlines it for
 * the edge runtime).
 */
const encoder = new TextEncoder();

function accessSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_ACCESS_SECRET is missing or shorter than 32 characters");
  }
  return encoder.encode(secret);
}

export interface AccessPayload {
  sub: string; // user id
  email: string;
  role: string;
  name: string;
}

export async function signAccessToken(payload: AccessPayload): Promise<string> {
  const ttl = process.env.JWT_ACCESS_TTL || "15m";
  return new SignJWT({ email: payload.email, role: payload.role, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(accessSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecret());
    if (!payload.sub) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? ""),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}
