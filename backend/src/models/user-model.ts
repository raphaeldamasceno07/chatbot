// @/models/user-model.ts
import { Document, Schema, model } from "mongoose";

// Defina como TIPO para garantir que o TS trate como objeto literal
export type IUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "employee" | "admin";
  avatar?: string | null;
  is_online: boolean;
  last_seen?: Date;
  created_at: Date;
  updated_at: Date;
};

// Interface para retorno sem senha (Opcional, mas boa prática)
export type IUserSafe = Omit<IUser, "password">;

// INTERFACE INTERNA (Essa fica isolada aqui dentro)
interface IUserDocument extends Omit<IUser, "id">, Document {
  _id: any;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
    avatar: { type: String, default: null },
    is_online: { type: Boolean, default: false },
    last_seen: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const UserModel = model<IUserDocument>("User", userSchema);
