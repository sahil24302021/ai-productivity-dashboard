// src/pages/SignupPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "@/components/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import axios from "axios";
import { useAuthStore } from "@/hooks/authStore";

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const base = import.meta.env.VITE_API_BASE;
      const res = await axios.post(`${base}/api/auth/signup`, {
        email,
        password,
      });

      const { token, user } = res.data;
      setAuth(token, user);

      navigate("/dashboard");
    } catch (error: any) {
      setErr(error?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create your account">
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
          <Link to="/login" className="text-sm text-indigo-600 hover:underline">
            Already have an account?
          </Link>

          <Button
            type="submit"
            variant="primary"
            className={loading ? "opacity-80 pointer-events-none" : ""}
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
