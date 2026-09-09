import { cookies } from "next/headers";

export type SessionUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  token: string;
  phone_number?: string | null;
  user_type: "ADMIN" | "CUSTOMER";
  first_name?: string;
  last_name?: string;
};

const SESSION_COOKIE = "trivya_session";
const CUSTOMER_SESSION_COOKIE = "customer_session";

const SESSION_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/* =========================================================
   ADMIN SESSION
========================================================= */

export async function createSession(user: SessionUser) {
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    JSON.stringify(user),
    SESSION_OPTIONS
  );
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();

  const session = cookieStore.get(SESSION_COOKIE);

  if (!session?.value) {
    return null;
  }

  try {
    return JSON.parse(session.value) as SessionUser;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}





/* =========================================================
   CUSTOMER SESSION
========================================================= */

export async function createCustomerSession(
  user: SessionUser
) {
  const cookieStore = await cookies();

  cookieStore.set(
    CUSTOMER_SESSION_COOKIE,
    JSON.stringify(user),
    SESSION_OPTIONS
  );
}

export async function getCustomerSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();

  const session = cookieStore.get(CUSTOMER_SESSION_COOKIE);

  if (!session?.value) {
    return null;
  }

  try {
    return JSON.parse(session.value) as SessionUser;
  } catch {
    return null;
  }
}

export async function deleteCustomerSession() {
  const cookieStore = await cookies();

  cookieStore.delete(CUSTOMER_SESSION_COOKIE);
}