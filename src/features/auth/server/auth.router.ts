import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { AuthService } from "./auth.service";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    return AuthService.getUser(ctx.session.user.id!);
  }),

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return users;
  }),
});
