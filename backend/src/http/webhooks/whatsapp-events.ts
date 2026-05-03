import { type WASocket } from '@whiskeysockets/baileys'

export class WhatsAppEvents {
  static setup(sock: WASocket) {
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') {
        for (const msg of messages) {
          // Ignora mensagens enviadas por você mesmo
          if (!msg.key.fromMe && msg.message) {
            const jid = msg.key.remoteJid!
            const content = (
              msg.message.conversation || msg.message.extendedTextMessage?.text
            )
              ?.toLowerCase()
              .trim() // Normaliza para facilitar a comparação

            console.log(`📩 Mensagem de ${jid}: ${content}`)

            if (content === 'teste') {
              // 1. Simula "digitando..." para parecer humano
              await sock.sendPresenceUpdate('composing', jid)

              // 2. Aguarda um delay (ex: 3 segundos)
              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * (5000 - 2000) + 2000),
              )

              // 3. Para de digitar e envia
              await sock.sendPresenceUpdate('paused', jid)

              await sock.sendMessage(jid, {
                text: 'Chegou aqui! 🚀',
              })
            }
          }
        }
      }
    })
  }
}
