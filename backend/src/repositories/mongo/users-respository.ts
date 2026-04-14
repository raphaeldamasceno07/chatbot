import { UserModel, type User } from "@/models/user-model.js";
import type { UserCreateInput, UsersRepository } from "../users-repository.js";

export class MongoUsersRepository implements UsersRepository {
  findByEmail(email: string): Promise<User | null> {
    const user = UserModel.findOne({ email });
    return user;
  }
  create(data: UserCreateInput): Promise<User> {
    const user = new UserModel(data);
    return user.save();
  }
}
