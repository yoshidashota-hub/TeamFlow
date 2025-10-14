import { ReactNode } from "react";
import { auth } from "@/features/auth/server/auth.config";
import { redirect } from "next/navigation";
import { Header } from "@/shared/components/Header";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
