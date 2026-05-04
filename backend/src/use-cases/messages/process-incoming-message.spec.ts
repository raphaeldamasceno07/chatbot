import { InMemoryMessagesRepository } from '@/repositories/in-memory/in-memory-messages-repository.js'
import { ProcessIncomingMessageUseCase } from './process-incoming-message.js'

let messagesRepository: InMemoryMessagesRepository
let sut: ProcessIncomingMessageUseCase

describe('Process Incoming Message Use Case', () => {
  beforeEach(() => {
    messagesRepository = new InMemoryMessagesRepository()
    sut = new ProcessIncomingMessageUseCase(messagesRepository)
  })

  it.only('should be able to process and save a text message', async () => {
    const { message } = await sut.execute({
      messageData: {
        remoteJid: '123456789@s.whatsapp.net',
        pushName: 'Raphael Damasceno',
        content: 'Olá, este é um teste',
        fromMe: false,
        type: 'text',
        messageId: 'ABC-123',
        timestamp: new Date(),
      },
    })

    console.log(message)

    expect(message._id).toEqual(expect.any(String))
    expect(messagesRepository.items).toHaveLength(1)
    expect(messagesRepository.items[0]?.content).toBe('Olá, este é um teste')
  })
})
