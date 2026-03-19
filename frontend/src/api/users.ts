import api from "./axios";

export type UserDto = {
  id?: number;
  username: string;
  name: string;
  surname: string;
  email: string;
};

export const getCurrentUser = async () => {
  const res = await api.get<UserDto>("/api/users/me");
  return res.data;
};

export const getUserByUsername = async (username: string) => {
  const res = await api.get<UserDto>(`/api/users/user/${username}`);
  return res.data;
};

export const updateCurrentUser = async (data: Partial<UserDto>) => {
  const res = await api.put<UserDto>("/api/users/me", data);
  return res.data;
};

export const getUserSettings = async () => {
  const res = await api.get("/api/settings");
  return res.data;
};

export const updateUserSettings = async (data: any) => {
  const res = await api.put("/api/settings", data);
  return res.data;
};