"use client";

import { useAuth } from "../hooks/useAuth";
import Image from "next/image";

export function UserAvatar() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name || "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
      <div className="hidden md:block">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}
