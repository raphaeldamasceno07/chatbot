import { UserModel, type IUser } from "@/models/user-model.js";
import type { UserCreateInput, UsersRepository } from "../users-repository.js";

export class MongoUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email }).lean();

    if (!user) return null;

    return {
      ...user,
      id: user._id.toString(),
    } as IUser;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id).lean();

    if (!user) return null;

    return {
      ...user,
      id: user._id.toString(),
    } as IUser;
  }

  async create(data: UserCreateInput): Promise<IUser> {
    const user = new UserModel(data);
    const savedUser = await user.save();

    // Transformando o documento do Mongoose em um objeto que segue sua interface IUser
    const userObject = savedUser.toObject();

    return {
      ...userObject,
      id: userObject._id.toString(),
    } as IUser;
  }
}
