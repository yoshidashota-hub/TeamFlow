import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

        // タスクステータス用
        notStarted: "bg-gray-500/10 text-gray-300 border-gray-500/20",
        inProgress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        completed: "bg-green-500/10 text-green-400 border-green-500/20",

        // タスク優先度用
        low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        urgent: "bg-red-500/10 text-red-400 border-red-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

// ヘルパー関数: ステータス文字列からバリアントを取得
export function getStatusVariant(
  status: string
): VariantProps<typeof badgeVariants>["variant"] {
  switch (status) {
    case "未着手":
      return "notStarted";
    case "進行中":
      return "inProgress";
    case "レビュー":
      return "review";
    case "完了":
      return "completed";
    default:
      return "default";
  }
}

// ヘルパー関数: 優先度文字列からバリアントを取得
export function getPriorityVariant(
  priority: string
): VariantProps<typeof badgeVariants>["variant"] {
  switch (priority) {
    case "低":
      return "low";
    case "中":
      return "medium";
    case "高":
      return "high";
    case "緊急":
      return "urgent";
    default:
      return "default";
  }
}

export { Badge, badgeVariants }
