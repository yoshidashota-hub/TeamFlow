import { authRouter } from "@/features/auth/server/auth.router";
import { dashboardRouter } from "@/features/dashboard/server/dashboard.router";
import { projectRouter } from "@/features/projects/server/projects.router";
import { taskRouter } from "@/features/tasks/server/task.router";
import { router } from "../trpc";

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter,
  projects: projectRouter,
  tasks: taskRouter,
});

export type AppRouter = typeof appRouter;
