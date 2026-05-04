import type { IMessageRepository } from '@/repositories/messages-repository.js'

interface ProcessIncomingMessageRequest {
  messageData: {
    remoteJid: string
    pushName: string
    content?: string
    fromMe: boolean
    type: 'text' | 'image' | 'video' | 'audio' | 'other'
    messageId: string
    mediaUrl?: string
    mimetype?: string
    seconds?: number
    timestamp?: Date
  }
}

export class ProcessIncomingMessageUseCase {
  constructor(private messagesRepository: IMessageRepository) {}

  async execute({ messageData }: ProcessIncomingMessageRequest) {
    // Agora o TypeScript sabe exatamente o que está sendo enviado
    const message = await this.messagesRepository.create(messageData)

    return { message }
  }
}
