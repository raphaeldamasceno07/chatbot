import { model, Schema, Types } from 'mongoose'

export interface IMessage extends Document {
  conversationId: Types.ObjectId
  senderId: Types.ObjectId
  content: string
  type: 'text' | 'image' | 'file' | 'audio' | 'video' // Adicionei video
  mediaUrl?: string
  fileName?: string // Nome original: "aula_calculo.pdf"
  fileSize?: number // Tamanho em bytes
  createdAt: Date
}

const messageSchema = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video'],
    default: 'text',
  },
  mediaUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  createdAt: { type: Date, default: Date.now },
})

export const MessageModel = model<IMessage>('Message', messageSchema)
