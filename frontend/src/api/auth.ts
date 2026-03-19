import api from "./axios";

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: any;
};

export const login = async (payload: LoginRequest) => {
  const res = await api.post<AuthResponse>("/api/auth/login", payload);
  return res.data;
};

export const register = async (payload: RegisterRequest) => {
  const res = await api.post<AuthResponse>("/api/auth/register", payload);
  return res.data;
};