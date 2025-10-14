import { trpc } from "@/shared/lib/trpc";

export function useAuth() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading,
  };
}
