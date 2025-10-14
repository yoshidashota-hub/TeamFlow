import { prisma } from "@/shared/lib/prisma";
import { TRPCError } from "@trpc/server";

export class AuthService {
  // ユーザー情報取得
  static async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "ユーザーが見つかりません",
      });
    }

    return user;
  }
}
