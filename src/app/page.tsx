import Link from "next/link";
import { auth } from "@/features/auth/server/auth.config";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">TeamFlow</h1>
          <p className="mb-8 text-xl text-gray-600">
            リアルタイムコラボレーション機能を持つタスク管理
          </p>

          {session?.user ? (
            <Link
              href="/dashboard"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700"
            >
              ダッシュボードへ
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700"
            >
              はじめる
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
