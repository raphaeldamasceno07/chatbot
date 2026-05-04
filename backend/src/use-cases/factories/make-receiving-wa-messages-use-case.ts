import { MongoMessagesRepository } from '@/repositories/mongo/messages-repository.js'
import { ProcessIncomingMessageUseCase } from '../messages/process-incoming-message.js'

export function makeReceivingWaUseCase() {
  const messagesRepository = new MongoMessagesRepository()
  const processIncomingMessageUseCase = new ProcessIncomingMessageUseCase(
    messagesRepository,
  )

  return processIncomingMessageUseCase
}
