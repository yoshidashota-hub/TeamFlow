import * as React from "react";
import { cn } from "@/shared/lib/utils";

export const PRESET_COLORS = [
  "#3B82F6", // 青
  "#10B981", // 緑
  "#F59E0B", // 黄
  "#EF4444", // 赤
  "#8B5CF6", // 紫
  "#EC4899", // ピンク
  "#14B8A6", // シアン
  "#F97316", // オレンジ
  "#6366F1", // インディゴ
  "#84CC16", // ライムグリーン
] as const;

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          title={`カラー ${color}`}
          onClick={() => onChange(color)}
          className={cn(
            "h-10 w-10 rounded-full transition-all",
            value === color
              ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-900"
              : "opacity-80 hover:scale-105 hover:opacity-100"
          )}
          style={{ backgroundColor: color }}
          aria-label={`カラー ${color}`}
        />
      ))}
    </div>
  );
}
