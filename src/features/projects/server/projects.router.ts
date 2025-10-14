import { protectedProcedure, router } from "@/server/trpc";
import { z } from "zod";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema,
} from "../types/project.types";
import { ProjectService } from "./projects.service";

export const projectRouter = router({
  // プロジェクト一覧取得
  list: protectedProcedure.query(async ({ ctx }) => {
    return ProjectService.list(ctx.session.user.id!);
  }),

  // プロジェクト取得（単体）
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ProjectService.getById(input.id, ctx.session.user.id!);
    }),

  // プロジェクト作成
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      return ProjectService.create(input, ctx.session.user.id!);
    }),

  // プロジェクト更新
  update: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return ProjectService.update(id, data, ctx.session.user.id!);
    }),

  // プロジェクト削除
  delete: protectedProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ input, ctx }) => {
      return ProjectService.delete(input.id, ctx.session.user.id!);
    }),
});
