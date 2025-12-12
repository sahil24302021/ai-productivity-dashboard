// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "@/components/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/hooks/authStore";
import api from "@/api/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
  const res = await api.post(`/api/auth/login`, {
        email,
        password,
      });

      const { token } = res.data;

      if (!token) {
        throw new Error("No token returned from server");
      }

  // Persist and set store
  useAuthStore.getState().setToken(token);

      // Redirect
  navigate("/tasks", { replace: true });
    } catch (error: any) {
      setErr(error?.response?.data?.error || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Sign in to Productivity">
      <form onSubmit={submit} className="space-y-4">
        {err && <div className="text-sm text-red-600">{err}</div>}

        <label className="text-sm text-gray-700">Email</label>
        <Input
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm text-gray-700">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between mt-2">
          <Link
            to="/signup"
            className="text-sm text-indigo-600 hover:underline"
          >
            Create account
          </Link>

          <Button
            type="submit"
            variant="primary"
            className={loading ? "opacity-80 pointer-events-none" : ""}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
