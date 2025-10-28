"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
    >
      ログアウト
    </button>
  );
}
