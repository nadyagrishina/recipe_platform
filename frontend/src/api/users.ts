import { api } from "./axios";

export type UserDto = {
  id?: number;
  username: string;
};

export async function getUserByUsername(username: string) {
  const res = await api.get<UserDto>(`/api/users/user/${username}`);
  return res.data;
}
