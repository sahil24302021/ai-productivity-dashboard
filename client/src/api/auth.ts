// src/api/auth.ts
import api from "./client";

export type LoginPayload = { email: string; password: string };
export type SignupPayload = { name: string; email: string; password: string };

export async function loginApi(payload: LoginPayload) {
  // backend endpoint: /api/auth/login
  const res = await api.post("/api/auth/login", payload);
  return res.data;
}

export async function signupApi(payload: SignupPayload) {
  // backend endpoint: /api/auth/signup
  const res = await api.post("/api/auth/signup", payload);
  return res.data;
}
