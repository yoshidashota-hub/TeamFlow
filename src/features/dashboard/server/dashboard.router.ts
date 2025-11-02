import { router, protectedProcedure } from "@/server/trpc";
import { DashboardService } from "./dashboard.service";

export const dashboardRouter = router({
  // ダッシュボードデータ取得
  getData: protectedProcedure.query(async ({ ctx }) => {
    return DashboardService.getDashboardData(ctx.session.user.id!);
  }),
});
