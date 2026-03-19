import api from "./axios";
import { UserDto } from "../types/api";

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
  user: UserDto;
};

export const login = async (payload: LoginRequest) => {
  const res = await api.post<AuthResponse>("/api/auth/login", payload);
  return res.data;
};

export const register = async (payload: RegisterRequest) => {
  const res = await api.post<AuthResponse>("/api/auth/register", payload);
  return res.data;
};