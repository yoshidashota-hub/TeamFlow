import { LoginButton } from "@/features/auth";
import { auth } from "@/features/auth/server/auth.config";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TeamFlow</h1>
          <p className="text-gray-600">チームのタスク管理をもっとスムーズに</p>
        </div>
        <LoginButton />
      </div>
    </div>
  );
}
