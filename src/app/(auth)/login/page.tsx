import { LoginForm } from "@/features/auth/components/LoginForm";
import { auth } from "@/features/auth/server/auth.config";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="w-full max-w-md p-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800">
        <LoginForm />
      </div>
    </div>
  );
}
