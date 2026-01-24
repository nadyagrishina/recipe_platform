import { api } from "./axios";

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export async function login(payload: LoginRequest) {
  const res = await api.post<LoginResponse>("/api/auth/login", payload);
  return res.data;
}

export async function register(payload: RegisterRequest) {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
}