import { type InferSchemaType, model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
    avatar: { type: String },
    is_online: { type: Boolean, default: false },
    last_seen: { type: Date },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

type UserSchemaProps = InferSchemaType<typeof userSchema>

export type User = UserSchemaProps & {
  id: string
  created_at: Date
  updated_at: Date
}

export const UserModel = model<User>('User', userSchema)
