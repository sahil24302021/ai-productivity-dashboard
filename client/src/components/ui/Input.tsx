// src/components/ui/Input.tsx
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...rest }: Props) {
  return (
    <input
      {...rest}
      className={
  "w-full px-4 py-3 rounded-[22px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white " +
        className
      }
    />
  );
}
