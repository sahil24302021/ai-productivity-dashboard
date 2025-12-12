import React from "react";

type PremiumCardProps = {
  label?: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  gradient?: "blue" | "green" | "red" | "purple" | string;
  className?: string;
  onClick?: () => void;
};

// Map named gradients to Tailwind classes with arbitrary color values
const gradientMap: Record<string, string> = {
  blue: "from-[#f7faff] to-[#eef3ff]",
  green: "from-[#f6fff7] to-[#e9ffef]",
  red: "from-[#fff7f7] to-[#ffecec]",
  purple: "from-[#faf5ff] to-[#f3e8ff]",
};

export function PremiumCard({
  label,
  value,
  children,
  gradient = "blue",
  className = "",
  onClick,
}: PremiumCardProps) {
  const gradientClasses = gradientMap[gradient] || gradient;

  return (
    <div
      onClick={onClick}
      className={[
        "bg-gradient-to-br",
        gradientClasses,
        // Core premium styles
        "rounded-[22px] border border-gray-200",
        "shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
        "p-6 transition-transform duration-200",
        "hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]",
        className,
      ].join(" ")}
    >
      {(label || value) && (
        <div className="flex items-end justify-between">
          {label && (
            <div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          )}
          {value !== undefined && (
            <div className="text-3xl font-bold text-gray-900">{value}</div>
          )}
        </div>
      )}
      {children && <div className={label || value ? "mt-4" : undefined}>{children}</div>}
    </div>
  );
}

export default PremiumCard;
