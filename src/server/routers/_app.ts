import { authRouter } from "@/features/auth/server/auth.router";
import { projectRouter } from "@/features/projects/server/projects.router";
import { router } from "../trpc";

export const appRouter = router({
  auth: authRouter,
  projects: projectRouter,
});

export type AppRouter = typeof appRouter;
