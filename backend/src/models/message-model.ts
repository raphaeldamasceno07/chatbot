import { Schema, model, type Document } from 'mongoose'

export interface IMessage extends Document {
  remoteJid: string
  pushName: string
  content?: string
  fromMe: boolean
  type: 'text' | 'image' | 'video' | 'audio' | 'other'
  mediaUrl?: string
  mimetype?: string
  seconds?: number
  messageId: string
  timestamp: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    remoteJid: { type: String, required: true, index: true },
    pushName: { type: String, default: 'Desconhecido' },
    content: { type: String },
    fromMe: { type: Boolean, required: true },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'other'],
      default: 'text',
    },
    mediaUrl: { type: String },
    mimetype: { type: String },
    seconds: { type: Number },
    messageId: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const MessageModel = model<IMessage>('Message', MessageSchema)
