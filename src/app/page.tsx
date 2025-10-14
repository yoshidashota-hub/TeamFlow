import Link from "next/link";
import { auth } from "@/features/auth/server/auth.config";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">TeamFlow</h1>
          <p className="text-xl text-gray-600 mb-8">
            リアルタイムコラボレーション機能を持つタスク管理
          </p>

          {session?.user ? (
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ダッシュボードへ
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              はじめる
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
