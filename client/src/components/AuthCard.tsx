// src/components/AuthCard.tsx
import React from "react";

export default function AuthCard({ title, children }: { title: string; children: React.ReactNode; }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{title}</h1>
        {children}
      </div>
    </div>
  );
}
