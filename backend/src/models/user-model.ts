import { type InferSchemaType, model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String },
    is_online: { type: Boolean, default: false },
    last_seen: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export type User = InferSchemaType<typeof userSchema> & {
  id: string
}
export const UserModel = model<User>('User', userSchema)
