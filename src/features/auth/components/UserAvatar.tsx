"use client";

import { useAuth } from "../hooks/useAuth";
import Image from "next/image";

export function UserAvatar() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />;
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
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
