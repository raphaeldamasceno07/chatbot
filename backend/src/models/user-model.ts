import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password?: string // Opcional porque usamos 'select: false'
  role: 'employee' | 'admin'
  avatar?: string
  is_online: boolean
  last_seen?: Date
  created_at: Date
  updated_at: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee',
    },
    avatar: { type: String },
    is_online: { type: Boolean, default: false },
    last_seen: { type: Date },
  },
  {
    // O Mongoose cuida das datas automaticamente
    timestamps: {
      createdAt: 'created_at',
      updated_at: 'updated_at',
    },
    // Isso garante que quando você converter para JSON (enviar para o front),
    // o _id apareça como id
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

export const UserModel = model<IUser>('User', userSchema)
