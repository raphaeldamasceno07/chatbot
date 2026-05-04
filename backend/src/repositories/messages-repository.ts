import type { IMessage } from '@/models/message-model.js'

export interface MessageRepository {
  create(data: Partial<IMessage>): Promise<IMessage>
  findByJid(remoteJid: string): Promise<IMessage[]>
}
