import { auth } from "@/features/auth/server/auth.config";
import { prisma } from "@/shared/lib/prisma";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const session = await auth();

  return {
    session,
    prisma,
    headers: opts?.req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
