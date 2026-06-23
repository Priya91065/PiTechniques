import { NextResponse } from "next/server";

/** Typed JSON success response. */
export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/** Typed JSON error response: { error, code? }. */
export function jsonError(message: string, status = 400, code?: string): NextResponse {
  return NextResponse.json({ error: message, code }, { status });
}
