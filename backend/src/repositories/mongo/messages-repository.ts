import { MessageModel, type IMessage } from '@/models/message-model.js'
import type { InMemoryMessagesRepository } from '../in-memory/in-memory-messages-repository.js'

export class MongoMessagesRepository implements InMemoryMessagesRepository {
  async create(data: Partial<IMessage>): Promise<IMessage> {
    const message = new MessageModel(data)
    return await message.save()
  }

  async findByJid(remoteJid: string): Promise<IMessage[]> {
    return await MessageModel.find({
      remoteJid,
    })
      .sort({ timestamp: 1 })
      .exec()
  }
}
