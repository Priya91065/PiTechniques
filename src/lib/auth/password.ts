import bcrypt from "bcryptjs";

/** Hash a plaintext password using bcrypt (cost from BCRYPT_ROUNDS). */
export function hashPassword(plain: string): Promise<string> {
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12);
  return bcrypt.hash(plain, rounds);
}

/** Constant-time compare of a plaintext password against a bcrypt hash. */
export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
