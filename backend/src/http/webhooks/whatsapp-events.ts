import type { IMessage } from '@/models/message-model.js'
import { makeReceivingWaUseCase } from '@/use-cases/factories/make-receiving-wa-messages-use-case.js'
import { type WASocket } from '@whiskeysockets/baileys'

export class WhatsAppEvents {
  messageUseCase = makeReceivingWaUseCase()

  static setup(sock: WASocket) {
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') {
        for (const msg of messages) {
          const m = msg.message
          if (!m) continue

          // 1. Extração de dados (Parser)
          let currentType: IMessage['type'] = 'text'
          let content = m.conversation || m.extendedTextMessage?.text
          let mediaUrl, mimetype, seconds

          if (m.imageMessage) {
            currentType = 'image'
            content = m.imageMessage.caption
            mediaUrl = m.imageMessage.url
            mimetype = m.imageMessage.mimetype
          } else if (m.videoMessage) {
            currentType = 'video'
            content = m.videoMessage.caption
            mediaUrl = m.videoMessage.url
            mimetype = m.videoMessage.mimetype
            seconds = m.videoMessage.seconds
          } else if (m.audioMessage) {
            currentType = 'audio'
            mediaUrl = m.audioMessage.url
            mimetype = m.audioMessage.mimetype
            seconds = m.audioMessage.seconds
          }

          // 2. Execução do Use Case (Regra de Negócio)
          await messageUseCase.execute({
            messageData: {
              remoteJid: msg.key.remoteJid!,
              pushName: msg.pushName || 'Desconhecido',
              content: content || '',
              fromMe: !!msg.key.fromMe,
              type: currentType, // Ajustado para usar a variável correta
              messageId: msg.key.id!,
              mediaUrl,
              mimetype,
              seconds,
              timestamp: new Date(),
            },
          })

          console.log(
            `✅ [Memória] Mensagem de ${msg.pushName} salva. Total: ${messagesRepository.items.length}`,
          )
        }
      }
    })
  }
}
