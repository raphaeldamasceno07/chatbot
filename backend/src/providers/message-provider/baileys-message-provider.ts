import { BaileysConnection } from '@/lib/bayleys-connection.js'

export class BaileysMessageProvider {
  async sendMessage(to: string, body: string) {
    const sock = await BaileysConnection.getConnectedInstance()
    await sock.sendMessage(to, { text: body })
  }
}
