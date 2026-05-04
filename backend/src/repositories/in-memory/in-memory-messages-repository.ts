import type { IMessage } from '@/models/message-model.js'
import { randomUUID } from 'node:crypto'
import type { IMessageRepository } from '../messages-repository.js'

export class InMemoryMessagesRepository implements IMessageRepository {
  public items: IMessage[] = []

  async create(data: Partial<IMessage>): Promise<IMessage> {
    const message = {
      _id: randomUUID(), // Simula o ID do MongoDB
      remoteJid: data.remoteJid!,
      pushName: data.pushName || 'Desconhecido',
      content: data.content || '',
      fromMe: !!data.fromMe,
      type: data.type || 'text',
      mediaUrl: data.mediaUrl,
      mimetype: data.mimetype,
      seconds: data.seconds,
      messageId: data.messageId || randomUUID(),
      timestamp: data.timestamp || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as IMessage

    this.items.push(message)
    return message
  }

  async findByJid(remoteJid: string): Promise<IMessage[]> {
    return this.items.filter((item) => item.remoteJid === remoteJid)
  }
}
