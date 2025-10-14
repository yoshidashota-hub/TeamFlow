"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
    >
      ログアウト
    </button>
  );
}
