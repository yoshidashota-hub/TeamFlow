import { auth } from "@/features/auth/server/auth.config";
import { redirect } from "next/navigation";
import { UserAvatar, SignOutButton } from "@/features/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <UserAvatar />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {session.user.name}!
          </h2>
          <p className="text-gray-600">
            プロジェクト機能は次のステップで実装します 🚀
          </p>
        </div>
      </main>
    </div>
  );
}
