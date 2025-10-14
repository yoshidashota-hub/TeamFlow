import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { AuthService } from "./auth.service";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    return AuthService.getUser(ctx.session.user.id!);
  }),
});
