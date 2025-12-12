// src/components/ui/Button.tsx
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...rest
}: Props) {
  const base = "px-4 py-2 rounded-xl font-medium shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition transform focus:ring-2 focus:ring-offset-1 focus:outline-none hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]";
  const styles: Record<string, string> = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "bg-transparent text-indigo-600",
  };

  return (
    <button {...rest} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
