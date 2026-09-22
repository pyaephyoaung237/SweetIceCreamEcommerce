// Safe to import from middleware (edge) and server code.
export const SESSION_COOKIE = "pedalworks_session";

export function authSecret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "dev-only-secret-please-set-AUTH_SECRET-in-env"
  );
}

export type Role = "admin" | "supervisor" | "customer";

export function homeFor(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "supervisor") return "/supervisor";
  return "/account/orders";
}
