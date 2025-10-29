import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  showName?: boolean;
}

const sizeMap = {
  sm: { container: "h-5 w-5", image: 20, text: "text-xs" },
  md: { container: "h-6 w-6", image: 24, text: "text-xs" },
  lg: { container: "h-8 w-8", image: 32, text: "text-sm" },
};

export function UserAvatar({
  image,
  name,
  size = "md",
  className,
  showName = false,
}: UserAvatarProps) {
  const sizeConfig = sizeMap[size];
  const initial = name?.[0] || "?";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {image ? (
        <Image
          src={image}
          alt={name || ""}
          width={sizeConfig.image}
          height={sizeConfig.image}
          className="rounded-full"
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-purple-500/20",
            sizeConfig.container
          )}
        >
          <span className={cn("text-purple-400", sizeConfig.text)}>{initial}</span>
        </div>
      )}
      {showName && <span className="text-sm text-gray-300">{name}</span>}
    </div>
  );
}
