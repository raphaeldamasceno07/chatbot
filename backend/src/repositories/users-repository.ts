import type { IUser } from "@/models/user-model.js";

export type UserCreateInput = {
  name: string;
  email: string;
  password: string;
  role?: "employee" | "admin" | undefined;
  avatar?: string | null | undefined;
};
export interface UsersRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(data: UserCreateInput): Promise<IUser>;
}
