import * as React from "react";
import { Label } from "./label";
import { cn } from "@/shared/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  required = false,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-gray-300">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
