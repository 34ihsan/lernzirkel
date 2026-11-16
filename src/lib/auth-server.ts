import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken, SessionPayload } from "@/lib/auth";

// Server Component / Server Action / Route Handler içinden oturumu okur.
export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// API route handler'larının en üstünde çağrılır; geçersiz oturumda 401 fırlatır.
export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new AdminAuthError();
  }
  return session;
}

export class AdminAuthError extends Error {
  constructor() {
    super("Unauthorized");
  }
}
