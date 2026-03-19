import api from "./axios";
import { UserDto, UserSettingsDto } from "../types/api";

export const getCurrentUser = async () => {
  const res = await api.get<UserDto>("/api/users/me");
  return res.data;
};

export const getUserSettings = async () => {
  const res = await api.get<UserSettingsDto>("/api/settings");
  return res.data;
};

export const updateUserSettings = async (data: UserSettingsDto) => {
  const res = await api.put<UserSettingsDto>("/api/settings", data);
  return res.data;
};