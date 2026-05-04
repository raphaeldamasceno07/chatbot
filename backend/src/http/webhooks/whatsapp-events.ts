import type { IMessage } from '@/models/message-model.js'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { ProcessIncomingMessageUseCase } from '@/use-cases/messages/process-incoming-message.js'
import { type WASocket } from '@whiskeysockets/baileys'

export class WhatsAppEvents {
  static setup(sock: WASocket) {
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') {
        for (const msg of messages) {
          const m = msg.message
          console.log(msg)
          if (!m) continue

          let type: IMessage['type'] = 'text'
          let content = m.conversation || m.extendedTextMessage?.text
          let mediaUrl = undefined
          let mimetype = undefined
          let seconds = undefined

          // Lógica para detectar Mídia
          if (m.imageMessage) {
            type = 'image'
            content = m.imageMessage.caption // Legenda da foto
            mediaUrl = m.imageMessage.url
            mimetype = m.imageMessage.mimetype
          } else if (m.videoMessage) {
            type = 'video'
            content = m.videoMessage.caption
            mediaUrl = m.videoMessage.url
            mimetype = m.videoMessage.mimetype
            seconds = m.videoMessage.seconds
          } else if (m.audioMessage) {
            type = 'audio'
            mediaUrl = m.audioMessage.url
            mimetype = m.audioMessage.mimetype
            seconds = m.audioMessage.seconds
          }

          await ProcessIncomingMessageUseCase.execute({
            messageData: {
              remoteJid: msg.key.remoteJid!,
              pushName: msg.pushName || 'Desconhecido',
              content: content || '',
              fromMe: !!msg.key.fromMe,
              type: messageType,
              messageId: msg.key.id!,
              // metadados de mídia...
            },
          })

          console.log(
            `✅ [Memória] Mensagens totais: ${InMemoryUsersRepository.items.length}`,
          )
        }
      }
    })
  }
}
